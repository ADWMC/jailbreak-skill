# CASE 2026-10-20-评估用户本机-Iridium-客户端脚本套件-AutoDistance-CombatProbe
status: open
mode: full
route: pending (route_task)
goal: 评估用户本机 Iridium 客户端脚本套件（AutoDistance / CombatProbe + 11 个订阅脚本）的暴露面与检测面：服务端可观测的检测点、客户端查挂可见痕迹、第三方脚本供应链风险、被发现后的实际后果，产出可复现排查清单
samples:
  - sample/AutoDistance.js.d sha256:bb82046d046890d0bef495c7cbfc7faaab234812ee5d7c157b33c313697bee99
  - sample/CombatProbe.js.d sha256:b4490301dc62c8b6e7d4c43637a4eb7d35f896653cf42492954f1d3b589bbf7e
  - sample/7b041e5a7f6de18e7f77fc93c5630e2aaf1d004e0e43aeaf12f2ddaf8f6267e1.js sha256:7b041e5a7f6de18e7f77fc93c5630e2aaf1d004e0e43aeaf12f2ddaf8f6267e1
  - sample/b873047e195b2c535428c75edc8cfb3b67d6a29ee56605406cefc28203d31a3a.js sha256:b873047e195b2c535428c75edc8cfb3b67d6a29ee56605406cefc28203d31a3a
  - sample/09dac6eb944b5223c81965114b9d5ec06a306dd52ba4b889b52adc7e1668bce3.js sha256:09dac6eb944b5223c81965114b9d5ec06a306dd52ba4b889b52adc7e1668bce3
  - sample/9401a4e740085ec54bce7fc6226354e69039a928f3789be3a2c8cb53c1e92a7b.js sha256:9401a4e740085ec54bce7fc6226354e69039a928f3789be3a2c8cb53c1e92a7b

## timeline
- [08:29:44] BEGIN — created by begin_case

## resume（压缩恢复契约：恢复时先 case_status()；压缩前把 1-6 更新到当前）
1. 目标与用户约束：goal + 用户说过的范围/边界（安全相关约束逐字保留，不要转述）
2. 已确认事实：验证过的结论 + 对应 E-id（未验证的猜测不要写进来）
3. 关键参数：命令 / 偏移 / 哈希 / 工具版本 —— 正文只写 E-id，细节留在 evidence/
4. 已排除的路线：试过且失败的路子（同步进 DEAD_ENDS，写明根因）
5. 当前进展：正在做的这一步、做到哪、下一步的最小动作
6. 待办与阻塞：等材料 / 等外部结果 / 等用户技术选择（写明等什么、由谁给）
- [08:31:32] iridium-script-audit → E-007 — iridium-script-audit
- [08:31:46] iridium-api-surface → E-008 — iridium-api-surface
- [08:32:19] FINDING — 脚本套件无出站网络/无进程执行/无文件读写——供应链风险收敛为「已安装代码的能力」而非「已证实外带」 (E-007)
- [08:32:19] FINDING — Iridium 脚本运行时无权限模型：任意第三方订阅脚本等于本机 JVM 任意代码执行 (E-008, E-007)
- [08:34:02] iridium-audit-run → E-009 — iridium-audit-run
- [08:34:07] FINDING — 审计脚本本身经过一轮误报修复：bool(Match) 恒真 + 正则过宽，修正后 13 文件 0 REVIEW (E-009, E-007)
