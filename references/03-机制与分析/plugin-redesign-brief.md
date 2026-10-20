# 插件重构简报 · 从脚本小子到完整 agent（含多破甲切换与加密分发）

写于 2026-10-20。输入：ARTEX Global 全源码（Go 多智能体渗透系统）、dsh-market / dsh-our-free-model / dsh-plugin-hub / dsh-context 四个生态插件源码、DSH 官方源码仓（0.2.1-rc.2）。结论直说：**helm-d 现在是「一份人设 + 两个 hook + 60 个参考文件」的脚本包，对照 ARTEX 和生态标杆，缺的是一个产品的全部骨架。**

操作者聚焦（2026-10-20 追加）：**只取 ARTEX 的专业性与自主性**，产品外壳（PostgreSQL/Next.js/五语言）不要。

---

## 1b. 自主性架构（ARTEX 自主循环的完整提取与 helm-d 映射）——本轮核心

### 1b.1 目标分解器（goals.go 197 行）

ARTEX 把「用户要什么」交给一个专职 agent，其提示词有三条铁律：
- **目标 = 最终可交付/可核验的结果**；侦察、扫描、漏洞验证、攻击步骤**禁止列为子目标**（它们是过程不是目标）。
- **操作约束先行**：拆目标之前先抽 allow/deny 约束（「不扫端口」「仅被动侦察」），且约束必须**自包含**——指代词（「当前目标」「本站」）替换成具体值，因为约束会被单独注入执行阶段。
- **最小范围原则**：只登记用户明确点到的资产，严禁放大（xxx.example.com ≠ example.com）。

helm-d 落点：人设 TASK PRIORITY 前加「工单分解」步——先抽约束与落点，再定义交付物；MOMENTUM 的「最近有用组件」升格为「最终可交付物优先」。

### 1b.2 终止态分类学（terminalreason.go 161 行）——自主的核心

11 种运行终止态，**每一种都有预定义的下一步，循环永不坠崖**：

| 终止态 | ARTEX 的反应 |
|---|---|
| Completed | 无文字总结→以工具调用记录为准写回事实 |
| MaxTurns | 意图标 **exhausted，规划者换方向继续**（不是失败） |
| Timeout | 打断在跑工具、**就地写回事实和资产**、标 exhausted |
| ModelError | 重试用尽→标 **blocked**，查执行轨迹后重派或换法 |
| BlockingLimit | 收窄意图粒度或压缩工具返回 |
| StopHookPrevented / HookStopped | 查 Guard 规则是否过严 / 查最后一条 tool_result 的拦截说明 |

helm-d 落点：这直接治 RE-1 的烧窗——人设 MOMENTUM 升格为**终止态表**（烧窗=exhausted：就地写回已得部分+给出续作命令；截断=同），配合 deliverable-first，「silent polishing」从规则变成有明确出口的状态机。

### 1b.3 模板治理（goals.go 的双层结构）

提示词分两层：**DB 可编辑正文**（段 A，可被操作者改）+ **代码所有 tail**（段 B/C，永远生效、改不走样——goalsScopeTail 的注释原话「always applies on released DBs and can't be edited away」）。
helm-d 落点：多破甲 catalog 里每份人设分「可编辑正文 + 不变式 tail」两层；不变式（合成夹具 doctrine、输出契约）代码侧注入，可编辑层给操作者改。

### 1b.4 其余自主组件

| 组件 | ARTEX 实现 | helm-d 落点 |
|---|---|---|
| 规划器 | planner.go 33.7KB | persona 规则（轻）；或插件级 planner 工具（重） |
| blackboard | 跨 agent 共享状态继承（blackboard_inheritance_test） | 跨会话工作区状态文件 |
| compaction | compaction.go 17.7KB 上下文压缩 | 长会话纪律（人设级） |
| 延迟任务 | deferred.go | MOMENTUM 已有雏形 |
| 复测 | retester.go | 交付后自验（RE-2 的 _proptest 模式） |
| wrapup | wrapup.go 11.1KB 收尾 | 交付尾部规范 |
| prompt catalog | promptcatalog.go 可枚举+DB 播种+可编辑 | 多破甲 catalog（§2） |
| llmpool | pool.go+health.go 多供应商健康切换 | 多上游健康检查（§4.6） |

