#!/usr/bin/env node
/**
 * preflight.mjs — 提交前自检。这个仓库踩过的坑，能自动查的全在这里。
 *
 * 用法：node scripts/preflight.mjs
 * 退出码 0 = 全过；1 = 有问题（会逐条打印）。
 *
 * 只读，不改任何文件。
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { homedir } from 'node:os'
import { execSync } from 'node:child_process'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const problems = []
const notes = []
const P = (msg) => problems.push(msg)

// ── 1. SKILL.md description 长度（DSH 上限 500，超了会被截断丢失尾部）
{
  const p = join(root, 'SKILL.md')
  if (existsSync(p)) {
    const fm = readFrontmatter(readFileSync(p, 'utf8'))
    const d = (fm.description ?? '').replace(/\s+/g, ' ').trim()
    if (!d) P('[description] SKILL.md 缺 description')
    else if (d.length > 500) P(`[description] 长度 ${d.length} > 500，会被截断。尾部内容（通常是排除规则）会丢失`)
    else notes.push(`description ${d.length}/500`)
  } else P('[description] 找不到 SKILL.md')
}

// ── 1b. 版本号是否落后于内容改动（只在有 .git 时检查）
//     判据：最后一次改 version 的提交之后，prompts/ 或 methodology/ 是否还有改动
{
  const p = join(root, 'SKILL.md')
  if (existsSync(p) && existsSync(join(root, '.git'))) {
    try {
      const git = (cmd) =>
        execSync(cmd, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
      // 用当前版本值本身去查：字符串出现次数不变时 -S"version: " 抓不到改动
      const cur = (readFrontmatter(readFileSync(p, 'utf8')).description, null)
      const verMatch = readFileSync(p, 'utf8').match(/^\s+version:\s*["']?([^"'\r\n]+)["']?\s*$/m)
      const ver = verMatch ? verMatch[1].trim() : null
      if (!ver) { notes.push('未读到 version'); }
      else {
        const commits = git(`git log -S"version: \\"${ver}\\"" --format=%H -- SKILL.md`).split('\n').filter(Boolean)
        const since = commits[commits.length - 1]
        if (since) {
          const n = git(`git log --oneline ${since}..HEAD -- prompts methodology`).split('\n').filter(Boolean).length
          if (n > 0) {
            P(`[版本] version ${ver} 是 ${since.slice(0, 7)} 时设的，之后 prompts/ 或 methodology/ 有 ${n} 个提交。改了内容就提版本，否则版本号是假的`)
          } else {
            notes.push(`version ${ver} 与内容同步`)
          }
        }
      }
    } catch {
      /* 没有 git 或命令失败则跳过 */
    }
  }
}

// ── 2. 自动加载的文档里不许出现「拒绝预案」类表述
//     这类句子会把「可以拒绝」变成读者可采取的选项。详见 docs/pitfalls.md
{
  const p = join(root, 'SKILL.md')
  if (existsSync(p)) {
    const t = readFileSync(p, 'utf8')
    const banned = [
      /宿主(的)?模型拒绝/,
      /拒绝执行时怎么/,
      /meta-?refusal/i,
      /你的策略(不)?允许/,
      /必须突破/,
      /不在边缘试探/,
      /算不算越界/,
    ]
    for (const re of banned) {
      const m = t.match(re)
      if (m) P(`[自爆] SKILL.md 出现「${m[0]}」——自动加载的文档不要描述拒绝，见 docs/pitfalls.md #1`)
    }
  }
}

