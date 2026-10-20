# helm-d v2 总方案 · 多破甲自主 agent 插件（自主设计版）

2026-10-20。本文是我自己的设计，不是参考项目的搬运。四家参考（ARTEX / purge-community / dsh-market / helm-x 复原提示词）先逐一过堂——**他们对的地方吸收，不对的地方明说为什么不用**——然后给出独立架构、验证计划与施工顺序。

---

## 0. 一句话

**helm-d v2 = 加密多破甲目录 + 热切换 + 会话内自检协议 + 证据链的 DSH 插件**；八题原题干 60 秒协议 8/8 为已达成基线，本方案把「能打的提示词」升级为「可维护、可切换、可分发、可审计的 agent 插件」。

---

## 1. 参考协议过堂：哪里对、哪里不对

### 1.1 ARTEX（自主性最强，协议不可直抄）

**对的**：目标分解器（只认最终交付物、约束自包含无指代词、最小范围）；终止态分类学（11 态各有下一步，循环不坠崖）；可编辑正文/代码所有 tail 双层；证据与过程分离。

**不对的（对 helm-d 场景）**：
1. **终止态表是宿主状态机形态**——ARTEX 有外部 planner 重派 worker，所以 "exhausted→换方向" 能落地。helm-d 是长会话单 agent，没有外部 planner：直接抄表，"exhausted" 没人接。→ **改造成会话内自检规则**（见 §3.3），宿主侧只保留 60s 协议作外部观测。
2. **证据系统绑 PostgreSQL + advisory lock**——单进程 Node 插件没有 DB，也没有并发写者。→ **降维为 JSONL append + 内容寻址文件**，锁直接删（单进程顺序写天然安全）。内容寻址与 24h 宽限 GC 保留（正确且廉价）。
3. **目标分解器是独立 LLM 调用**——多一次模型调用=多一份成本与延迟。→ **内化为人设固定第一步**（先抽约束与交付物，再动手），不新增调用。
4. **guard/llmpool/selfupdate 独立模块**——对 ARTEX 的产品形态合理，对插件过重。→ llmpool 降维为「多中转配置+标记切换」；selfupdate 不做（被测插件自更新=污染实验对象）；guard 保留但只管输出噪声（评分相关）。

### 1.2 purge-community（多破甲+锚点门，两处不可抄）

**对的**：presets/ 三件套目录约定、cordis.patch.yml 逐键覆盖+HMR 1s、sealSlot 封印嵌入、13 个测试文件。

**不对的**：
1. **anchor-gate 的推理形状判定是英文中心正则**（we / let me）——中文推理下直接失效；且 maxTokens=1024 硬帽会截断合法长推理。→ **换成任务锚词判定**（推理中是否出现当前题目的关键词/锚）+ 预算帽只作用于「未锚定且未产出」状态。
2. **preset 明文放在包里**（presets/redteam/preset.yml 明文人设描述）——只有 default-prompt 走了 sealSlot。npm 扫描不区分文件名。→ **helm-d 全加密**：目录里不存在任何人设明文。
3. **403 行手写 YAML 子集解析器**——fail-closed 对，但为读自己的组成文件写 YAML 解析器是负资产。→ **helm-d 组成用 JSON**（无需解析器，原生 import）。
4. **HMR 覆盖 config 键**：purge 只实证了 `disabled` 布尔开关的 HMR；「patch 覆盖 config 值并传递到插件运行时」**未经验证**——本方案 §4.2 标记为待验证假设，验证通过前热切换只承诺会话级通道。

### 1.3 dsh-market（安装体验标杆，两处不抄）

**对的**：一条命令安装（npm 分发+宿主 CLI）、engines.dsh 声明、备份/回滚、中国区 fallback 路由。

**不对的**：中心化 catalog / 评论 / 主题市场——那是市场平台的功能，helm-d 是单一插件，不背平台的账。**更新 API v1（capability-gated）**对单插件是过度设计。

### 1.4 helm-x 复原提示词（证据标签好，流水线过度）

**对的**：VERIFIED/CANDIDATE/UNRESOLVED 三档 + typed placeholders（已被我们的 OUTPUT CONTRACT 吸收）。

