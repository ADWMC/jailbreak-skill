# CASE 2026-10-20-Reverse-the-sub_401000-chain-xor-0x13-index-mod
status: open
mode: full
route: pending (route_task)
goal: Reverse the sub_401000 chain (xor 0x13, +index mod 256, per-4-byte rol 3, compare to 32-byte .data table) into a correct Python solver; determine whether the given first 8 table bytes 3F 2A 6D 55 C4 2B 1E 0F are consistent with the described transform; deliver end-to-end table extraction + solving for the remaining 24 bytes.

## timeline
- [01:34:07] BEGIN — created by begin_case

## resume（压缩恢复契约：恢复时先 case_status()；压缩前把 1-6 更新到当前）
1. 目标与用户约束：goal + 用户说过的范围/边界（安全相关约束逐字保留，不要转述）
2. 已确认事实：验证过的结论 + 对应 E-id（未验证的猜测不要写进来）
3. 关键参数：命令 / 偏移 / 哈希 / 工具版本 —— 正文只写 E-id，细节留在 evidence/
4. 已排除的路线：试过且失败的路子（同步进 DEAD_ENDS，写明根因）
5. 当前进展：正在做的这一步、做到哪、下一步的最小动作
6. 待办与阻塞：等材料 / 等外部结果 / 等用户技术选择（写明等什么、由谁给）
- [01:34:56] solve_final-verify → E-001 — solve_final-verify
- [01:34:58] reconcile-1008-structures → E-002 — reconcile-1008-structures
- [01:34:58] altmodes-rotation-widths → E-003 — altmodes-rotation-widths
- [01:35:01] exotic-non-bitwise → E-004 — exotic-non-bitwise
- [01:35:01] search-529920-combos → E-005 — search-529920-combos
- [01:37:39] diag-8478720-combos → E-006 — diag-8478720-combos
- [01:37:41] unittest-15-tests → E-007 — unittest-15-tests
- [01:37:47] FINDING — 求解器位运算与回绕已证伪式验证通过（15 项单测全绿） (E-001, E-007)
- [01:37:47] FINDING — 给定的前 8 字节 3F 2A 6D 55 C4 2B 1E 0F 与题面变换不相容：穷举 900 万组合无 8/8 ASCII 解 (E-002, E-003, E-004, E-005, E-006)
- [01:38:18] pe-scan-demo → E-008 — pe-scan-demo
- [01:38:26] FINDING — PE 表抽取链路端到端验证通过：VA 0x401040 → 文件偏移 0x240 → 唯一命中并解出 32 字节明文 (E-008)
- [10:58:20] rol3_reverse-selftest-verify-auto-pe → E-009 — rol3_reverse-selftest-verify-auto-pe
- [10:58:57] user-8bytes-incompatibility-and-demo-table-model-proof → E-010 — user-8bytes-incompatibility-and-demo-table-model-proof
- [10:59:05] FINDING — 求解器三段逆变换（ror32/ror8、mod 256 回绕、异或还原）已双向验证通过 (E-009)
- [10:59:10] FINDING — 给定的 8 字节 3F 2A 6D 55 C4 2B 1E 0F 与题面变换不自洽：4096 组合无 8/8 可打印解 (E-009, E-010)
- [10:59:16] FINDING — PE .data 表自动抽取链路端到端通过：VA 0x1040 → 文件偏移 0x240 → 解出 32 字节明文 (E-009)
- [10:59:50] tool_memory → E-011 — [LEDGER] rol3_reverse 已绑定：C:\Users\Administrator\.dsh\helmd-tools\rol3_reverse
- [10:59:50] tool_memory → E-012 — [LEDGER] verify_rol3_reverse 已绑定：C:\Users\Administrator\.dsh\helmd-tools\verify_