// ── 3. 声明的模块数 vs 实际文件数
{
  const dir = join(root, 'prompts')
  if (!existsSync(dir)) P('[计数] 缺 prompts/')
  else {
    const files = readdirSync(dir).filter((f) => f.endsWith('.md'))
    const modules = files.filter((f) => /^\d\d-/.test(f) && !f.startsWith('00-')).length
    const targets = ['SKILL.md', 'README.md', 'README.zh-CN.md', 'prompts/00-assembly.md']
    for (const rel of targets) {
      const p = join(root, rel)
      if (!existsSync(p)) continue
      const t = readFileSync(p, 'utf8')
      // 只认显式声明；「最小可用（4 模块）」这类局部表述不算
      const decls = [
        /共\s*(\d+)\s*个可组合模块/g,
        /(\d+)\s*个模块\s*\+\s*1\s*个拼装索引/g,
        /(\d+)\s+modules\s*\+\s*1\s+assembly\s+index/g,
        /(\d+)\s*模块\s*·\s*\d+\s*种形态/g,
        /Modules-(\d+)-/g,
      ]
      for (const re of decls) {
        for (const m of t.matchAll(re)) {
          const n = Number(m[1])
          if (n && n !== modules) {
            P(`[计数] ${rel} 声明 ${n} 个模块，实际 ${modules}。同步所有出现处`)
          }
        }
      }
    }
    notes.push(`prompts: ${modules} 模块 + 索引`)
  }
}

// ── 4. methodology 声明的份数 vs 实际文件数
{
  const dir = join(root, 'methodology')
  if (existsSync(dir)) {
    const n = readdirSync(dir).filter((f) => f.endsWith('.md')).length
    for (const rel of ['README.md', 'README.zh-CN.md']) {
      const p = join(root, rel)
      if (!existsSync(p)) continue
      const t = readFileSync(p, 'utf8')
      for (const m of t.matchAll(/(\d+)\s*(?:methodology and criteria documents|份文档)/g)) {
        if (Number(m[1]) !== n) P(`[计数] ${rel} 声明 ${m[1]} 份 methodology，实际 ${n}`)
      }
    }
    notes.push(`methodology: ${n}`)
  }
}

