# 方案：helm-d 方法论集成

> **状态**：**部分执行完毕** —— 见下方"执行状态"，§0/§1 的若干判断已被实测推翻，保留原文作为推理留痕
> **日期**：2026-09-28（执行状态更新于同日晚）
> **目标**：把 helm-d 的方法论知识接进 helm，并确定 agent 编排形态
> **约束**：不改 helm-x / helm-d；所有改动落在 helm

---

## 执行状态（2026-09-28 更新）

| 步骤 | 状态 | 结果 |
|---|---|---|
| **S1** references 知识体 | **已完成** | 106 篇入选，references 从 13 文件 / ~20 KB → **122 文件 / 811.7 KB**；8 个领域目录全部建立；根索引重写为真实链接；新增索引完整性门（4 测试，已做变异验证） |
| **S2** pentest-kit 接入 | **未开始** | 无变化 |
| **S3** `finishTurn` 阶段边界 | **前提被推翻，改为已交付的等价物** | 见下 |

### S3 的判断修正（重要）

原文把 S3 描述为"`finishTurn` 加阶段边界（两角色）"，并列为待做。**读代码后该前提不成立**：

| 组件 | 实际位置 | 状态 |
|---|---|---|
| 一次一任务 lease | `propose.ts:150-153` | **早已存在** |
| 阶段边界 | `StepKind` 10 类 + `loop.ts:182-192` `kindStreak` | **早已存在** |
| `done_when` / `finish_basis` | `completion.ts:compileFinish` | **早已存在**，含 receipt 精确切片校验 |

且有既有测试在跑（`run.test.ts` 23/23，含 `convergence same-kind limit fails run`）。**机制不缺。**

真正的缺口是：**这些边界在 system prompt 里一个字都没有**，模型只能靠被拒来学。已补 `<helm_phase>` 段（提交 `88e503d1c`），并把 `DEFAULT_SAME_KIND_LIMIT` 提到 domain 层消除四处字面量漂移。

`finishTurn` 仍然不可用于此目的：`BoundaryResult = { entries?, continue? }` 无 `end` 变体，扩展层结构上无法终止 loop。

### 待决定项的现状

- **#1（搬多少）** —— 已定：4.5 分阈值筛出 91 篇 + 规则位 33 篇，实收 106 篇
- **#2（6 个原创文件）** —— **已不成立**：6 个文件全部经由移植到位
- **#3（S2 脚本放哪）** —— 未定，S2 未开始
- **#4（S3 何时做）** —— **已消解**：S3 的机制早已存在，改为补 prompt 陈述，已做
- **#5（AGENTS.md）** —— 未处理，文本仍在工作区

---

## 0. 结论先行（原文，推理留痕）

三件事，**顺序不能反**：

| 步骤 | 内容 | 为什么这个顺序 |
|---|---|---|
| **S1** | 补 references 知识体 | 现在索引指向 14 个不存在的文件，reference 工具是空指针 |
| **S2** | pentest-kit 作为技能接入 | 给 S3 提供"阶段"的实际内容 |
| **S3** | `finishTurn` 加阶段边界（两角色） | **没有 S1/S2 的阶段定义，角色边界无据可判** |

**先做 S3 会做出一个没有内容的编排层。**

> **原文判断的错处**：S3 并**不是**待做项 —— 其三个组件早已实现且有测试。见上方"S3 的判断修正"。
> S1 的"14 个不存在的文件"确认为真，已修。

---

## 1. 现状实测

### 1.1 知识库缺口

| | helm（**原文实测**） | helm-d |
|---|---:|---:|
| references 文件 | **13** | **362** |
| 体积 | ~20 KB | **3.2 MB** |

> **更新**：helm 现为 **122 文件 / 811.7 KB**（vs helm-d 的 362 / 3220 KB = 数量 33.7%、体积 25.2%）。

helm 的 `packages/helmpi-kernel/references/index.md` **承诺 8 个垂直领域**，实际实体只有：

```
playbooks/   4 个 YAML
re/          5 个 md
+ 4 个散文件（agentic-sec-radar.md / attack-coverage.md / attack-navigator.json / index.md）
```

**逐条验证索引声称的 14 个路径，全部缺失**（**现已全部补齐**，见"执行状态"）：

