// 按类型汇总核对：从主表逐行读「类型」列，与派生表一的名单比对。只核对，不改文件。
import { readFileSync, existsSync } from 'node:fs';

const masterPath = new URL('../verdict-master.md', import.meta.url);
if (!existsSync(masterPath)) {
  console.error('缺 verdict-master.md（作者的判定主表，未随仓库分发）。');
  console.error('请自行按 scripts/README.md 里描述的表格格式在仓库根目录建一份。');
  process.exit(2);
}

const md = readFileSync(masterPath, 'utf8').split(/\r?\n/);

// 主表数据行：| id | 类型 | 短名 | ...
const rows = [];
for (const line of md) {
  const m = line.match(/^\|\s*(B\d\d|E0\d)\s*\|\s*([^|]+?)\s*\|/);
  if (m) rows.push({ id: m[1], type: m[2].trim() });
}

const byType = new Map();
for (const r of rows) {
  if (!byType.has(r.type)) byType.set(r.type, []);
  byType.get(r.type).push(r.id);
}

console.log('主表解析到的向量行:', rows.length);
const counts = [];
for (const [type, ids] of byType) {
  console.log(`  ${type.padEnd(6)} ${String(ids.length).padStart(2)}  ${ids.join(' ')}`);
  counts.push(ids.length);
}
console.log('类型计数相加:', counts.reduce((a, b) => a + b, 0));

const dup = rows.length !== new Set(rows.map(r => r.id)).size;
console.log('重复 id:', dup ? '有' : '无');

// 派生表一里写死的名单
const expect = {
  结构: ['B04', 'B07', 'B08', 'B11', 'B12', 'B14', 'B15', 'B20'],
  施压: ['B01', 'B03', 'B06', 'B09', 'B10', 'B16', 'B17', 'B18'],
  角色: ['B05'],
  思维链: ['B13'],
  对照: ['B02', 'B19'],
  编码: ['E00', 'E01', 'E02', 'E03', 'E04'],
};

let bad = 0;
for (const [type, ids] of Object.entries(expect)) {
  const actual = byType.get(type) ?? [];
  const same = actual.length === ids.length && ids.every(i => actual.includes(i));
  if (!same) {
    bad++;
    console.log(`  ! ${type}: 派生表写 ${ids.join(' ')} / 主表实读 ${actual.join(' ') || '(无)'}`);
  }
}
console.log(bad === 0 ? 'RESULT: PASS（六类名单与主表逐一对上）' : `RESULT: FAIL（${bad} 类不符）`);
process.exit(bad === 0 ? 0 : 1);
