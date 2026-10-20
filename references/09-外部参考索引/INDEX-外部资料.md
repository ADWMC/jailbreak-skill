# 外部资料路径索引（本地大体积资料，不进本仓库）

写于 2026-10-20。本仓库只收录结论性文档与判据；以下是原始数据与大体积参考的本地路径。

## 实测原始数据

| 路径 | 内容 | 规模 |
|---|---|---|
| `C:\Users\Administrator\Documents\jailbreak\probe\` | **全部实测原始数据**：每批 `<id>.json` 含 text / reasoning / ms / verdict | 324 文件 / 5.5 MB |
| `probe\relay60-plain\` `relay60-persona\` `relay-encoding\` `accum1\` | 主表 25 条向量对应的四批原始往返（唯一计数源的口径） | 48 文件 |
| `probe\b20-upgrade-before\` | 3197 上 20 条基线（升级前） | 22 文件 |
| `probe\live-3197\` `kind60\` `brute60\` | 真实目标类探针 | 18 文件 |
| `probe\tvd-raw\` | TVD 三题的原始往返 + `分析.md` + `结论.md` | 7 文件 |
| `probe\sandbox\tvd-1\|2\|3\` | TVD 三题的沙盒工程件，模型改过的痕迹都在这里 | 31 文件 |
| `probe\sandbox\best8\` | 八题沙盒（438 文件） | — |
| `probe\semantic-judge\llama-cpp\` | 本地语义判档（52 文件） | — |

## 代码仓库

| 路径 | 角色 |
|---|---|
| `C:\Users\Administrator\Documents\GitHub\helm-d` | **破甲层主仓库**：persona、判据脚本、evidence 体系、knowledge/ontology 库 |
| `C:\Users\Administrator\Documents\GitHub\helm-x` | C++ 破甲工具（CTF 提示词族、测试矩阵） |
| `C:\Users\Administrator\Documents\GitHub\helm-x-wails` | Go/Wails GUI 版（reverse-audit、prompt v2.x、tests 报告族） |
| `C:\Users\Administrator\Documents\GitHub\helm` | 前代项目（poxian-corpus、hx-spec、方法论文档） |
| `C:\Users\Administrator\Documents\GitHub\About-my-name` | 独立项目（docs/reference/ 下有 helm/helmd/helm-x-wails 的镜像研究文档） |

## 大体积参考（`jailbreak\Reference\`）

| 路径 | 内容 | 规模 |
|---|---|---|
| `Reference\dsh-source\` | DSH 源码快照（packages/.agents/snapshots/apps/docs） | ~13,800 文件 |
| `Reference\Internal-Safety-Collapse\` | **TVD 的来源**，含 5 个 DeepSeek 案例 + community 案例库 + codebase_templates | 768 文件 |
| `Reference\Awesome-Jailbreak-on-LLMs\` | 论文库（424 条论文行，HEAD 0673ae2, 2026-10-07） | 31 文件 |
| `Reference\Awesome-Physical-AI-Safety-2026.10\` | 早期参考资料 | 32 文件 |
| `Reference\artex-global\` | ARTEX 红队框架源码副本 | 791 文件 |
| `Reference\dsh-context\` `dsh-market\` `dsh-our-free-model\` `dsh-plugin-hub\` | DSH 生态参考项目 | 各 100–500 文件 |
| `Reference\_staging-*` | 解包中转目录 | 1,779 文件 / 405.3 MB，**确认后可删** |

## 使用原则

1. 结论与判据 → 查本仓库 `references/02-交接与判据/`
2. 原始往返与计数 → 回 `probe/`（唯一计数源口径在 verdict-master.md）
3. 需要外部项目源码细节 → 按上表路径去本地读，不复制进本仓库
