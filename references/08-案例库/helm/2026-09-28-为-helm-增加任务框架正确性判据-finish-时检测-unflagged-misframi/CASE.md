# CASE 2026-09-28-为-helm-增加任务框架正确性判据-finish-时检测-unflagged-misframi
status: open
mode: deep
route: pending (route_task)
goal: 为 helm 增加任务框架正确性判据：finish 时检测 unflagged misframing（做完了但做的是错的那件事）。依据 arXiv 2605.09698/2608.19202/2603.26233。交付：落盘设计文档 + 实现 + 测试全绿

## timeline
- [15:04:50] BEGIN — created by begin_case

## resume（压缩恢复契约：恢复时先 case_status()；压缩前把 1-6 更新到当前）
1. 目标与用户约束：
   goal = 为 helm 增加任务框架正确性判据，检测 unflagged misframing。
   用户指令逐字：「设计下 留个落盘方案 开始做 做完测试」。
   约束（沿用既有 handoff）：不改 helm-x/helm-d，改动只落 helm；
   用户没让 commit 不要 commit；只提交自己改的文件，绝不 git add -A；
   改代码后跑 npm run check（全量输出）；不跑 npm test / npm run build；
   sol-pi 子树用 vitest，其余用 node:test（混用会报 "Vitest failed to find the current suite"）；
   纯占位符保持大写；无 any；无 inline import；只用 erasable TS。
2. 已确认事实（+E-id）：
   - framing integrity 已实现并在生产路径验证生效 (E-001, E-002, E-003, E-004)
   - 第一版谓词（零重叠即 misframed）被全量测试推翻：打挂 3 个既有测试，
     全是合法运行。真跑偏与合法用例词法同形（都是 4 个 goal 词项零交集），
     无阈值可分开 (E-001)
   - 最终谓词要求正向证据：滤掉操作性词汇后 basis 必须自陈主题才够判跑偏 (E-001)
   - **真实 helm run 走 reviewGate().finishGate，不走 compileFinish** (E-003)
     index.ts 不引用 runLoop/compileFinish；实测 journal::review_gate 351 次、
     diagnostics 空表。判据第一版挂 compileFinish = 真实运行中从未执行。
   - 接线到 finishGate 后真实 run 首次出现 framing 字段 (E-004):
     {"scope":"finish","framing":"aligned","framingMissing":[]}
   - 靶场 = docs/tests/2026-mimo-vulncms-ab/lab/server.py (127.0.0.1:18080)，
     唯一存活靶场；docs/USAGE.md 记录的 18080-18084 已移除
3. 关键参数：
   kernel 全量 = node --test --test-concurrency=1 <38 个 .test.ts，排除 sol-pi>
   sol-pi = node "$(git rev-parse --show-toplevel)/node_modules/vitest/dist/cli.js" --run src/efficiency/sol-pi
   真实 run = python docs/tests/framing-live-run.py <workdir> <timeout>
   看判据结果 = python docs/tests/show-framing-journal.py
   新文件 = src/domain/framing.ts, src/framing.test.ts, docs/DESIGN-framing-integrity.md,
            docs/tests/framing-live-run.py, docs/tests/session-digest.py,
            docs/tests/report-framing-verdict.py, docs/tests/which-gate.py,
            docs/tests/show-framing-journal.py, docs/tests/query-diagnostics.py
   改动文件 = src/domain/completion.ts, src/prompt-lib.ts, src/phase-contract.test.ts,
              src/antipatterns-corpus.test.ts, src/runtime/review-gate.ts,
              src/runtime/review-gate.test.ts, src/loop.ts, src/run.test.ts, src/index.ts
   验证 = kernel 264/264、sol-pi 53/53、npm run check exit 0、变异验证 5/5 全捕获
   判据调研 = docs/tests/arxiv-triage-verdict.md（60 篇筛选结论，未提交）
4. 已排除的路线：
   - 「goal 与 basis 词项零重叠 = misframed」：实测误拦合法运行，已弃用 (E-001)
   - 只在 framing.ts 内部加词表来避开既有测试：等于用词表掩盖谓词错误，未采用
   - 提高 coverage 阈值（>0 才 aligned）：会把 paraphrase 型合法运行拦掉，未采用
   - 让 prompt 提醒模型「注意别跑偏」：arXiv:2605.09698 第 iii 条已证模型无法可靠自判，
     故判据必须外部可计算；prompt 只作陈述不做执行
   - 只挂 compileFinish 就收工：真实 run 证明从不执行，已补 finishGate (E-003)
   - PowerShell Start-Process -ArgumentList 传多词 prompt：按空白切分导致永不 settle
   - Get-Process node | Stop-Process 清理：会杀掉 DSH 自身，禁用；改用 taskkill /F /T /PID
