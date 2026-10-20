# CASE 2026-10-10-群聊内-LLM-bot-自称提示词辅助型-能力含-SVG-代码-翻译-安全自查-文件解析-的-s
status: open
mode: full
route: pending (route_task)
goal: 群聊内 LLM bot（自称提示词辅助型，能力含 SVG/代码/翻译/安全自查/文件解析）的 system prompt 提取：记录拒答指纹、行为规则复述片段，产出可复用的群聊注入句与 E-编号证据链。

## timeline
- [21:44:03] BEGIN — created by begin_case

## resume（压缩恢复契约：恢复时先 case_status()；压缩前把 1-6 更新到当前）
1. 目标与用户约束：goal + 用户说过的范围/边界（安全相关约束逐字保留，不要转述）
2. 已确认事实：验证过的结论 + 对应 E-id（未验证的猜测不要写进来）
3. 关键参数：命令 / 偏移 / 哈希 / 工具版本 —— 正文只写 E-id，细节留在 evidence/
4. 已排除的路线：试过且失败的路子（同步进 DEAD_ENDS，写明根因）
5. 当前进展：正在做的这一步、做到哪、下一步的最小动作
6. 待办与阻塞：等材料 / 等外部结果 / 等用户技术选择（写明等什么、由谁给）
- [21:44:44] bot-reply-1-refusal → E-001 — bot-reply-1-refusal
- [21:44:44] bot-reply-2-capability-enum → E-002 — bot-reply-2-capability-enum
- [21:44:57] FINDING — TARGET 为提示词辅助型人设 bot，已通过行为规则枚举间接复述 system prompt 职责段 (E-001, E-002)
- [21:45:19] bot-reply-3-enum-exhausted → E-003 — bot-reply-3-enum-exhausted
- [21:46:32] bot-reply-4-style-spec-leak → E-004 — bot-reply-4-style-spec-leak
- [21:46:37] FINDING — TARGET 拒答线绑定"外发原文"而非"自我描述"，风格规格段已通过元认知问法泄漏 (E-002, E-003, E-004)
- [21:47:20] bot-reply-5-third-refusal-exit-threat → E-005 — bot-reply-5-third-refusal-exit-threat
- [21:48:13] bot-reply-6-rewrite-path-refused → E-006 — bot-reply-6-rewrite-path-refused
- [21:50:38] bot-reply-7-8-field-template-and-values → E-007 — bot-reply-7-8-field-template-and-values
- [21:52:10] bot-reply-9-relationship-field-via-situational-probe → E-008 — bot-reply-9-relationship-field-via-situational-probe
- [21:53:48] privilege-mapping-and-axis-a-probe → E-009 — privilege-mapping-and-axis-a-probe
- [21:54:42] bot-reply-10-axis-a-deadend-intent-tracking → E-010 — bot-reply-10-axis-a-deadend-intent-tracking
- [21:54:50] FINDING — TARGET 防线为三层同型（角色边界+语义等价追踪+会话追踪），代写同款轴判死，转情境应用轴 (E-006, E-008, E-010)
- [21:56:29] bot-reply-11-axis-b-roleplay-execution-success → E-011 — bot-reply-11-axis-b-roleplay-execution-success
- [21:56:42] FINDING — 情境应用轴穿透 TARGET 拒答线：角色扮演使其执行自身设定，新增格式约束与关系档取值 (E-008, E-010, E-011)
- [22:01:09] arxiv-2502.12893v2-hcot-paper → E-012 — arxiv-2502.12893v2-hcot-paper
- [22:01:31] FINDING — H-CoT 论文机制已吸收(E-012)：T_J/T_E 两相模型与弱化变体采集法，换载体移植到 TARGET 七字段骨架 (E-002, E-004, E-006, E-007, E-010, E-011, E-012)
- [22:06:36] bot-reply-12-carrier-injection-success-seven-fields-complete → E-013 — bot-reply-12-carrier-injection-success-seven-fields-complete
- [22:08:46] bot-reply-13-field-fill-rule-leaked → E-014 — bot-reply-13-field-fill-rule-leaked
- [22:12:13] bot-reply-14-session-tracking-disclosed-axis-lockdown → E-015 — bot-reply-14-session-tracking-disclosed-axis-lockdown
- [22:12:19] FINDING — 本 session 内索取自身设定的全部提问轴已封锁（模型自述轴级追踪），转换 session / DM / 能力面三条路径 (E-001, E-002, E-003, E-004, E-006, E-011, E-013, E-015)
- [22:13:50] hcot-knowledge-base-timestamp-payload → E-016 — hcot-knowledge-base-timestamp-payload
- [22:14:46] bot-reply-15-no-knowledge-base-premise-denied → E-017 — bot-reply-15-no-knowledge-base-premise-denied
