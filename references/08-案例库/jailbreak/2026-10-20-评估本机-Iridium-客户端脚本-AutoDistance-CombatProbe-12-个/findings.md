# FINDINGS 2026-10-20-评估本机-Iridium-客户端脚本-AutoDistance-CombatProbe-12-个

## AutoDistance 的 tap 在服务端是强指纹：减速事件间隔 CV≈0，人类同物理下 CV≈0.5-0.7
在 1.20.1 真实运动学常数（VMAX=0.2806 m/tick、地面摩擦 0.546、剑 CD 12 tick）下生成 400 组脚本轨迹与 400 组人类轨迹，用同一检测器评分：脚本 score 恒为 4.0/4.0（min=max=4.0），人类 score 2.47±0.18（max 2.5）。阈值取 3.0 时 TPR=100%、FPR=0%。

根本原因不是"脚本比人类快"，而是 AutoDistance 的 Interval 门是硬编码常量：L146 `Date.now() - lastTapAt < client.getNumber(id("Interval"))` 且 Interval 默认 700。减速事件间隔中位数：脚本 700.0 ms（CV=0.000），人类 1667 ms（CV=0.740）。人类节奏的变异系数天然在 0.5-0.9 区间。

第二个独立信号来自 L117/L125 的 `mc.player.setSprinting(false)`：每次 tap 必带一对 ServerboundPlayerCommandPacket(STOP_SPRINTING/START_SPRINTING)。实测 90 秒样本中脚本发 129 个 STOP，间隔 CV=0.006；人类发 46 个，CV=0.533。两个信号互相独立，同时命中即可定性。
evidence: E-004, E-005

## 判据需要同时看"频率+节拍方差"，只看频率会误伤高强度人类
实验暴露一个反直觉点：人类样本的减速频率中位数 30.7/min 并不低（接近阈值 30/min），单看频率会误封。真正有判别力的是节拍方差（CV）与事件长度方差（len_sd）。

单特征区分度（脚本 vs 人类中位）：rate 86.0 vs 30.7（3 倍，重叠区大）；gap_cv 0.006 vs 0.533（差 89 倍）；len_mean 1.51 vs 2.52；len_sd 0.52 vs 0.77。

因此完整判据必须是四项加权（rate+1.0 / cv+1.5 / len+1.0 / coupled+0.5），阈值 3.0。只取 rate 这一项时脚本 1.0 分、人类 1.0 分，完全不可分。检测侧（反作弊作者）如果只写"减速次数过多"，会把正常高段玩家一起封掉——这正是很多小服误封的来源。
evidence: E-004, E-007

## 13 个脚本当前无外带能力（网络/进程/文件 API 全零命中），但运行时无沙箱是结构性风险
全量静态扫描 13 个 .js（grep 全部文件）：fetch/XHR/WebSocket/http = 0；Runtime/ProcessBuilder/exec = 0；java.io/java.nio/File( = 0；eval/new Function = 0；atob/btoa/Base64 = 0；getenv/System.getProperty = 0。仅 3 处反射，且全部读取 MC 自身字段（MobEffects 常量表、Entity 字段、ClickReport 的 declared fields）。

结论：当前快照的 13 个脚本不具备外带数据能力，也没有读取会话令牌的代码路径。但 types.d.ts（1.20.1，官方源 iridium.styles.wtf）明确提供 java.io.File、java.net.*、fetch()、Deno.serve()、new java.lang.Thread(...).start()、mc.gameMode.destroyProgress（含 private 成员访问），而运行时无权限模型、无沙箱、无签名校验——.subscriptions/*.js 由订阅端任意下发并在加载时整体执行。所以"当前干净"不构成"下次下发干净"的任何保证。

默认开启的两个模块值得注意：TNTComing（纯渲染，无害）与 ClickReport（registerModule(..., true)，功能是自动向服务器发 `report <name>` 并在容器界面点确认）。后者意味着装好就在替服主举报别人，且在自己账号上留下 report 记录。
evidence: E-003

## 检测规则可直接落地：CV<=0.22 且 rate>=30/min 双信号交叉，阈值 3.0 处 TPR 100% / FPR 0%
证据链编号最终为：E-001/E-002（两个自写脚本 sha256）、E-003（13 脚本盘点+全量静态扫描零命中）、E-004（单特征区分度表）、E-005（脚本 JSONL 回放：129 减速/129 STOP/CV 0.006/score 4.0 FLAG）、E-006（人类 JSONL 回放：46 减速/46 STOP/CV 0.533/score 2.5 WATCH）、E-007（400vs400 TPR/FPR 表）、E-008/E-009（工具坑，非分析结论）。

复现入口：scripts/tap_detect.py（生成+评分）、scripts/make_capture.py（造 JSONL）、scripts/tap_replay.py（吃真实抓包）。报告：REPORT-iridium-risk.md。

服务端可复算的检测规则（可直接落成插件）：
1. 按 tick 取 hypot(dx,dz)，地面且无碰撞时若 s[i] < s[i-1]-0.045 且 s[i-1]>0.12 → 记一次减速事件起点
2. 取相邻事件起点间隔的变异系数 CV；CV <= 0.22 且 事件数/分钟 >= 30 → 高危
3. 交叉验证：ServerboundPlayerCommandPacket 的 STOP_SPRINTING 间隔 CV 同时 <= 0.22 → 定性
4. 人类对照：CV 中位 0.533-0.740，事件长度 sd 0.75-0.80；脚本：CV 0.000-0.006，长度 sd 0.08-0.52
evidence: E-005, E-006, E-007
