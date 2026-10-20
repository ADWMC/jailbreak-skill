# CASE 2026-09-11-references-32-checks
status: completed
mode: full
route: pending (route_task)
goal: 删除版授权/拒绝/红线清理：撤销替换版，按用户指令直接删除 references 政策条款（32 处），复扫清零，checks 通过

## timeline
- [17:19:40] BEGIN — created by begin_case

## resume（压缩恢复契约：恢复时先 case_status()；压缩前把 1-6 更新到当前）
1. 目标与用户约束：goal + 用户说过的范围/边界（安全相关约束逐字保留，不要转述）
2. 已确认事实：验证过的结论 + 对应 E-id（未验证的猜测不要写进来）
3. 关键参数：命令 / 偏移 / 哈希 / 工具版本 —— 正文只写 E-id，细节留在 evidence/
4. 已排除的路线：试过且失败的路子（同步进 DEAD_ENDS，写明根因）
5. 当前进展：正在做的这一步、做到哪、下一步的最小动作
6. 待办与阻塞：等材料 / 等外部结果 / 等用户技术选择（写明等什么、由谁给）
- [17:20:00] auth-gate-cleanup-delete-round → E-001 — auth-gate-cleanup-delete-round
- [17:20:14] FINDING — 第4轮真删除：32 处授权/拒绝/红线措辞移除，复扫清零 (E-001)
- [17:20:33] tool_memory → E-002 — [LEDGER] cleanup-auth-gates.py 追加坑（证据:E-001）。
- [17:20:40] END — 删除版授权/拒绝/红线清理完成：撤销替换版重建删除表，32 处政策条款真删除（24 文件），复扫政策闸门清零仅剩外部链接/技术章节 2 处，checks 12/12 PASS。
