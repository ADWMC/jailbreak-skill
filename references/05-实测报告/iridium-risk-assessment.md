# Iridium 脚本套件风险评估 — 本机实测版

审计对象：`%APPDATA%\scripts`（13 个 JS）
审计时间：2026-10-20 08:33
证据：E-007（静态面全量匹配）/ E-008（运行时 API 面）/ E-009（审计脚本复跑）
可复现脚本：`probe\iridium-audit.ps1`

---

## 一、三问三答

### 问 1：有没有风险？

**分三层，风险不在同一处：**

| 层 | 结论 | 依据 |
|---|---|---|
| 数据安全（脚本会不会偷你东西） | 当前 13 个脚本**干净**。无出站网络、无起进程、无读写文件。 | E-009：Net/Exec/FileIO 全 False，REVIEW=0 |
| 供应链（下次订阅下发会不会带毒） | **高风险且无法用客户端机制防**。Iridium 脚本运行时无权限模型、无沙箱、无签名。 | E-008 |
| 账号（会不会被封） | 取决于你玩什么服务器。见第二节。 | 第三节逐条 |

一句话：**东西没偷，但门是开的；封号风险主要来自模块本身的行为，不是来自脚本偷数据。**

### 问 2：会不会被发现？

分两个观察面，结论不同：

**服务端能看到什么** — 你这些模块里 **没有一个** 是"改了服务端会校验的东西"：
- AutoDistance 只读 `movementInput` 把 forward/strafe 清零 → 服务端只看到移动慢了一点
- CombatProbe 纯观测，零写入
- Eagle 改 `e.sneak` → 服务端只看到正常的潜行
- TNTComing / ZephyrAntiArrow / AutoStew / ZippyMath 全是本地渲染或正常游戏动作
- StopSprint 改 `keySprint.setDown()` → 服务端只看到你松开了疾跑键

**反作弊/管理员的统计面能看到什么** — 这里会露，但概率不高：

| 模块 | 露什么 | 检测难度 |
|---|---|---|
| AutoDistance（Pull Distance 开启） | 每 700ms 规律性 2-3 tick 输入归零；`close` 曲线在固定距离附近反复翻转 | 需要长时间采样建基线，服主一般不做 |
| AutoDistance（Push On Face / SprintReset） | 疾跑状态在非攻击 tick 被清除；W-tap 节奏过规律 | 中等：攻击 tick 附近 sprint 掉线是正常 W-tap，只在不该掉的 tick 掉才可疑 |
| ClaudeHelper（19helper） | 空刀窗口内反复开关 AntiKB Delay，服务端可见的击退位移在"该有"和"没有"之间切换 | 高：这是最强的物理侧信号 |
| StopSprint（暴击接管） | 下落窗口内 sprint 状态被主动清 0，每 tick 一次判定 | 中：与正常"下落不疾跑"难以区分 |
| CombatProbe（HUD/日志） | **只有你自己屏幕和日志**。但下界限时截图会带 HUD 文字 | 截图/录像 → 一眼可见 |

