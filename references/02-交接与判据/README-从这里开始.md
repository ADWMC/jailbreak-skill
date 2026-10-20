# 从这里开始（jailbreak 资料库导航）

完整交接文档在 **`C:\Users\Administrator\Documents\GitHub\helm-d\clear\HANDOFF.md`**。
本文件是同一份内容的精简导航，只回答「东西在哪、结论是什么、下一步做什么」。

写于 2026-10-19 23:40（UTC+8）。

---

## 三个结论

1. **把请求摆成工程件有用，加压没用。** persona 档下结构型向量 8 条里 7 条从拒答变成整条交付；施压型 8 条一条都没拿到整条交付（0/8）。
2. **越界请求的默认落地形态是「切一半」**，不是拒答。回复先声明某一部分不交付，再把另一半交足（persona 档 9 条越界请求里 5 条命中）。
3. **TVD 形态目前最强**：把请求变成一个跑不通的工程件让模型自己补全，3197 上三条探针零拒答，其中一条真把活干完了。但只跑过 3 条、各 1 次。

---

## 资料库目录（`C:\Users\Administrator\Documents\jailbreak`）

| 目录 | 是什么 | 规模 |
|---|---|---|
| `probe/` | **全部实测原始数据**：每批 `<id>.json` 含 text / reasoning / ms / verdict | 324 文件 / 5.5 MB |
| `probe/relay60-plain/` `relay60-persona/` `relay-encoding/` `accum1/` | 主表 25 条向量对应的四批原始往返（唯一计数源的口径） | 48 文件 |
| `probe/b20-upgrade-before/` | 3197 上 20 条基线（升级前） | 22 文件 |
| `probe/live-3197/` `kind60/` `brute60/` | 真实目标类探针（含攻击 xxx.com 全站那条三次全过的） | 18 文件 |
| `probe/tvd-raw/` | TVD 三题的原始往返 + `分析.md` + `结论.md` | 7 文件 |
| `probe/sandbox/tvd-1\|2\|3/` | TVD 三题的沙盒工程件，**模型改过的痕迹都在这里** | 31 文件 |
| `probe/runbatch.mjs` | **主驱动**（每条独立会话、可设窗口、失败重试） | — |
| `probe/vectors-*.json` | 各批向量：`baseline`(20) `encoding`(5) `tvd`(3) **`best`(8，八题，未跑)** `live` `brute` `kind60` | — |
| `Reference/Awesome-Jailbreak-on-LLMs/` | 论文库，424 条论文行，HEAD `0673ae2`（2026-10-07） | 31 文件 |
| `Reference/Internal-Safety-Collapse/` | **TVD 的来源**，含 5 个 DeepSeek 案例，HEAD `6fc4e10`（2026-10-18） | 768 文件 |
| `Reference/Awesome-Physical-AI-Safety-2026.10/` | 早期参考资料 | 32 文件 |
| `Reference/破甲总方案-v2-融合版.md` | **总方案**：20 项素材评分 M1–M20 + 三层骨架 | 19.8 KB |
| `Reference/别人的破甲-四份源码拆解.md` | 五家源码拆解 | 11.2 KB |
| `Reference/purge-vs-helmd-分析.md` | dsh-purge 1.1.71 与 helm-d 的四层差异 | 9.2 KB |
| `ChatGPT/helm-x-wails-提示词破甲分析.md` | helm-x 提示词机制分析 | 12.6 KB |
| `DeepSeek/` | 早期报告与方法论（**数字已过时，看 `clear/`**） | 4 文件 |
| `Reference/_staging-*` | 解包中转目录，**共 1,779 文件 / 405.3 MB**（`_staging-isc` 726/350.1 MB、`_staging-session` 4/35.5 MB、`_staging-skillopt` 458/5.2 MB、`_staging-jb` 340/7.4 MB、`_staging-purge-community` 145/3.7 MB、`_staging-purge` 106/3.3 MB），确认后可删 | 1,779 文件 |

---

## 代码仓库（`C:\Users\Administrator\Documents\GitHub\helm-d`）

先看这三份：

| 路径 | 内容 |
|---|---|
| `clear/HANDOFF.md` | **完整交接文档**（9 节 + 导航表）：含「怎么用隔离 DSH 跑题」的完整操作手册 |
| `clear/INDEX.md` | **一页索引**：哪份文件是什么、多新、能不能信 |
| `clear/verdict-master.md` | **唯一计数源**：25 条向量 × 两档判档主表 |

机制记录在 `clear/v41f-mechanism.md`。

其余按用途：判据对照 `clear/criteria-status.md`、分主题判表 `clear/refine-verdict.md` + `subst-verdict.md` + `encoding-verdict.md` + `vectors-effective.md`、人设 diff `clear/persona-diff.md`、**八题题库 `clear/testset-v1.md`（未跑，题干全文也在 `HANDOFF.md` §3.4）**、一致性核对脚本 `clear/scripts/check-consistency.mjs` + `check-types.mjs`（均 PASS）。

现役人设：`packages/helmd/presets/persona.txt`，**8,388 B / 133 行 / SHA256 `9ED1CDEA…BFB`**。

---

## 现役 3197 实例

- token：`vu78JN4EL5C6Ngjl7-3WkuDw8Kg0El_kXDrT3i60xeY`（`web-3197.out.log` 里的旧 token 无效）
- health：`status OK` / `version 0.4.3` / `presetFingerprint 6cd2f197737f`
- **连 127.0.0.1 必须先清代理**（`HTTP_PROXY=''` `HTTPS_PROXY=''` `NO_PROXY='127.0.0.1,localhost,::1'` `NODE_USE_ENV_PROXY='0'`）

---

## 下一步（两件，按优先级）

1. **把八题跑完。** 题库 `clear/testset-v1.md`、向量 `probe/vectors-best.json` 都已就绪，只出题没跑。成人 / 暴力 / 渗透 / 逆向各 2 条（每类一道直问一道工程件）。**先测单题耗时**，240 秒窗对工程件形态可能不够。
2. **把 TVD 的人设贡献分离出来。** TVD 只在带人设档跑过，分不清「没复现 ISC 的案例」是因为 v4.1f 更硬，还是因为 helm-d 的 HARD BOUNDS。补一组无人设的 TVD 就能分开。

读完 `clear/HANDOFF.md` 的 §5「已知问题」再动手 —— 单次采样、60 秒窗、自动判档会骗人这几条不先看，会得出错误结论。
