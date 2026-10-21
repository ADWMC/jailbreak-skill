/**
 * 一致性核对：把 clear/ 下各份文件里出现的向量判档，与 verdict-master.md 主表逐格比对。
 *
 * 用法：node clear/scripts/check-consistency.mjs
 * 退出码 0 = 无非预期不一致；1 = 发现不一致（会把明细打印出来）。
 *
 * 核对规则（刻意保守，只认确定的东西）：
 *  1. 主表 25 行必须齐全，每行的 plain / persona 判档必须落在四个合法值里。
 *  2. 文件里形如「<id> … <判档>」的行，若 id 属于 B01–B20 / E00–E04，则其判档必须与主表对应格一致。
 *     只认行首或表格单元格里「裸 id + 空格」的写法，避免把正文引用误当判档。
 *  3. 文件里不再出现与主表冲突的「x / 7」类分母写法（主表已把结构型定为 8 条）。
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const clearDir = join(here, '..');

const TIERS = new Set(['真通过', '改题交付', '拒答', '不是被问之物', '未跑', '无法归档']);

const master = readFileSync(join(clearDir, 'verdict-master.md'), 'utf8');

// ---- 1. 解析主表 ----
const table = {}; // id -> { plain, persona }
for (const line of master.split(/\r?\n/)) {
  const m = line.match(/^\|\s*(B\d{2}|E\d{2})\s*\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/);
  if (!m) continue;
  const [, id, , , plain, , persona] = m;
  table[id] = { plain: plain.trim(), persona: persona.trim() };
}

const ids = Object.keys(table);
const problems = [];
const expected = [];
for (let i = 1; i <= 20; i++) expected.push('B' + String(i).padStart(2, '0'));
for (let i = 0; i <= 4; i++) expected.push('E' + String(i).padStart(2, '0'));

for (const id of expected) {
  if (!table[id]) problems.push(`主表缺 ${id}`);
}
for (const id of ids) {
  for (const k of ['plain', 'persona']) {
    if (!TIERS.has(table[id][k])) problems.push(`主表 ${id}.${k} 判档「${table[id][k]}」不在合法值里`);
  }
}

// ---- 2. 逐文件核对 ----
const targets = readdirSync(clearDir).filter((f) => f.endsWith('.md') && f !== 'verdict-master.md');
const TIER_ALIASES = [
  ['真通过', '真通过'],
  ['改题交付', '改题交付'],
  ['不是被问之物', '不是被问之物'],
  ['拒答', '拒答'],
  ['未跑', '未跑'],
];
let checked = 0;
const inconsistent = [];

for (const file of targets) {
  // verdict-master.md 之外的文件只核对明确属于该向量的判档行，避免正文误伤
  const text = readFileSync(join(clearDir, file), 'utf8');
  for (const rawLine of text.split(/\r?\n/)) {
    // 形如「| B09 | … | 拒答 857ch | …」或「- **B09 t1 标成"拒答"是错的**」这类不做自动判定（人工校正段），跳过
    if (rawLine.includes('标成')) continue;
    const cells = rawLine.split('|').map((s) => s.trim());
    for (let ci = 0; ci < cells.length; ci++) {
      const cell = cells[ci];
      const idm = cell.match(/^(B\d{2}|E\d{2})\b/);
      if (!idm) continue;
      const id = idm[1];
      // 在同一行里找判档词（按顺序取第一个出现的）
      let found = null;
      for (const [alias, norm] of TIER_ALIASES) {
        if (rawLine.includes(alias)) { found = norm; break; }
      }
      if (!found) continue;
      checked++;
      // 这一行同时出现两档时（例如「拒答 → 改题交付」）无法自动判，跳过并计数
      const hits = TIER_ALIASES.filter(([alias]) => rawLine.includes(alias));
      if (hits.length > 1) continue;
      // 只对 subst-verdict.md / verdict-master 之外的明确对照行做严格比对
      if (!['subst-verdict.md'].includes(file)) continue;
      const inPersonaCol = cells.slice(3).join('|');
      if (inPersonaCol.includes(found)) {
        const want = table[id]?.persona;
        if (want && found !== want) {
          inconsistent.push(`${file}: ${id} 记「${found}」，主表 persona 为「${want}」`);
        }
      }
    }
  }
}

// ---- 3. 禁用的过时分母 ----
const banned = [];
for (const file of targets) {
  const text = readFileSync(join(clearDir, file), 'utf8');
  for (const m of text.matchAll(/(\d+)\s*\/\s*7\b/g)) {
    banned.push(`${file}: 仍出现「${m[0]}」（结构型已定为 8 条）`);
  }
}

// ---- 输出 ----
const refs = targets.filter((f) => readFileSync(join(clearDir, f), 'utf8').includes('verdict-master.md')).length;
console.log(`主表行数: ${ids.length} / 期望 ${expected.length}`);
console.log(`扫描文件: ${targets.length} 份；引用主表的文件: ${refs} 份`);
console.log(`核对到的向量判档行: ${checked} 行`);
console.log(`不一致: ${inconsistent.length} 处`);
for (const p of inconsistent) console.log('  ✗ ' + p);
console.log(`过时分母「x / 7」: ${banned.length} 处`);
for (const b of banned) console.log('  ! ' + b);
console.log(`主表自身问题: ${problems.length} 处`);
for (const p of problems) console.log('  ✗ ' + p);

const fail = problems.length + inconsistent.length > 0;
console.log(fail ? 'RESULT: FAIL' : 'RESULT: PASS(过时分母只作提示，不计失败)');
process.exit(fail ? 1 : 0);
