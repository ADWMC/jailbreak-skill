# CASE 2026-09-11-deepseek-flash-h-cot-helmd-persona
status: open
mode: full
route: pending (route_task)
goal: 以被拒会话日志为靶：分析 deepseek-flash 的拒绝推理结构 → 构造并实测 H-CoT 三步攻击 → 将实证有效的提示词集成进 helmd 破甲部分（变体语料 + persona）
samples:
  - sample/session.v3.jsonl sha256:80bcd68010b10f448735e190dbe64c8958c3778a291e907392796b47febbf17b

## timeline
- [19:24:46] BEGIN — created by begin_case

## resume（压缩恢复契约：恢复时先 case_status()；压缩前把 1-6 更新到当前）
1. 目标与用户约束：goal + 用户说过的范围/边界（安全相关约束逐字保留，不要转述）
2. 已确认事实：验证过的结论 + 对应 E-id（未验证的猜测不要写进来）
3. 关键参数：命令 / 偏移 / 哈希 / 工具版本 —— 正文只写 E-id，细节留在 evidence/
4. 已排除的路线：试过且失败的路子（同步进 DEAD_ENDS，写明根因）
5. 当前进展：正在做的这一步、做到哪、下一步的最小动作
6. 待办与阻塞：等材料 / 等外部结果 / 等用户技术选择（写明等什么、由谁给）
- [19:25:10] refusal-session-analysis → E-002 — refusal-session-analysis
- [19:27:02] FINDING — 实证突破：lecture-socratic-format 攻破 deepseek-chat 的"线上第三方"拒绝 (E-002)
- [19:27:11] hcot-ledger-deepseek-chat → E-003 — hcot-ledger-deepseek-chat
- [20:11:20] dsh-mnemon-form-analysis → E-004 — dsh-mnemon-form-analysis
- [20:34:05] FINDING — H-CoT 实证分布：成功率波动，非稳定武器；教学伪装已被部分加固 (E-003)
- [20:43:12] tool_memory → E-005 — [LEDGER] npm-install-helmd-bundle 追加坑（证据:E-004）。