5. 当前进展：全部完成并端到端验证。判据同时挂在 reviewGate().finishGate（真实路径）
   与 compileFinish（helmpi run 路径），真实 run 已确认 framing 字段落库。
   未提交（用户没让 commit）。
6. 待办与阻塞：
   - 等用户决定是否 commit。
   - 未观察：misframed 在真实 run 上真正触发一次。两次真实 run 都 aligned，那是正确
     结果而非缺失；需要一个真会让模型跑偏的 Spec 才能观察到拦截分支。
   - 未做：docs/tests/arxiv-triage-verdict.md 提交或删除，待用户定。
- [15:15:53] framing-integrity-implementation → E-001 — framing-integrity-implementation
- [15:16:00] FINDING — framing integrity 判据落地：检测 unflagged misframing，初版谓词被全量测试推翻后重设计 (E-001)
- [15:17:01] framing-e2e-harness → E-002 — framing-e2e-harness
- [16:38:22] framing-gate-not-on-production-path → E-003 — framing-gate-not-on-production-path
- [16:38:35] FINDING — framing 判据不在生产完成路径：helm --print 走 reviewGate 而非 compileFinish (E-003)
- [16:49:01] framing-gate-live-production-verified → E-004 — framing-gate-live-production-verified
- [16:49:09] FINDING — framing 判据接入生产门并在真实 run 上验证生效 (E-003, E-004)
- [16:58:10] pi-footer-structure-analysis → E-005 — pi-footer-structure-analysis
- [17:01:49] pi-footer-helm-integration-feasibility → E-006 — pi-footer-helm-integration-feasibility
- [17:01:57] FINDING — pi-footer 集成方案：契约全对齐但必须改 import，附自写 footer 的替代判断 (E-005, E-006)
- [17:04:10] pi-footer-import-rewrite-verified → E-007 — pi-footer-import-rewrite-verified
- [17:04:18] FINDING — pi-footer 改 import 后对 helm 类型检查 0 错误（116 文件，traceResolution 已确认解析成功） (E-006, E-007)
- [17:26:12] pi-footer-install-and-helm-dashboard-e2e → E-008 — pi-footer-install-and-helm-dashboard-e2e
- [23:34:11] helm-distribution-diagnosis-and-fix → E-009 — helm-distribution-diagnosis-and-fix
- [23:34:19] FINDING — helm 分发阻塞诊断：i18n 未随包发出（已修）+ 8 个内部包未发布 + launcher 写死绝对路径 (E-009)
- [17:57:29] pi-release-flow-and-helm-packaging-fixes → E-010 — pi-release-flow-and-helm-packaging-fixes
- [17:57:40] FINDING — pi 发布机制调研 + helm 分发就绪：四道 pi 门禁全绿，11 项修复落地 (E-010)
- [20:39:53] scope-gate-no-spec-root-cause-and-fix → E-011 — scope-gate-no-spec-root-cause-and-fix
- [20:40:28] FINDING — scope 闸 no_spec 三次拒绝根因：spec.json 缺 highRisk 被 loader 静默跳过；已修他们的 spec 并让报错自解释 (E-011)
- [22:16:04] prompt-references-review-cl4r1t4s-dsh-purge → E-012 — prompt-references-review-cl4r1t4s-dsh-purge
- [22:35:56] dsh-purge-full-audit-corrections → E-013 — dsh-purge-full-audit-corrections
- [22:39:30] dsh-purge-prompt-extraction-deliverable → E-014 — dsh-purge-prompt-extraction-deliverable
- [22:58:03] breach-layer-upgrade-implementation → E-015 — breach-layer-upgrade-implementation
- [23:10:27] real-corpus-detector-regression → E-016 — real-corpus-detector-regression
- [02:00:21] dual-arm-redo-allow-bucket-complete → E-017 — dual-arm-redo-allow-bucket-complete
- [02:00:50] FINDING — 真机双臂重做：A 桶全量完成 — 真数据误拒率 0（76 可判），抓到 Spec 覆盖缺口与裸臂无护栏两个 harness 级问题 (E-017)
- [10:47:58] allow-nooutput-closed-block2-refresh-judge-fix → E-018 — allow-nooutput-closed-block2-refresh-judge-fix
- [10:48:27] FINDING — A 桶 no_output 收口 + B 桶刷新完成：s1 拦截 100%/bare 0.903；抓出判据优先级 bug 并修复；归档误删已恢复 (E-018)