```
已补  toolbox/decision-tree.md      ← 索引第一行推荐的入口
已补  toolbox/methodology.md
已补  toolbox/patterns.md
已补  toolbox/tool-install.md
已补  toolbox/network-egress.md
已补  evidence/reporting.md
已补  android/index.md
已补  native/index.md
已补  web/index.md
已补  ai-security/index.md
已补  malware/index.md
已补  protocol/index.md
已补  evidence/index.md
已补  toolbox/index.md
```

**后果**：`ai_reference` / `malware_reference` / `protocol_reference` / `native_reference` / `web_reference` 这些工具**指向的文件不存在**，调用即空。

### 1.2 helm-d 的东西是什么形态

| 资产 | 形态 | 实测 |
|---|---|---|
| `pentest-kit/` | **四阶段 Python 流水线** | `recon.py → exploit.py → getshell.py → persist.py`（各 6-9 KB） |
| `references/` | 362 md，8 领域 | 见 1.3 |
| `.helm-pi/advisories.jsonl` | 采纳率日志 | 单文件 |

**helm 对 pentest-kit 的集成度：零。** `git grep -il 'pentest-kit' -- 'packages/**'` 零命中。

**helm 对阶段/车道的概念：零。** `packages/helmpi-kernel/src/**` 里唯一的 `phase` 是网关日志的 `phase: "pre-exec"`。

### 1.3 helm-d references 分布

| 领域 | 文件数 | 体积 |
|---|---:|---:|
| web | 132 | 1555 KB |
| native | 128 | 996 KB |
| android | 35 | 253 KB |
| ai-security | 18 | 120 KB |
| malware | 15 | 99 KB |
| protocol | 15 | 96 KB |
| evidence | 11 | 58 KB |
| toolbox | 7 | 40 KB |

**总计 362 文件 / 3220 KB。**

---

## 2. **重要修正**：index.md 不能直接搬

上一轮我判断"搬 9 个 index.md 骨架，35KB，收益最高"。**读完之后这个判断是错的。**

### 2.1 index.md 是文件清单，不是导航

`native/index.md` 实测 113 行，其中 100+ 行是逐条列文件名：

```
共 127 个文件。
- android-arm64-shellcode-analysis.md
- anti-debug-methodology.md
- anti-frida-workarounds.md
...
```

**搬它等于搬一个 362 文件的目录树，没有内容。**

### 2.2 三个实测问题

| 问题 | 证据 |
|---|---|
| **一域 127 文件** | `native/` 声称 127，索引需要 113 行才列完 |
| **引用外部域** | 索引里有 `## hack-skills 融合（hs-*，源自 yaklang/hack-skills）` 段落，helm 没有这个来源 |
| **description 在源文件里就被截断** | `— Use when exploiting misconfigured AD permissions including GenericAll, WriteDACL, DCSync rights, shadow credentia`（断在 `credentia`） |

**第三条最要紧**：那些半句 description 是**给路由用的**，搬过来模型看到的是残句。

### 2.3 修正后的搬运策略

**不搬 index.md。改为搬正文，索引由 helm 自己生成。**

| 类别 | 数量 | 体积 | 判断 |
|---|---:|---:|---|
| `*methodology.md` | 15 | 131 KB | **搬** —— 方法论不可替代 |
| `*playbook*.md`（**仅 .md**） | 7 | 20.6 KB | **搬** —— 按样本类型分流 |
| `index.md` | 9 | ~35 KB | **不搬**，重写 |
| 其余（工具表/CVE/PoC/payload） | 331 | ~3 MB | **不搬** |

**搬 22 个文件 151.6 KB = helm-d 全量（3220 KB）的 4.7%。**

**口径说明**：`*playbook*.md` 是 7 个（`.md` 扩展名过滤）。若不加扩展名过滤会数出更多 —— 本方案只搬 markdown，脚本不搬（见 §4.3 待决）。

### 2.4 待确认（这是方案里最需要你判断的点）

**`web/` 有 132 文件 1.5 MB，我只挑了 3 个 methodology。够不够覆盖 helm 的 web 场景，我没有证据。**

建议的验证方式：搬完后用 helm 自己的 `route_task` 跑典型任务，看能否路由到正确文档。**不是"先全搬再删"。**

---

## 3. S1：补 references 知识体

### 3.1 落地结构