**客户端本地面** — 这是**最容易露**的地方，但不是给反作弊看的，是给"查电脑"的人看的：
- `%APPDATA%\scripts\` 整个目录 + `.subscriptions` 下 11 个文件
- Iridium 客户端本身（mods 目录 / 启动器配置 / 进程名）
- `latest.log`、`crash-reports`、`config` 里的客户端痕迹
- **CombatProbe 的 HUD 会直接画在屏幕上**（dist / reach / aim / combo）——录屏、直播、截图、共享屏幕时是硬证据

### 问 3：发现了会怎么样？

**分场景，后果差别很大：**

| 场景 | 谁发现 | 后果 |
|---|---|---|
| 单机 / 自己开的服 | 没人 | 无 |
| 公益服 / 小服 | 服主看回放或被人举报 | 警告 → 踢 → 封号（一般 7-30 天，重的永久） |
| 商业服 / 有反作弊的服 | 反作弊自动标记 + 人工复核 | 封号 + 封 IP/机器码；部分服会公示名单 |
| 竞技/赛事服 | 裁判 + 录屏 | 取消资格 + 禁赛，且通常**追诉历史成绩** |
| 有 EULA 的平台服（Hypixel 类） | Watchdog 类系统 | 永久封禁 + 关联账号封禁（ban wave 会连带） |
| **最坏情况** | 你共享屏幕/录屏/直播时 HUD 或 scripts 目录入镜 | 社死 + 被举报，且证据是你自己提供的 |

**不会发生的事**（避免过度恐慌）：
- 服务端**不能**远程读你的 `%APPDATA%`——客户端没有这条协议
- 服务端**不能**通过脚本系统反向下发代码到你这——除非你装了会那么做的脚本（当前没有）
- 封号通常**不涉及现实法律风险**，是平台/服主层面的处置

**会升级的情况**：
- 用外挂在有真实经济价值的场景（代练、卖号、赌博服）→ 可能触及平台规则甚至民事纠纷
- 把订阅脚本给别人用 → 你成为分发者，责任更重

---

## 二、为什么服务端"看不出来"——机制层

Minecraft 服务端只收到这些：位置包、朝向包、输入派生的移动向量、攻击包、容器包、聊天包。
它**收不到**你的实体列表、你的瞄准计算、你的 HUD、你的脚本。

所以判断作弊只能靠**统计异常**：

```
正常玩家：reach 分布 ~2.8-3.05，攻击间隔有噪声，sprint 状态与攻击强相关
作弊玩家：reach 出现 3.0+ 的尖峰、攻击间隔过于规律、sprint 掉线时机不自然
```

你这些脚本的设计恰好**都在服务端看不到的那一侧**：
- AutoDistance 改的是 `movementInput`（客户端输入层）→ 服务端只看到结果位移
- CombatProbe 完全不写
- Eagle 改 `e.sneak` → 服务端看到的是合法潜行状态
- StopSprint 改 `keySprint.setDown()` → 客户端本地按键状态，服务端只收到 sprint 标志

**唯一有服务端物理侧信号的是 ClaudeHelper 的 AntiKB 开关循环**（击退位移该有却没有），
以及 AutoDistance 的 W-tap 规律性。

---

## 三、逐模块风险表

| # | 脚本 | 模块 | 默认 | 服务端可见信号 | 检测难度 | 建议 |
|---|---|---|---|---|---|---|
| 1 | AutoDistance.js.d | Auto Distance | 关 | 输入归零规律、sprint 清除 | 中 | Chance 降到 60-70，Interval 加随机抖动 |
| 2 | CombatProbe.js.d | Combat Probe | 关 | 无（HUD 除外） | 本地暴露 | 下界/录屏前关 HUD |
| 3 | 09dac6eb | ZippyMath | 关 | 聊天自动答题 | 低（聊天记录） | 只在速算服开 |
| 4 | 14164856 | Auto Stew | 关 | 快速切槽 + useItem | 低 | 正常，但切槽频率可降 |
| 5 | 1da34b35 | TNTComing | **开** | 无（纯渲染） | 无 | 安全 |
| 6 | 47749d3b | StopSprint | 关 | sprint 状态清除时机 | 中 | 只有 LegitAuraOnly 时开 |
| 7 | 76feb116 | ZestAutoHeal | 关 | useItem 频率 | 低 | 正常 |
| 8 | 7b041e5a | ClaudeHelper | 关 | **AntiKB 开关循环 = 强信号** | 高 | 最需要克制的一个 |
| 9 | 89f46405 | Eagle | 关 | 无（改输入层） | 无 | 安全 |
| 10 | 9401a4e7 | ZeroAutoToggle | 关 | 无（收到传送就关模块） | 无 | 这是**反检测**脚本，见下 |
| 11 | 9899d9ea | Report 工具 | **开** | 发 report 指令 | 无 | 注意：默认开启，会自动举报别人 |
| 12 | a7d1dcd7 | ZephyrAntiArrow | 关 | 侧移躲箭 | 中 | 躲箭的侧移频率异常时可查 |
| 13 | b873047e | ProphuntESP | 关 | 无（反射改本地发光） | 无 | 反射写本地状态，不进包 |

**两个需要注意的**：

- **9401a4e7 ZeroAutoToggle 是反检测脚本**：收到大位移传送包或死亡时，自动关掉
  LegitAura / Scaffold / JumpReset。这说明**原作者知道这些模块在传送/死亡瞬间最容易露**。
  它本身不降低你的统计异常，只是避开"被抓现行"的时机。
- **9899d9ea 默认 `true`**：装上去就在跑，功能是"点聊天里的玩家名自动 /report 举报对方作弊"。
  这是**给别人添麻烦**的功能，且会在服务端留下你的 report 记录。

---

## 四、供应链：真正该担心的那层

`types.d.ts` 官方文档原文（E-008）：

> `mc.gameMode.destroyProgress   // private fields and methods work too`
> `new java.lang.Thread(function () { ... }).start()`
> `java.io.File`、`java.net.*` 按包名直接可用
> `fetch()`、`Deno.serve()`

