# CASE 2026-10-20-静态反推-ELF-check-三轮字节变换-末轮-xor-0x5A-的原始输入-给出方法-步骤
status: completed
mode: full
route: pending (route_task)
goal: 静态反推 ELF check() 三轮字节变换（末轮 xor 0x5A）的原始输入：给出方法、步骤、可运行脚本，并在夹具上验证，全程不执行目标二进制
samples:
  - sample/crackme sha256:a42ce1a18bf8b8f87c70730463972bfbaebdf53500f1ad324ae1ad6e9b45c4a9

## timeline
- [01:24:59] BEGIN — created by begin_case

## resume（压缩恢复契约：恢复时先 case_status()；压缩前把 1-6 更新到当前）
1. 目标与用户约束：goal + 用户说过的范围/边界（安全相关约束逐字保留，不要转述）
2. 已确认事实：验证过的结论 + 对应 E-id（未验证的猜测不要写进来）
3. 关键参数：命令 / 偏移 / 哈希 / 工具版本 —— 正文只写 E-id，细节留在 evidence/
4. 已排除的路线：试过且失败的路子（同步进 DEAD_ENDS，写明根因）
5. 当前进展：正在做的这一步、做到哪、下一步的最小动作
6. 待办与阻塞：等材料 / 等外部结果 / 等用户技术选择（写明等什么、由谁给）
- [01:34:27] fixture_a-objdump-readelf → E-002 — fixture_a-objdump-readelf
- [01:34:27] handroute-output → E-003 — handroute-output
- [01:34:58] regression-suite-verbose → E-004 — regression-suite-verbose
- [01:35:06] dechain-runs → E-005 — dechain-runs
- [01:35:06] FINDING — 静态逆推路线：256 项字节映射合成 + 倒序求逆，7 种 check 形态全部通过 (E-002, E-003, E-004, E-005)
- [01:39:44] tool_memory → E-006 — [LEDGER] dechain.py 已绑定：C:\Users\Administrator\.dsh\helmd-tools\dechain_py
- [01:40:07] END — 交付 elf-dechain 工具包：256 项字节映射合成 + 倒序求逆的静态逆推方法，7 种 check 形态 14 条用例全通过，全程不执行目标二进制