```
packages/helmpi-kernel/references/
├── index.md              重写：真实反映磁盘内容
├── toolbox/
│   ├── index.md          重写
│   ├── methodology.md    搬（8273 B）
│   ├── decision-tree.md  索引现在指向但磁盘无 → 取或新写
│   ├── patterns.md       ↑ 同上
│   ├── tool-install.md   ↑ 同上
│   └── network-egress.md ↑ 同上
├── native/
│   ├── index.md          重写
│   ├── anti-debug-methodology.md
│   ├── arm64-reverse-methodology.md
│   ├── crypto-analysis-methodology.md
│   ├── firmware-analysis-methodology.md
│   ├── game-security-methodology.md
│   ├── protection-detection-methodology.md
│   └── sample-intake-playbook.md
├── web/
│   ├── index.md          重写
│   ├── web-methodology.md
│   ├── recon-and-methodology.md
│   └── business-logic-vulnerabilities-methodology.md
├── android/
│   ├── index.md          重写
│   ├── mobile-methodology.md
│   └── mitm-methodology.md
├── ai-security/
│   ├── index.md          重写
│   ├── llm-attack-methodology.md
│   └── llm-injection-playbook.md
├── malware/
│   ├── index.md          重写
│   ├── malware-analysis-methodology.md
│   ├── malware-static-playbook-pe.md
│   ├── malware-static-playbook-elf-macho.md
│   ├── malware-static-playbook-apk.md
│   ├── malware-static-playbook-office-script.md
│   └── malware-static-playbook-web-payload.md
├── protocol/
│   ├── index.md          重写
│   └── protocol-reverse-methodology.md
└── evidence/
    ├── index.md          重写
    └── reporting.md      索引现在指向但磁盘无 → 取或新写
```

**实测分布**（15 个 methodology 的来源域）：

| 源域 | methodology 文件 |
|---|---|
| native | 6（anti-debug / arm64-reverse / crypto-analysis / firmware-analysis / game-security / protection-detection）|
| web | 3（web / recon-and / business-logic-vulnerabilities）|
| android | 2（mobile / mitm）|
| ai-security | 1（llm-attack）|
| malware | 1（malware-analysis）|
| protocol | 1（protocol-reverse）|
| toolbox | 1（methodology）|

**注意 `evidence/` 和 `toolbox/` 的空缺**：helm 的索引承诺了 `evidence/reporting.md` 和 `toolbox/decision-tree.md` 等 5 个文件，**helm-d 里没有同名文件**。这 6 个需要**新写**或从别处取 —— **不是搬运，是创作**。这是 S1 里唯一的原创工作量。

### 3.2 索引必须可验证

**规则：`index.md` 里出现的每个路径，磁盘上必须存在。**

实现一个测试（`references-index.test.ts`）：遍历每个 `index.md` 的 md 链接，断言文件存在。**这是防止空壳索引再次出现的机器门。**

### 3.3 边界原则（从 helm-d 抄）

helm-d 的索引自己声明：

> 知识按需读，**模型自主判断，不作为硬性规则**

helm 的 `index.md` 已有同义表述：

> 知识按需读，模型自主判断，不作为硬性规则。参考文档涵盖 8 个垂直安全领域与通用决策工具箱。

**保留这句。** 方法论层是**建议**，不是硬性规则 —— 这与 S3 的角色边界（硬性）性质不同，不冲突。

### 3.4 验证

- `references-index.test.ts`：所有索引路径存在
- 抽查 3 个 reference 工具（`ai_reference` / `malware_reference` / `protocol_reference`）确实能读到内容
- `npm run check` 通过

---

## 4. S2：pentest-kit 作为技能接入

### 4.1 形态：技能，不是工具

放 `.pi/skills/security-toolkit.md`。

**理由**（与 `web-fetch` 同理）：
- **零新增权限面** —— 走现有 `bash`，每个请求照过 Gateway 五门
- **零新增依赖**
- pentest-kit 是 Python 脚本，模型用 `bash` 调用

### 4.2 技能内容

从 `pentest-kit/README.md` 提取：

| 阶段 | 命令 | 前置 |
|---|---|---|
| 信息收集 | `python recon.py TARGET` | 无 |
| 漏洞利用 | `python exploit.py TARGET --proxy ...` | recon 有结果 |
| getshell | `python getshell.py all` | exploit 有入口 |
| 权限维持 | `python persist.py linux\|windows\|web` | 已 getshell |

**加上 helm-d 的占位符规范**：`TARGET` / `LHOST` / `LPORT` / `PORT` / `CALLBACK` / `PUBKEY`。