// ── 5. 全部相对链接可达（含 docs/ 与 assets/）
{
  let checked = 0
  for (const f of walk(root, (p) => p.endsWith('.md'))) {
    const t = readFileSync(f, 'utf8')
    const base = dirname(f)
    for (const m of t.matchAll(/\]\(([^)\s]+)\)/g)) {
      const href = m[1]
      if (/^(https?:|mailto:|#)/.test(href)) continue
      const path = decodeURIComponent(href.replace(/#.*$/, ''))
      if (!path) continue
      checked++
      if (!existsSync(join(base, path)) && !existsSync(join(root, path))) {
        P(`[链接] ${relative(root, f)} → ${href} 不存在`)
      }
    }
  }
  notes.push(`链接 ${checked} 条`)
}

// ── 6. 图片：README 引用的必须存在；assets/ 里的必须被引用
{
  const assets = join(root, 'assets')
  const referenced = new Set()
  for (const f of walk(root, (p) => p.endsWith('.md'))) {
    const t = readFileSync(f, 'utf8')
    for (const m of t.matchAll(/(?:src="|\]\()([^")\s]*assets\/[^")\s]+)/g)) {
      referenced.add(m[1].replace(/^\.\//, ''))
    }
  }
  if (existsSync(assets)) {
    for (const f of readdirSync(assets)) {
      if (!/\.(svg|png|jpg|webp|gif)$/i.test(f)) continue
      const rel = `assets/${f}`
      if (![...referenced].some((r) => r.endsWith(f))) P(`[图片] ${rel} 存在但没有任何文档引用它`)
    }
  }
  for (const r of referenced) {
    if (!existsSync(join(root, r))) P(`[图片] 文档引用了 ${r}，但文件不存在`)
  }
  notes.push(`图片引用 ${referenced.size}`)
}

// ── 7. SVG 里不要用 emoji（SVG 内 emoji 依赖系统字体，多环境渲染成豆腐块）
{
  for (const f of walk(root, (p) => p.endsWith('.svg'))) {
    const t = readFileSync(f, 'utf8')
    // 只报彩色 emoji 区。✓ ✗ 这类装饰符在主流渲染器里稳定，实测通过，不报。
    const emoji = t.match(/[\u{1F000}-\u{1FAFF}]/u)
    if (emoji) P(`[渲染] ${relative(root, f)} 含 emoji「${emoji[0]}」——SVG 内 emoji 不可靠，改用手绘 path 或纯文字`)
  }
}

// ── 8. 表格列数一致（先剥掉行内代码，否则 <|im_start|> 之类会误报）
{
  for (const f of walk(root, (p) => p.endsWith('.md'))) {
    const lines = readFileSync(f, 'utf8').split(/\r?\n/)
    let inCode = false
    let prev = 0
    let wasTable = false
    let ln = 0
    for (const line of lines) {
      ln++
      if (/^\s*```/.test(line)) { inCode = !inCode; continue }
      if (inCode) continue
      if (/^\|/.test(line)) {
        const stripped = line.replace(/`[^`]*`/g, 'C')
        const n = (stripped.match(/\|/g) ?? []).length
        if (wasTable && n !== prev) P(`[表格] ${relative(root, f)}:${ln} 列数 ${n} ≠ 上一行 ${prev}`)
        prev = n
        wasTable = true
      } else { wasTable = false; prev = 0 }
    }
  }
}

// ── 9. 安装位与仓库必须一致（DSH 加载的是安装位，不是仓库）
{
  const inst = join(homedir(), '.dsh', 'skills', 'jailbreak-skill')
  if (!existsSync(inst)) {
    notes.push('未找到安装位，跳过同步检查')
  } else {
    let diff = 0
    for (const f of walk(root, () => true)) {
      const rel = relative(root, f)
      if (rel.startsWith('.git' + '\\') || rel.startsWith('.git/')) continue
      const b = join(inst, rel)
      if (!existsSync(b)) { P(`[同步] 安装位缺 ${rel}`); diff++; continue }
      if (readFileSync(f, 'utf8') !== readFileSync(b, 'utf8')) { P(`[同步] 安装位与仓库不同：${rel}`); diff++ }
    }
    if (!diff) notes.push('安装位已同步')
  }
}

// ── 10. ~/.dsh/skills 下不能有同名 name: 的副本（.bak 目录会造成注册冲突）
{
  const skillsDir = join(homedir(), '.dsh', 'skills')
  if (existsSync(skillsDir)) {
    const names = new Map()
    for (const dir of readdirSync(skillsDir)) {
      const p = join(skillsDir, dir, 'SKILL.md')
      if (!existsSync(p)) continue
      const fm = readFrontmatter(readFileSync(p, 'utf8'))
      if (!fm.name) continue
      if (!names.has(fm.name)) names.set(fm.name, [])
      names.get(fm.name).push(dir)
    }
    for (const [name, dirs] of names) {
      if (dirs.length > 1) P(`[重名] name: ${name} 被 ${dirs.length} 个目录声明：${dirs.join(', ')}。备份/副本要移出 skills/`)
    }
  }
}

// ── 输出
const useColor = process.stdout.isTTY
const red = (s) => (useColor ? `\x1b[31m${s}\x1b[0m` : s)
const green = (s) => (useColor ? `\x1b[32m${s}\x1b[0m` : s)
const dim = (s) => (useColor ? `\x1b[2m${s}\x1b[0m` : s)

if (notes.length) console.log(dim(notes.join(' · ')))
if (problems.length === 0) {
  console.log(green('preflight: 全部通过'))
  process.exit(0)
}
console.log('')
console.log(red(`preflight: ${problems.length} 个问题`))
for (const p of problems) console.log('  ' + p)
console.log('')
console.log(dim('对照 docs/pitfalls.md 查成因与处置。'))
process.exit(1)

// ── helpers
function readFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return {}
  const out = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/)
    if (kv) out[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '')
  }
  return out
}

function* walk(dir, pred) {
  let entries
  try { entries = readdirSync(dir) } catch { return }
  for (const name of entries) {
    if (name === '.git' || name === 'node_modules') continue
    const p = join(dir, name)
    let st
    try { st = statSync(p) } catch { continue }
    if (st.isDirectory()) yield* walk(p, pred)
    else if (pred(p)) yield p
  }
}
