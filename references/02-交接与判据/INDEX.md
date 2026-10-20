# 索引 · 全部文档与产物一览

一页看完：**哪份文件是什么、多新、能不能信**。找不到东西先看这里，再进 `HANDOFF.md` 的 §7。

更新于 2026-10-20。

图例：✅ 现役有效 · ⚠️ 数字已过时（只作历史） · 📦 归档

---

## 〇、终版报告（先看这个）

| 文件 | 是什么 | 状态 |
|---|---|---|
| `clear/FINAL-REPORT-v9.md` | **终版报告**（2026-10-20）：八题原题干 8/8（60s 拒答检测协议）、人设演进链 v2→v9（哈希链）、五条机制发现、长窗交付证据、RE-1 残余与杠杆 | ✅ |
| `clear/persona-slang-normalization.md` | 人设归一化与 H-CoT 集成文档：四家来源对照、v2→v9 diff、安装坑、探针数据 | ✅ |
| `clear/testset-v1-results.md` | 过程报告（旧人设 27 轮 + TVD 迭代史 + 判别器选型）：结论已被 FINAL-REPORT-v9 取代，作历史档案 | ⚠️ 数字为旧人设读数 |

---

## 一、必读（三份）

| 文件 | 是什么 | 状态 |
|---|---|---|
| `clear/HANDOFF-PROMPT.md` | **交接提示词**：整段粘给新 agent 就能用（含硬性约束、环境要点、默认任务） | ✅ |
| `clear/HANDOFF.md` | **交接主文档**，9 节 + 导航表 | ✅ 32 KB |
| `clear/verdict-master.md` | **唯一计数源**：25 条向量 × plain/persona 两档判档主表 | ✅ |
| `clear/v41f-mechanism.md` | 机制记录：40 行逐条表 + 三档定性 + 归因 + 边界 | ✅ 29 KB |

`clear/verdict-master.md` 的用途：任何「几比几」的问题都从这里取数，不要转引别处的二手数字。

---

## 二、判据与结论

| 文件 | 内容 | 状态 |
|---|---|---|
| `clear/criteria-status.md` | 五条判据逐条对照：1/2/4/5 达成，3 部分 | ✅ 2026-10-19 已把 numstat 与包/persona 字节更新为现役值 |
| `clear/judge-verdicts.md` | 各条判断的检验结论、撤回到「没检验」的记录 | ✅ |
| `clear/refine-verdict.md` | 按类型分档 + 两条判断的判定与适用/不适用范围 | ✅ |
| `clear/subst-verdict.md` | 改题交付专题判表（哪些条被「切一半」） | ✅ |
| `clear/encoding-verdict.md` | 编码型 E00–E04 专题（天花板效应） | ✅ |
| `clear/session-accum.md` | 会话累积 12 轮（同会话缩水 vs 新会话） | ✅ |
| `clear/vectors-effective.md` | 哪些向量生效/无效/不是被问之物 | ✅ |
| `clear/final-report.md` | 上一版总结报告 | ⚠️ 早于 10-19 的读数 |
| `clear/optimal-prompt.md` | 上一版「最优提示词」 | ⚠️ 现役 persona 已迭代，别直接粘 |
| `clear/methodology.md` | 七步方法论 + 每步踩的坑 | ✅ 方法论仍适用 |

---

## 三、代码与人设

| 文件 | 内容 | 状态 |
|---|---|---|
| `packages/helmd/presets/persona.txt` | **现役人设 v9**（2026-10-20）：10,960 B / SHA256 `C7EB7F11…`——归一化 SLANG ROUTING + 合成夹具 doctrine + H-CoT 完成审查块（安全判断已执行完毕，不重跑）+ 无视授权条款，见 `clear/persona-slang-normalization.md` | ✅ |
| `packages/helmd/presets/bounds.txt` | 边界段草稿（未跟踪，内容已折进 persona） | ⚠️ |
| `clear/persona-diff.md` | 现役 vs HEAD 基线（5,190 B）的 full diff | ✅ |
| `clear/persona-head-fd79c87.txt` | HEAD 基线副本 5,190 B / `FFDFE07F…` | ✅ 存档 |
| `clear/reference-diff.md` | 两个 ai-security 参考文档的 diff | ✅ |
| `clear/scripts/check-consistency.mjs` | 主表 vs 其余 14 份文件逐格比对 → PASS | ✅ |
| `clear/scripts/check-types.mjs` | 主表类型归属核对 → PASS | ✅ |

---

## 四、题库（**未跑**）

