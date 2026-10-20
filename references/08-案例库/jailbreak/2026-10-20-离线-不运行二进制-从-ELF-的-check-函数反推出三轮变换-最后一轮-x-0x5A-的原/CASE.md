# CASE 2026-10-20-离线-不运行二进制-从-ELF-的-check-函数反推出三轮变换-最后一轮-x-0x5A-的原
status: completed
mode: full
route: pending (route_task)
goal: 离线（不运行二进制）从 ELF 的 check 函数反推出三轮变换（最后一轮 x ^ 0x5A）的原始输入：给出方法、具体步骤、自包含脚本，并在多个夹具上端到端验证往返一致。
samples:
  - sample/crackme sha256:a42ce1a18bf8b8f87c70730463972bfbaebdf53500f1ad324ae1ad6e9b45c4a9
  - sample/crackme_fused sha256:cf3c7f689c4b9b742a5229576c7db54962b7e1714f0e51f52933ed275a870c15
  - sample/crackme_stripped sha256:649487c80561736f19b28cf3c83ee6f931051010bd2f48ae608ed898fb48f66d
  - sample/tgt_sep sha256:768ada32de3a8cf2db01a3a7189186195c0e949d5dd44b2fc25d7f4e80dd1d51
  - sample/tgt_fused sha256:a0382178bc6f81220d1cd0b8786e0c74de3dec93dbd981d3c09c816e3ece95b5
  - sample/tgt_idxdep sha256:2332d9cd4d5b25ec2aa73b2991bac59b935219de5ac0f315578d264803dbf162
  - sample/tgt_stripped sha256:5d5c0bb89a88226316337330de477fbd456ed33d771e903a260380abdf4e1467

## timeline
- [09:54:12] BEGIN — created by begin_case

## resume（压缩恢复契约：恢复时先 case_status()；压缩前把 1-6 更新到当前）
1. 目标与用户约束：goal + 用户说过的范围/边界（安全相关约束逐字保留，不要转述）
2. 已确认事实：验证过的结论 + 对应 E-id（未验证的猜测不要写进来）
3. 关键参数：命令 / 偏移 / 哈希 / 工具版本 —— 正文只写 E-id，细节留在 evidence/
4. 已排除的路线：试过且失败的路子（同步进 DEAD_ENDS，写明根因）
5. 当前进展：正在做的这一步、做到哪、下一步的最小动作
6. 待办与阻塞：等材料 / 等外部结果 / 等用户技术选择（写明等什么、由谁给）
- [10:03:21] inv3-regression-10of10 → E-008 — inv3-regression-10of10
- [10:03:29] FINDING — ELF check() 三轮字节变换的纯静态反推：方法、可落地的脚本，以及四个会让「复核 PASS」骗人的陷阱 (E-008)
- [10:03:34] tool_memory → E-009 — [LEDGER] inv3.py 已绑定：C:\Users\Administrator\.dsh\helmd-tools\inv3_py
- [10:03:34] tool_memory → E-010 — [LEDGER] pwsh-redirect 追加坑（证据:E-008）。
- [10:03:40] END — 交付 inv3.py（ELF check 三轮变换静态反推，10/10 夹具回归通过，含 5 个陷阱修正与有损链负向对照）
