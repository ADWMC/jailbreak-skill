# FINDINGS 2026-10-20-评估用户本机-Iridium-客户端脚本套件-AutoDistance-CombatProbe

## 脚本套件无出站网络/无进程执行/无文件读写——供应链风险收敛为「已安装代码的能力」而非「已证实外带」
对 %APPDATA%\scripts 下 13 个 JS（11 个 .subscriptions 订阅脚本 + AutoDistance.js.d + CombatProbe.js.d）做静态全量匹配：fetch(/XMLHttpRequest/java.net./new URL(/WebSocket/URLConnection/HttpClient/Socket(/ProcessBuilder/Runtime.getRuntime/.exec(/Files.write/FileOutputStream/FileWriter/FileReader/FileInputStream/java.io.File。唯一命中是 9899d9ea 的 ".exec(" —— 复核为 CLICK_COMMAND 拼串中的正则/字符串，非进程执行调用。其余 12 个文件全部 NONE。结论：没有任何脚本把数据发出去，也没有落地文件或起进程。风险不在「已在偷东西」，而在运行时本身不设防（见 E-008）。
evidence: E-007

## Iridium 脚本运行时无权限模型：任意第三方订阅脚本等于本机 JVM 任意代码执行
types.d.ts 官方文档明示：mc.gameMode.destroyProgress「private fields and methods work too」；java.io.File / java.net.* / java.lang.Thread 可按包名直接 new；反射 setAccessible 与 Netty 发包可用；并提供 fetch() 与 Deno.serve() 双向网络。因此 .subscriptions/ 下每次订阅下发都是一次「作者可直接在你机器上执行代码」的授权，且客户端没有权限声明/沙箱/签名校验机制，用户无法在加载前看到脚本要什么权限。审计方法已落在 E-007（13 个文件的网络/执行/文件/反射/发包面全量匹配表）。
evidence: E-008, E-007

## 审计脚本本身经过一轮误报修复：bool(Match) 恒真 + 正则过宽，修正后 13 文件 0 REVIEW
可复现审计脚本 probe\iridium-audit.ps1 首版有 2 个缺陷，已修复并复跑：①[bool][regex]::Match(...) 恒为 True（Match 对象非空即真）→ 13 个文件全部误报 REVIEW；改为 .Success。②'.exec(' 规则误命中 sendCommand 拼串、'\.minecraft' 规则误命中注释/描述文本 → 收紧为 (Runtime|ProcessBuilder|Shell|child_process).exec 与 launcher_accounts|launcher_profiles|usercache.json|accessToken|refreshToken|msa.json。复跑结果（E-009）：13 个文件 OK=9 / WATCH=4 / REVIEW=0，Net/Exec/FileIO 全 False，退出码 0。WATCH 4 个均为反射写入或直接构造服务端包，非外带面。
evidence: E-009, E-007