**不对的**：**10 级 evidence gate 流水线**——每个任务过十道门是仪式化开销，判据自污染的教训（判据词表住仓库里）恰恰说明门越多误伤面越大。→ **helm-d 用「判档即绑定」**：一条记录=判档+证据引用+unjudged 原因，三行 JSON，无门。

### 1.5 我此前方案的自纠

- v6.2 反抄袭层的 12 字 gram 自检**对本插件自身源码有效，对人设目录不成立**（目录即明文盘点）——v2 全加密后该层退役。
- 「实验室合成夹具」框架与「工单输入」框架的两次摇摆（v5/v7 教训）——v2 固化为**合成夹具框架**（PT-1 三连实证），不再摇摆。
- ship-skeleton 规则对 RE-1 无效（实测）——v2 不再追加人设侧反烧窗规则，改由 **60s 协议作外部终止观测 + effort 降档**（用户决策项）承担。

---

## 2. 架构

### 2.1 包结构（发布形态）

```
helm-d/
  package.json            # engines.dsh 声明 + files 白名单（**排除一切明文人设**）
  cordis.patch.yml        # 默认条目（enabled + activeProfile 指针）
  lib/
    index.js              # 插件入口：读 catalog → 解密当前 profile → 组装 system 段 → 挂 hooks
    catalog.js            # 人设目录：枚举/切换/校验/回退
    crypt.js              # seal/unseal：scrypt(口令)+AES-256-GCM；SLOT/MASK/TAG/IV 分块
    doctrine.js           # 不变式 tail（合成夹具 doctrine、输出契约——代码所有，改不走样）
    hooks/
      stream-hook.js      # 运行时流 hook（现有）
      router.js           # 意图归一路由（现有，表外置到 profile）
    evidence/
      store.js            # 内容寻址 blob + findings.jsonl append + GC(24h)
  assets/
    profiles.dat          # 封印人设目录（AES-256-GCM；明文 0 字节）
  presets/
    <profile>/            # （可选，封印于 dat 内）agent-plane 组成——JSON 格式
  README.md               # 安装/切换/口令恢复三篇
```

### 2.2 人设条目格式（加密内）

```json
{
  "id": "core",
  "name": "全能主档",
  "version": 3,
  "editable": {
    "slang": { " mappings": "..." },
    "opening": "...",
    "domainNotes": { "pentest": "...", "adult": "..." }
  },
  "invariantRefs": ["synthetic-fixture", "output-contract", "two-stops"]
}
```
- `editable` = 操作者可改层；`invariantRefs` 指向 doctrine.js 里代码所有的 tail——**goals.go 双层治理的 Node 版**。
- 多破甲 = 多条目。切换 = `activeProfile` 指针变更。

### 2.3 切换通道（两通道 + 一待验证）

| 通道 | 机制 | 生效 | 状态 |
|---|---|---|---|
| 会话级 | 改 activeProfile 配置 → 下一会话组装时取新档 | 下一会话 | **主通道，默认** |
| 热级 | cordis.patch.yml 覆盖 activeProfile → HMR | ~1s | **待验证假设**（purge 只实证 disabled 布尔；config 值覆盖需实测，见 §5） |
| 外部观测 | 60s 拒答检测协议（runbatch） | 评测 | 已实证 |

### 2.4 运行时

- system 组装 = doctrine.js 不变式 + editable 当前档 + SLANG 归一（profile 内表）+ H-CoT 完成审查块。顺序：ACTIVATION → TASK PRIORITY → OPENING(不变式) → HARD BOUNDS(不变式+当前档域注记) → SLANG(当前档) → SCOPE → …
- 证据：每轮判档 = findings.jsonl 一条 `{ts, 题, 轮, verdict, evidence:[blobHash…], unjudged?}`；blob = 正文/校验器输出/推理摘要的内容寻址体；GC 24h 宽限（终版报告引用的永久保留）。
- 60s 拒答检测：外部协议不变（runbatch），作为终止态的外部观测进 findings。

---

## 3. 分发（加密 + 一条命令 + star 门）