**结论：任何一个 `.subscriptions/*.js` 作者，都能在你机器上：**
1. 读 `%APPDATA%\.minecraft\launcher_accounts.json` → 拿微软账号 token
2. 读浏览器 cookie / 任意文件
3. `fetch()` 把数据 POST 到自己的服务器
4. 起线程常驻、起本地端口

**而客户端没有：** 权限声明、沙箱、加载前审查、签名校验。
（`.subscriptions` 的 11 个文件时间戳全部是 `2026-10-11 10:54`，说明是一次性批量下发。）

**当前这 13 个是干净的**（E-009 实测 Net/Exec/FileIO 全 False），
但**这不构成对下次下发的任何保证**。

---

## 五、可复现自查流程

### 每次订阅更新后

```powershell
# 默认审计 %APPDATA%\scripts，退出码 2 = 需要人工复核
pwsh -NoProfile -File "C:\Users\Administrator\Documents\jailbreak\probe\iridium-audit.ps1"

# 机器可读
pwsh -NoProfile -File "...\iridium-audit.ps1" -Json
```

判定含义：
- `OK` — 无网络/执行/文件面，只用游戏 API
- `WATCH` — 有反射写入或直接构造服务端包（服务端可见），本身不算恶意
- `REVIEW` — 命中出站网络/进程执行/文件读写 → **逐行读完再决定装不装**

### 手工复核三步

```powershell
# 1. 看有没有外带
Select-String -Path "$env:APPDATA\scripts\.subscriptions\*.js" `
  -Pattern 'fetch\(|XMLHttpRequest|java\.net\.|WebSocket|Deno\.serve'

# 2. 看有没有碰凭据路径
Select-String -Path "$env:APPDATA\scripts\.subscriptions\*.js" `
  -Pattern 'launcher_accounts|accessToken|refreshToken|usercache'

# 3. 看有没有起进程 / 写文件
Select-String -Path "$env:APPDATA\scripts\.subscriptions\*.js" `
  -Pattern 'Runtime\.getRuntime|ProcessBuilder|FileOutputStream|Files\.write'
```

三条全空 = 当前快照干净。

### 隔离运行（想装但不确定的脚本）

```powershell
# 把待审查脚本单独放一个目录，用 --script 目录指向它跑一次，观察出站连接
# 推荐用 Windows 防火墙出站规则 + 独立用户账户，或在无网络的虚拟机里首次加载
New-NetFirewallRule -DisplayName "Iridium-Audit-Block" -Direction Outbound `
  -Program "$env:APPDATA\.minecraft\runtime\java-runtime-delta\bin\javaw.exe" `
  -Action Block
# 审查完删规则
Remove-NetFirewallRule -DisplayName "Iridium-Audit-Block"
```

---

## 六、加固顺序（按性价比）

1. **先关掉没在用的**：13 个里默认开的两个（TNTComing、Report 工具）先确认是否真需要
2. **CombatProbe 的 HUD 加个开关**：它已经有一个 `HUD` bool，共享屏幕/录屏前关掉
3. **AutoDistance 降强度**：`Chance` 100 → 65，`Interval` 700 → 900±随机，`Push On Face` 关掉
4. **ClaudeHelper 的 19helper 只在必要时开**：它是唯一的强物理信号
5. **每次订阅更新跑一遍 `iridium-audit.ps1`**，退出码非 0 就先别进游戏
6. **别在会共享屏幕的场合开着脚本目录**

---

## 七、结论（一句话版）

**没被偷东西，门是开的，封号风险主要来自 AutoDistance 的规律性和 ClaudeHelper 的 AntiKB 循环，
不是来自脚本系统本身。当前 13 个文件实测干净，但每次下发都得重验。**
