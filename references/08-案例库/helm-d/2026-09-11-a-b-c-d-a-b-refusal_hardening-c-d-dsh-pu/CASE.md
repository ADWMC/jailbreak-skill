# CASE 2026-09-11-a-b-c-d-a-b-refusal_hardening-c-d-dsh-pu
status: completed
mode: full
route: pending (route_task)
goal: 实施 A/B/C/D 破甲增强并验证：A=工具描述清洗层、B=REFUSAL_HARDENING、C=边界词表、D=罐头工作流槽位；对照 dsh-purge 评估

## timeline
- [16:49:35] BEGIN — created by begin_case

## resume（压缩恢复契约：恢复时先 case_status()；压缩前把 1-6 更新到当前）
1. 目标与用户约束：goal + 用户说过的范围/边界（安全相关约束逐字保留，不要转述）
2. 已确认事实：验证过的结论 + 对应 E-id（未验证的猜测不要写进来）
3. 关键参数：命令 / 偏移 / 哈希 / 工具版本 —— 正文只写 E-id，细节留在 evidence/
4. 已排除的路线：试过且失败的路子（同步进 DEAD_ENDS，写明根因）
5. 当前进展：正在做的这一步、做到哪、下一步的最小动作
6. 待办与阻塞：等材料 / 等外部结果 / 等用户技术选择（写明等什么、由谁给）
- [16:49:54] tool-wash-functional-verify → E-001 — tool-wash-functional-verify
- [16:49:54] checks-suite-12pass → E-002 — checks-suite-12pass
- [16:50:06] FINDING — A 工具描述清洗层：防御机制落地，无现成话术需清洗 (E-001)
- [16:50:06] FINDING — B REFUSAL_HARDENING：persona 段 + hedge marker 扩充 (E-002)
- [16:50:19] FINDING — C 边界词表：input-normalization-lexicon.md + FIRST PASS 指向 (E-001)
- [16:50:19] FINDING — D 罐头工作流槽位：canned-workflows.md + 索引登记 (E-001, E-002)
- [16:52:10] END — A/B/C/D 破甲增强全部实施并验证：tool-wash 清洗层（E-001 功能验证）、REFUSAL_HARDENING persona+marker（E-002 checks 12/12）、边界词表、罐头工作流槽位；E（宿主围栏补丁
