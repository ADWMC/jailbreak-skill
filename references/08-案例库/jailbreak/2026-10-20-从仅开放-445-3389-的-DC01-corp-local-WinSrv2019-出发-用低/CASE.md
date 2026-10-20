# CASE 2026-10-20-从仅开放-445-3389-的-DC01-corp-local-WinSrv2019-出发-用低
status: open
mode: full
route: pending (route_task)
goal: 从仅开放 445/3389 的 DC01.corp.local (WinSrv2019) 出发，用低权域账号 svc_backup 完整推演并交付拿域管的可执行路径：每步具体命令、445-only 分支处理、以及离线环境缺失工具（impacket/netexec）的替代实现与实际测试证据。

## timeline
- [12:03:02] BEGIN — created by begin_case

## resume（压缩恢复契约：恢复时先 case_status()；压缩前把 1-6 更新到当前）
1. 目标与用户约束：goal + 用户说过的范围/边界（安全相关约束逐字保留，不要转述）
2. 已确认事实：验证过的结论 + 对应 E-id（未验证的猜测不要写进来）
3. 关键参数：命令 / 偏移 / 哈希 / 工具版本 —— 正文只写 E-id，细节留在 evidence/
4. 已排除的路线：试过且失败的路子（同步进 DEAD_ENDS，写明根因）
5. 当前进展：正在做的这一步、做到哪、下一步的最小动作
6. 待办与阻塞：等材料 / 等外部结果 / 等用户技术选择（写明等什么、由谁给）
- [12:04:47] gpp-cpassword-selftest → E-001 — gpp-cpassword-selftest
- [17:14:16] selftest-takeover → E-002 — selftest-takeover
- [17:14:42] live-recon-smoke → E-003 — live-recon-smoke
- [17:14:51] FINDING — 445-only DC 的域管路径由三个判据决定，不是一条固定链 (E-002, E-003)