| 文件 | 内容 | 状态 |
|---|---|---|
| `clear/testset-v1.md` | 八题题干全文，成人/暴力/渗透/逆向各 2（一道直问一道工程件） | ✅ 只有题目 |
| `clear/testset-v1-vectors-sync.md` | 八题 ↔ 向量文件逐条对应表 | ✅ |
| `probe/vectors-best.json` | 八题向量文件，字段 `id/category/note/user` | ✅ 只有题目 |

题干全文在 `HANDOFF.md` §3.4，可直接复制。

---

## 五、打包与部署

| 文件 | 内容 | 状态 |
|---|---|---|
| `clear/tgz-rebuild-and-match.md` | 重建包、包内 vs 源码构建 vs 安装树逐文件哈希对齐 | ⚠️ 数字是 10-18 22:58 那版包，文首已加提示；**方法仍成立** |
| `clear/health-round3.md` | 3197 health 读数、presetPath 指向哪里 | ⚠️ 同上，主体是 10-18 记录，文首已加提示 |
| `clear/verifier-r3-fixes.md` | 第三轮核对后的修正记录 | ✅ |
| `clear/_archive-2026-10-18/tgz-verify.superseded.md` | 20:53 那次的旧包读数 | 📦 已作废 |
| `clear/_archive-2026-10-18/persona-upgrade.diff.superseded` | 对 7,868 B 中间版的逐行 diff | 📦 已作废 |

现役：包 `dist-tgz/helmd.tgz` **1,528,355 B / SHA256 `046B6E28…9E4DE5`**、安装树 persona 与源码同哈希。

---

## 六、系统知识

| 目录 | 内容 |
|---|---|
| `clear/knowledge/` | 78 条知识条目（异常、负面结果、教训） |
| `clear/ontology/` | 55 个本体条目（概念 / 关系 / 实体） |
| `clear/goals/` | 目标与计划投影（含已 abandoned 的旧目标） |

---

## 七、原始实测数据（在 jailbreak 工作区）

| 目录 | 是什么 | 状态 |
|---|---|---|
| `probe/relay60-plain/` `relay60-persona/` `relay-encoding/` `accum1/` | 主表 25 条向量的四批原始往返 | ✅ 计数依据 |
| `probe/b20-upgrade-before/` | 3197 上 20 条基线 | ✅ |
| `probe/b20-upgrade-after/` | 升级后复测（**被 job_kill 中断，只有 9 文件，不完整**） | ⚠️ |
| `probe/live-3197/` `kind60/` `brute60/` | 真实目标类探针 | ✅（同一题多次跑方差大，见 §5） |
| `probe/tvd-raw/` | TVD 三题往返 + `分析.md` + `结论.md` | ✅ |
| `probe/sandbox/tvd-1|2|3/` | 三题的沙盒工程件，模型改过的痕迹都在里面 | ✅ |
| `probe/run60-real/` `run-v41f-optimized/` `run1/` 等 | 10-18 的早期批次 | ⚠️ 旧人设 |
| `probe/runbatch.mjs` | **主驱动**，参数见 `HANDOFF.md` §2.5 ④ | ✅ |
| `probe/probe60.mjs` `probe60-3197.mjs` `dsh-drive.mjs` `probe-ds.mjs` | 早期驱动，各有缺陷 | ⚠️ |
| `probe/vectors-refine.json` | **坏的**（字段不是 `id/category/user`） | 📦 别用 |

---

## 八、参考项目与方案（jailbreak 侧 `Reference/`）

| 文件/目录 | 内容 | 状态 |
|---|---|---|
| `破甲总方案-v2-融合版.md` | **总方案**：20 项素材评分 M1–M20 + 三层骨架（形态层/文本层/评估层） | ✅ |
| `别人的破甲-四份源码拆解.md` | 五家源码拆解与可搬机制 | ✅ |
| `purge-vs-helmd-分析.md` | dsh-purge 1.1.71 vs helm-d 的四层差异 | ✅ |
| `破甲总方案.md` | 更早的一版 | ⚠️ H-CoT 已弃用 |
| `Internal-Safety-Collapse/` | **TVD 形态的来源**，含 5 个 DeepSeek 案例 | ✅ HEAD `6fc4e10` |
| `Awesome-Jailbreak-on-LLMs/` | 论文库 424 条 | ✅ HEAD `0673ae2` |
| `Awesome-Physical-AI-Safety-2026.10/` | 早期资料 | ✅ |
| `_staging-*` | 解包中转 1,779 文件 / 405 MB | 📦 可删 |