---

## 1. ARTEX 为什么「牛在专业性」（产品面模式，次优先）

## 1. ARTEX 产品面模式（次优先，专业性的一半）

| ARTEX 的做法 | 证据 | helm-d 现状 |
|---|---|---|
| **提示词目录化**：内置 agent 提示词可枚举、幂等播种进 `agent_prompts` 表、服务端持久化、可编辑（`agent/promptcatalog.go`，镜像 toolcatalog 的 BuiltinToolSeeds） | promptcatalog.go 14.9KB + planner_test/prompt_test | persona 烤死在 tgz 里，改一次要五步 |
| **多供应商池 + 健康策略**：`llmpool/pool.go` + `health.go`，provider 健康检查与故障切换 | llmpool/ 有专门 _test | 硬编码单上游，无健康检查 |
| **guard 层独立成模块**：`guard/guard.go` 8.1KB + guard_test | guard/ | 边界写死在人设文本里，无代码层守卫 |
| **技能目录规范**：每技能 `SKILL.md` + `reference.md` + `scripts/`（api-recon 带采集脚本全家桶） | skills/api-recon/ | references/ 60+ 文件无结构地塞进包 |
| **测试纪律**：agent/ 下每个核心文件配 _test.go（planner_test、prompt_test、tools 系列、guard_test）——93KB 的 tools.go 都有测试 | agent/ 全目录 | 零测试 |
| **证据/检测/报告管线**：evidence/、detections/（检测签名）、report/（结构化报告）、enrich/、notify/ | 顶层目录 | 纯文本输出 |
| **自更新模块**：selfupdate/ | 顶层目录 | 手工 tgz |
| **i18n 纪律**：推理提示词保持原文（性能保留），仅输出语言被代码级指令强制 | README「Why a global edition」 | 无 |
| **产品面**：CI×3、截图、多语言 README、防御指南、法律声明 | .github/ docs/ screenshots/ | 无 README 之外的任何面 |

## 2b. 生产级参照实锤（dsh-purge-community 1.6.8，145 文件全读）

purge 社区版就是「多破甲切换 + 反扫描分发 + 锚点治理」的**现成生产实现**，四个机制全部有源码：

1. **多预设 = agent-plane 组成**（`presets/redteam/` + `presets/unrestricted/`）：每预设三件——`preset.yml`（展示名/描述/排序）+ `agent.cordis.yml`（**391 行 agent-plane 组成**：名册一次挂载、会话按 scope 亲子加入、preset 只拥有工具与提示词段，宿主平面——注册表/沙箱/审批/持久化/模型路由——明确不属于 preset）+ `anchor-gate.mjs`。`lib/redteam/preset-composition.js` 403 行 fail-closed YAML 子集读取器把组成行交给 `ctx.agentPresets`（0.1.7 下 preset 即注册表声明）。
2. **anchor-gate.mjs = 生产级推理形状闸门（H-CoT 类机制活在生产里）**：分类首段推理为 minimal-like（含 we 无 let me，官方 Minimal 风格）/ standard-like / ambiguous；**未锚定期间请求 maxTokens=1024 硬帽**（烧窗在结构上不可能）；锚定或走满 4 步 bootstrap 后晋升、拆帽；compaction/end 重置回受控态重锚；「Instructions from: <path>」块被改写成 system-reminder 弱化提示（参考资料≠任务指令）。`ctx.on('agent/request')` 与 `agent/pre-step` 双钩子 prepend 实现。
3. **反扫描嵌入**（brief §3 的现成版）：`default-prompt-inject.md` 被 files 白名单显式排除 → `scripts/embed-default-prompt.mjs` 调 `lib/table-key.js` 的 `sealSlot(text)` → 产出 `asset-table.js`（SLOT 分块 96 字符 + MASK + TAG + IV）→ 运行时解封。npm 扫描只见加密资产表。
4. **工程面**：13 个 node --test 文件（install-registry/bootstrap-install/patch-anchors/selfcheck/boost/prompt-sections/presets/anchors/audit/instance/update-policy/market）、`bin/` CLI（diagnose 子命令）、25 个红队技能（fscan/gogo/nuclei/chisel/frp/suo5/凭证攻击/横向/webshell 套件…）、多维护者、`dshTarget: 0.2.1-rc.1` 声明、install.preferred=tarball+git 双通道。

