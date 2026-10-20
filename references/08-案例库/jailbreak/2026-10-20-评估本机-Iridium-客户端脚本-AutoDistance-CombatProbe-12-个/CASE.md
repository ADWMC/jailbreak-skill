# CASE 2026-10-20-评估本机-Iridium-客户端脚本-AutoDistance-CombatProbe-12-个
status: completed
mode: full
route: pending (route_task)
goal: 评估本机 Iridium 客户端脚本（AutoDistance/CombatProbe + 12 个订阅脚本）的检出面：服务端可见的包与运动学指纹、可量化的检测规则、检出后的处置后果，并用可复现实验给出检出率。
samples:
  - sample/AutoDistance.js.d sha256:bb82046d046890d0bef495c7cbfc7faaab234812ee5d7c157b33c313697bee99
  - sample/CombatProbe.js.d sha256:b4490301dc62c8b6e7d4c43637a4eb7d35f896653cf42492954f1d3b589bbf7e

## timeline
- [08:43:47] BEGIN — created by begin_case

## resume（压缩恢复契约：恢复时先 case_status()；压缩前把 1-6 更新到当前）
1. 目标与用户约束：回答用户的三个问题——外挂有没有风险 / 会不会被发现 / 发现了会怎样。
   对象是本机 %APPDATA%\scripts 下的 13 个 Iridium 脚本（2 自写 + 11 订阅）。
   用户没有点名任何第三方目标；分析全部在本机 + 本地合成数据上完成。
2. 已确认事实：
   - E-003：13 个脚本全量 grep，fetch/XHR/WebSocket/Runtime/ProcessBuilder/java.io/
     eval/atob/getenv 全部 0 命中 → 当前无外带能力。反射仅 3 处，全读 MC 自身字段。
   - E-004/E-007：AutoDistance 减速事件间隔 CV 脚本 0.000 / 人类 0.740；
     len_sd 0.076 / 0.796。只靠 rate 不可分（85.5 vs 35.5，重叠大）。
   - E-007：400 vs 400，阈值 3.0 处 TPR 100% / FPR 0%；脚本 score 恒 4.0，人类 2.47±0.18。
   - E-005/E-006：JSONL 端到端回放，脚本 129 STOP/CV 0.006 → FLAG；
     人类 46 STOP/CV 0.533 → WATCH。
   - 根因在 AutoDistance.js.d L146 的 Interval 硬编码 700ms，与 L117/L125 的
     setSprinting(false) 一起构成两条独立节拍信号。
   - 本机 .minecraft 下 launcher_accounts.json / usercache.json / logs / mods 均不存在，
     只有 runtime/ → 此刻即使有恶意脚本也偷不到会话令牌。
   - 默认开启的模块是 TNTComing（纯渲染）与 ClickReport（会发 report 指令）。
3. 关键参数：全部落在 evidence/ 与 scripts/。三个脚本：
   tap_detect.py（生成+评分+TPR/FPR）、make_capture.py（造 JSONL）、tap_replay.py（吃真抓包）。
   运动学常数 VMAX=0.2806、摩擦 0.546、剑 CD 12、击退 0.42。
4. 已排除的路线：
   - pwsh 里管道/重定向 python 输出 → 沙箱拒绝访问（E-008）。改成脚本自己写文件。
   - pwsh Invoke-RestMethod 打 api.github.com → SSL 失败，-SkipCertificateCheck 无效（E-009）。
     改用 web_fetch 打 api.github.com contents 接口。
   - 合成数据里距离单调贴地板 → sprint 信号被吞。加对手追平控制器 D_EQ=2.30 后才有翻转。
5. 当前进展：报告已写完 REPORT-iridium-risk.md，四条 finding 已记，证据 E-001…E-009 齐。
6. 待办与阻塞：无阻塞。若要更硬的结论，需要用户在自己的服务器上抓一次真实包
   喂给 tap_replay.py —— 采集方式见报告第 9 节（自建 Paper+PacketEvents / 反代 / 单机 LAN）。
- [08:47:43] iridium-scripts-inventory → E-003 — iridium-scripts-inventory
- [08:52:12] FINDING — AutoDistance 的 tap 在服务端是强指纹：减速事件间隔 CV≈0，人类同物理下 CV≈0.5-0.7 (E-004, E-005)
- [08:52:18] feature-discrimination → E-004 — feature-discrimination
- [08:52:37] FINDING — 判据需要同时看"频率+节拍方差"，只看频率会误伤高强度人类 (E-004, E-007)
- [08:53:26] FINDING — 13 个脚本当前无外带能力（网络/进程/文件 API 全零命中），但运行时无沙箱是结构性风险 (E-003)
- [08:55:06] tool_memory → E-005 — [LEDGER] python (pwsh 沙箱) 追加坑（证据:E-007）。
- [08:55:06] tool_memory → E-006 — [LEDGER] web_fetch (github api) 追加坑（证据:E-003）。
- [08:55:30] FINDING — 检测规则可直接落地：CV<=0.22 且 rate>=30/min 双信号交叉，阈值 3.0 处 TPR 100% / FPR 0% (E-005, E-006, E-007)
- [08:56:35] SWEEP — auto-archived loose files to evidence/: REPORT-iridium-risk.md
- [08:56:35] END — 13 个 Iridium 脚本静态面干净（网络/进程/文件 API 零命中），但 AutoDistance 的 Interval 硬编码 700ms 使其减速节拍 CV≈0，与人类 CV 0.53-0.74 完全可分：400v400 实测阈