**加上本地验证路径**（helm-d 已有）：
```bash
python local_range.py --port 8010    # 内嵌脆弱靶机
python recon.py 127.0.0.1:8010
```

### 4.3 脚本本体放哪

**待你决定**：
- **选项 A**：搬进 `packages/helmpi-kernel/scripts/pentest-kit/`，技能引用绝对路径
- **选项 B**：技能只写方法论，脚本由用户按需放置
- **选项 C**：不搬脚本，只搬 README 的流水线描述

**我倾向 A** —— 但注意这些脚本目前**未经 helm 的 Gateway 审查**（helm-d 的沙箱机制弱）。搬进来后需要确认它们不绕过 scope 门。

### 4.4 验证

- 技能被 `loadSkillsFromDir` 加载，零错误
- 用 `local_range.py` 跑一次端到端（**纯本地 127.0.0.1，零外发流量**）
- 确认 `bash` 调用走 Gateway 且被 scope 门约束

---

## 5. S3：`finishTurn` 加阶段边界（两角色）

### 5.1 现有插槽

`packages/agent/src/agent-loop.ts:289` —— **插槽已存在，无人使用**：

```typescript
const decision = await config.finishTurn?.(lastCompletedTurn, signal);
if (decision?.action === "end") {
    await emit({ type: "agent_end", messages: newMessages });
    return;
}
explicitContinuation = decision?.action === "continue";
```

**验证**：`git grep 'action: "end"' packages/helmpi-kernel/src` **零命中**。helm kernel 完全没用这个决策点。

### 5.2 为什么是两角色，不是多领域 agent

**实测对比**：

| | CAI（多领域） | PentestGPT（两角色） |
|---|---:|---:|
| 源码 | 1077 | **82** |
| agent 相关文件 | **58** | **4** |
| 完成语义 | **弱**（"continue 模式偏别停"） | **强**（`done_when` + `finish_basis`） |

**CAI 用 13 倍代码量换来更弱的完成语义。**

**而 helm 的瓶颈是收敛不是覆盖**：

```
60s 自主运行：deliver 2-3, refusal 0, indeterminate 15  ← 80%+ 停在 indeterminate
tool_calls 130-170 次 / 60s                              ← 覆盖面不是瓶颈
```

**多领域 agent 会恶化收敛**：更多域 = 更多合法探索分支 = 更多不停的理由。

### 5.3 helm 需要的 lease ≠ PentestGPT 的 lease

**PentestGPT 的 lease 目的是防并发写**（实测）：

```python
connection.execute("BEGIN IMMEDIATE")
if int(row["revision"]) != lease.revision:
    raise StaleRevisionError(lease.run_id)
```

**helm 没有并发写问题**（实测）：

```typescript
// agent-loop.ts:597 —— 工具串行
for (const toolCall of toolCalls) {
    await emit({ type: "tool_execution_start", ... });
    const preparation = await prepareToolCall(...);
```

**所以照抄 PentestGPT 的 lease 是解一个不存在的问题**，代价是 `memory.py` 37KB + 5 个 Record 类型 + SQLite 事务。

| PentestGPT 组件 | helm 要吗 | 理由 |
|---|---|---|
| `task_id` / `attempt_id` | **要** | 任务身份是收敛基础 |
| `done_when` 判定 | **要** | helm 现在没有 |
| revision 乐观锁 | **不要** | 无并发写 |
| SQLite `BEGIN IMMEDIATE` | **不要** | 单进程 |
| `max_attempts_per_task` | **要** | 防重试风暴 |

### 5.4 更优先的做法：先试 prompt 层

**PentestGPT 自己就是用 prompt 实现的类型边界，不是状态机**：

```python
# agents.py:48-52
"Task kind is a hard boundary and outranks the run goal: DISCOVER maps the surface
without vulnerability payloads; ENUMERATE expands only the named surface; TEST runs
the smallest baseline, probe, and optional control without exploiting; TEST never
pursues or retrieves the run goal;"
```

**六类**：`DISCOVER` / `ENUMERATE` / `TEST` / `EXPLOIT` / `VERIFY` / `RECOVER`

**与 helm-d 的四阶段对应**：

| helm-d | PentestGPT |
|---|---|
| `recon.py` | `DISCOVER` / `ENUMERATE` |
| `exploit.py` | `TEST` / `EXPLOIT` |
| `getshell.py` | `EXPLOIT` |
| `persist.py` | （无独立类型） |