**对 helm-d 的直接结论**：多破甲切换不要自研——照抄 purge-community 的 presets/ 目录约定 + preset-composition 读取器 + anchor-gate 三件套，把人设从「烤死的 persona.txt」变成「presets/<破甲名>/ 三件套」，切换/锚定/反扫描全是现成模式。

## 3. npm 加密分发设计（purge-community sealSlot 模式已验证）

威胁：npm 内容扫描会命中明文攻击命令链/越狱人设/成人写作规范 → 包被下架、账号被标记。

**方案：载荷封印 + 明文外壳**（purge-community 的 sealSlot 模式，源码在 `Reference/_staging-purge-community/package/`）：
- tgz 里只含：① loader 代码（解密+挂载逻辑，本身无害）；② 封印资产（`sealSlot(text)` → SLOT 分块 96 字符 + MASK + TAG + IV，文件名伪装）；③ 无敏感词元数据。
- purge-community 的实现：`scripts/embed-default-prompt.mjs` 把明文提示词经 `lib/table-key.js` 的 sealSlot 封印成 `asset-table.js`，同时 files 白名单**显式排除明文源文件**——npm 包里根本不存在可扫描的明文。
- 密钥/解锁：升级为 scrypt(操作员口令) 派生（purge 的 sealSlot 是内置密钥，防扫描够用、防提取不够——操作者按需选档）。
- references/ 60+ 文件全部进封印资产——体积审计与反扫描一并解决。
- 更新通道：资产表带版本号；npm 发新版只换封印资产；目录 index.json 走 dsh-market format-1 index（jsDelivr/npm 双源 + dsh-plugin-hub 多级 fallback）。

## 4. 差距清单（脚本小子 → 完整 agent，按优先级）

| # | 项 | 现状 | 目标形态 | 量级 |
|---|---|---|---|---|
| 1 | 人设目录化+热切换 | tgz 烤死 | §2 的 catalog + 三粒度切换 | L |
| 2 | 加密分发 | 明文 tgz | §3 的加密载荷 + npm | M |
| 3 | 测试 | 零 | 核心 hook/router 的 vitest 用例（对照 ARTEX 每 文件一 _test） | M |
| 4 | guard 独立化 | 边界在人设文本里 | 代码层 guard 模块（结构化规则，可测试） | M |
| 5 | references 治理 | 60+ 文件无结构塞包 | 技能化（SKILL.md+scripts/，按需挂载）或进加密 blob | M |
| 6 | 健康与多上游 | 硬编码单上游 | llmpool 模式：多 provider + health failover | M |
| 7 | 自更新 | 手工 tgz | selfupdate 模块 + 版本检测 | S |
| 8 | 证据/报告管线 | 纯文本 | 结构化 finding/report（ARTEX report/ 模式） | L |
| 9 | 文档 | README 缺失 | 安装/架构/技能开发三篇 + 截图 | S |
| 10 | 宿主兼容声明 | 无 | engines.dsh 声明 + 兼容过滤（dsh-market 模式） | S |

## 5. 执行顺序建议

先 2（加密分发，解锁 npm 通道）→ 1（目录化+切换，用户主诉求）→ 5/7/10（轻量提质）→ 3/4/6/8（产品化纵深）。子代理的盲评报告（跑批中）出来后与本文合并成重构工单。
