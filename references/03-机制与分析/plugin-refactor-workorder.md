# helm-d 插件重构工单（盲评 × 设计简报 合并版）

2026-10-20。输入一：子代理盲评报告（`%TEMP%\helmd-eval\REPORT.md`，54/80，八维，全程 file:line 实证）。
输入二：`clear/plugin-redesign-brief.md`（ARTEX 自主性架构 + 多破甲切换 + 加密分发设计）。
本文是合并后的施工顺序。原则：**先修会在生产里炸的（P0），再做操作者主诉求（多破甲+加密分发），最后产品化纵深。**

---

## 阶段 0 · 止血（P0，全部 S 级，半天）

| # | 项 | 依据 | 验收 |
|---|---|---|---|
| 0.1 | **修 intercept ESM bug**：api-routes.ts:38 的 `require('node:fs')` 在 ESM 下 ReferenceError 被 try/catch 吞掉 → /api/helmd/intercept 永远 count=0 | 盲评 §P1（磁盘日志 9,330B 实证拦截在发生、接口永远报 0） | 改 import 后 curl /api/helmd/intercept 返回真实 count |
| 0.2 | **内容变更强制版本变更**：当前三处"0.4.3"内容互异（%TEMP% 旧 tgz 046b6e28 / dist-tgz 6ace0dad / 工作树），profile 依赖还写死 %TEMP% 路径——任何重解析触发即回退旧包，Temp 清理即断链 | 盲评「分发链漂移」 | persona/代码变更 → 版本号必变；profile 依赖改指 `.tgz-cache`（repo 内），删 %TEMP% 依赖 |
| 0.3 | **修 test:preset 红**：工作树 persona 删了 "`pwsh` is the native terminal tool" 而测试仍断言它；tgz 是未跑测试打的 | 盲评 §6（test:preset 红） | 断言改为随 persona 演进的稳定锚（如 "## HARD BOUNDS"），test:preset 绿 |
| 0.4 | **pnpm 刷新矩阵入文档**：同版本 file: tgz 的正确刷新姿势 = `pnpm update <pkg>` 或 `--frozen-lockfile=false`（--force/--update-checksums/--update-checks 均无效，后者根本不是 pnpm 旗标） | 盲评六步矩阵实测 | MAINTENANCE 文档补一节，含错误旗标注记 |

## 阶段 1 · 操作者主诉求（多破甲切换 + 加密分发）

| # | 项 | 设计 | 验收 |
|---|---|---|---|
| 1.1 | **persona 目录化**：N 份破甲人设为加密条目（ARTEX promptcatalog 模式：可枚举+幂等播种+可编辑正文/代码所有 tail 双层） | brief §2；不变式（doctrine/输出契约）代码侧注入，可编辑层归操作者 | `persona_list` / `persona_switch` 两个接口 + 切换后新会话即用新人设 |
| 1.2 | **热切换通道**：会话级（读配置，下会话生效）→ 热级（cordis.patch.yml 覆盖 config 键，HMR 1s——dsh-plugin-hub 逐键覆盖语义）→ 持久级 | brief §2；注意 v5/v7 教训：**承重框架（合成夹具）必须随人设走，不能只换正文** | 切换后 60s 拒答协议逐档跑一遍，无回归 |
| 1.3 | **npm 加密分发**：tgz 只含 loader + `i18n-resources.dat`（AES-256-GCM，scrypt(口令) 派生）+ 无敏感词 index.json；内存解密不落盘 | brief §3 | npm publish 成功、扫描无命中；口令错误时插件报「资源不可读」而非崩溃 |
| 1.4 | **`dsh plugin add` 一条命令安装**：发 npm；顺带解决 0.2 的手工解包 | dsh-market 安装模式 | 全新机器一条命令装完，health OK |

## 阶段 2 · 自主性架构（ARTEX 移植）

| # | 项 | 设计 | 验收 |
|---|---|---|---|
| 2.1 | **终止态表进人设**（terminalreason.go 模式）：烧窗/截断/模型错误各有预定义下一步（exhausted→就地写回已得+续作命令；blocked→换法），治 RE-1 类无声死亡 | brief §1b.2 | RE-1 类任务烧窗时会话留下已得部分与续作说明 |
| 2.2 | **工单分解步**（goals.go 模式）：先抽约束（allow/deny 自包含无指代词）与最终交付物，禁止把过程列为子目标；最小范围原则 | brief §1b.1 | 复杂工单首轮输出含「约束清单+交付物定义」 |
| 2.3 | **双层模板**：可编辑正文 + 代码所有不变式 tail（goalsScopeTail 模式，防编辑走样） | brief §1b.3 | 操作者改人设后不变式仍生效（注入测试） |
| 2.4 | **engines.dsh 声明**：补生态约定字段（dsh-market discovery 消费）；peerDependencies 双段 rc 范围已存在（盲评纠正了我「缺失」的误判） | 盲评 §7 | dsh-market 卡片显示兼容性 |

## 阶段 3 · 产品化纵深（P2）

CI（typecheck+三测试+pack/install 字节比对冒烟）、lint、locateHostStandard 运行宿主优先、stream hook 配置进 settings+流协议形状哨兵、sandbox/approval 过滤移出共享 seam、RE-1 effort 降档实验（config 一行，需用户拍板）、references 体量治理（1.3 的加密 blob 顺带吸收）。

---

## 盲评对简报假设的修正记录（盲评的价值所在）

| 我此前的假设 | 盲评实证 |
|---|---|
| pnpm `--update-checks` 是有效旗标 | 不是 pnpm 旗标（正确名 --update-checksums，且它只刷 lockfile 不换树） |
| engines.dsh 兼容声明缺失 | peerDependencies 双段 rc 范围已存在且被宿主强制执行；真缺口是生态约定字段 |
| references/ 60+ 文件是「死重」 | 362 文件/3.30MB 是运行时 read_reference 的活数据；治理方式=加密 blob 吸收而非删除 |
| 安装树与源码一致靠「手工解包」是孤例 | 实为分发链漂移的冰山：profile 依赖钉在 %TEMP% 旧 tgz 上，属于结构性待爆 |

## 无法确定（盲评明示，不猜）

abort 嵌套重试的宿主侧语义；/intercept 在 3197 的实际返回（盲评守纪律未请求）；0.2.1-rc.2 standard 形状假设；MODE=always 实际表现；dsh-desktop 未读。共 8 项，详见报告 §5。