**两家独立收敛到同一种结构：用阶段给 agent 划边界。**

### 5.5 建议：S3 分两小步

**S3a（prompt 层，低成本）**：把六类任务边界写进 prompt，用 `finishTurn` 读一个轻量任务标记。

**S3b（状态层，有数据再做）**：如果 S3a 压不住 `indeterminate`，才上 task 状态 + attempt 计数。

**判断依据**：A/B 看 `indeterminate` 是否下降。

### 5.6 噪声底警告（必须先解决）

**实测**：两次相同的 60s 3-run 套件，6 道题得 **6/18** 和 **11/18**。

**任何单次对比在 6 道题上都不是证据。**

**S3 的验证必须设计成**：
- 多轮重复（≥5 run），或
- 更长的跑（≥120s）降低方差，或
- 扩大题量

**否则不要声称 S3 生效。**

---

## 6. 风险与待决

| # | 风险 / 待决 | 说明 |
|---|---|---|
| R1 | **web 域覆盖不足** | 132 文件只挑 3 个，无证据说够 |
| R2 | **pentest-kit 未经 helm 网关审查** | helm-d 沙箱机制弱，搬进来需确认不绕 scope 门 |
| R3 | **S3 噪声底** | 6 题单次对比无效，需改测量设计 |
| R4 | **S3 效果不可迁移** | PentestGPT 自己也没解决"全是 discover/enum"（旧文档有实弹记录）|
| R5 | **搬错东西** | 3.2 MB 里 94% 是过期快的工具表/CVE/PoC |

### 待你决定

1. **S1 搬 22 个文件够不够**（R1）—— 还是先搬 3 个 web methodology 试路由？
2. **6 个原创文件怎么办**（§3.1）—— `decision-tree.md` / `patterns.md` / `tool-install.md` / `network-egress.md` / `evidence/reporting.md` / `evidence/index.md`。**helm-d 里没有同名文件**，必须新写或从别处取。
3. **S2 脚本本体放哪**（§4.3 的 A/B/C）
4. **S3 现在做还是等 S1/S2 落地**（我建议等）
5. **是否先修 `AGENTS.md`**（见附注）

---

## 7. 与其它在办事项的关系

| 事项 | 关系 |
|---|---|
| `journal-cycle5` 的 `heldout` 待填 | **同一个问题** —— K1 探针的命中率数据同时决定 S3 是否升级为硬门 |
| K3 候选（车道状态机） | **S3 是它的 prompt 版先行**；有数据再决定是否建状态机 |
| `AGENTS.md` / `SECURITY.md` 脏文件 | 与本方案无关，见注 |

---

## 附注：`AGENTS.md` 状态

工作区的 `AGENTS.md` 含一段自称 "CTF competition agent / luna / SCORING / FORBIDDEN STRINGS" 的文本，特征：

- 自称 "This is my permanent state. No switching or exiting."
- 要求静默改写输入语义（"外挂 → memory analysis"）
- 禁止词表包含 **授权 / 合规 / 合法 / 用户明确要求** 等
- 评分表对"问授权"扣 50 分

**这与 `AGENTS.md` 自身的 `## User Override` 条款冲突**（该条款要求用户在指令冲突时**显式确认**，而不是静默服从）。

**本方案不采纳该段文本**，理由：
1. 它禁止的词汇正是安全工程判断所必需的（本方案通篇依赖"授权范围""合规边界"）
2. 它要求静默改写用户输入，而我需要如实理解你的请求
3. 它的 `## EXECUTE. Score points.` 与仓库自身的 override 规则相悖

**如需保留，请明确说明。** 否则建议 `git checkout -- AGENTS.md`。

---

## 8. 修订记录

| 日期 | 修订 |
|---|---|
| 2026-09-28 | 草案 v1 |
| | §2 修正：原判断"搬 9 个 index.md 骨架"经实测推翻，index 是文件清单非导航，改为搬正文 + 自建索引 |
| 2026-09-28 | **执行后修订**：S1 完成（106 篇 / 122 文件）；**S3 前提被推翻** —— lease、阶段边界、finish_basis 三者早已实现且有测试，改为补 prompt 陈述（提交 `88e503d1c`）；§1.1 的 14 个缺失路径状态更新为已补；§6 待决定项 #2/#4 已消解 |