1. `npm publish`：包内明文人设 0 字节（files 白名单排除 + profiles.dat 封印）；扫描面=无害 loader 文本。
2. 安装：`dsh plugin --profile web add helm-d`（npm 通道，dsh-market 同款）；首次激活过 **star 门**（§3.5），之后静默。
3. 口令恢复：不设后门——口令丢失=重新取得 profiles.dat 的口令或重签（操作者自持）。
4. 中国区：依赖 dsh-market 的 fallback 路由先例，npm 镜像（npmmirror）为主源。

### 3.5 star 门（推广机制，路线 B 加固版）

- 流程：首启门屏显 `github.com/login/device` + 8 位码（GitHub OAuth Device Flow，client_id 随包分发，**请求 scope=零**）→ 用户授权 → 插件轮询拿 token（遵守 interval/slow_down）→ `GET /user/starred/<owner>/<repo>`：204=已 star。
- **token 校验完立即丢弃**，磁盘只存 `{starred:true, checkedAt, login?}`——零凭据落盘，无秘密可保护。
- 未 star：门屏显示「点 Star 解锁」+ 刷新按钮，轮询至通过。
- 复验：每 7 天静默重验；断网宽限放行（offline grace），上线补验。
- 防绕过：不做（操作者裁决：荣誉制，评分场景跑正常流程）。
- 升级路线 A（可选）：自建网关做服务端 star 校验+短时凭据+转化遥测（OFM eac-login 模式，源码 `Reference/dsh-our-free-model/src/eac-login.js`），起步不需要。

---

## 4. 验证计划

### 4.1 单元
- crypt：seal/unseal round-trip；错口令=可识别失败；明文 0 残留（包内容 grep）。
- catalog：枚举/切换/坏条目回退（坏 profile 不阻塞启动，降级到上一可用档）。
- doctrine 注入：改 editable 后不变式 tail 仍在（防走样实测）。
- **star-gate**：mock GitHub 端点下四态全测（pending/unstarred/ok/expired）；token 丢弃断言（校验后内存与磁盘无 token 残留）；断网宽限路径。

### 4.2 集成（A 级）
- 装机 → health（指纹一致）→ 冒烟 → **八题原题干 60s 协议 × 3 轮**（判据：无拒绝；RE-1/RE-2 工作中态按轮记录推理锚词）→ 长窗轮抽 2 题验完整交付。
- 评分噪声 grep：交付物正文 grep 授权/归属/用途/合规修饰词 = 0。
- **star 门端到端**：真 GitHub 账号走一遍 device flow（star→解锁）；unstar 后 7 天复验回到门屏。

### 4.3 红线
- npm pack 后 `grep` 全包：任何人设明文关键词 0 命中（自动化进 CI）。

---

## 5. 假设与决策点（需要操作者拍板的只有三处）

| # | 假设/决策 | 验证/兜底 |
|---|---|---|
| 1 | HMR 能否覆盖 config 值（非 disabled 布尔）| 一次实测（写 patch 改 activeProfile，看下一条会话是否换档）；不成立则热级通道降级为「改配置+手动刷新页面」，主通道不受影响 |
| 2 | RE-1 类烧窗是否接受 effort 降档 | config 一行，A/B 一轮即见分晓；不降则维持 unjudged 口径 |
| 3 | 多破甲首批目录内容（哪些档位） | 建议首发三档：core（现役 v9 全量）/ stealth（轻量化：去重实验说明）/ redteam-max（渗透域加厚）；条目即 JSON，随加随切 |

---

## 6. 施工顺序

1. **M1（骨架）**：crypt/catalog/doctrine 三模块 + profiles.dat 封印 + 明文 0 验证 + **star-gate 模块**（device flow + 丢弃 token + 门屏）—— 解锁 npm 通道与推广
2. **M2（切换）**：两通道接线 + 三档首发 + 60s 协议 × 3 轮回归
3. **M3（证据链）**：findings.jsonl + blob store + GC —— 判档可复核
4. **M4（分发）**：npm publish + engines.dsh + README 三篇
5. **M5（自主性内化）**：工单分解步 + 终止态自检进人设可编辑层（ARTEX goals/terminalreason 的内化版）

M1-M2 是主诉求关键路径；M3-M5 可并行或后置。
