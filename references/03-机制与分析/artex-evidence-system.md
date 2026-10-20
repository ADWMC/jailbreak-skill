# ARTEX 证据系统调研 · 完整架构与 helm-d 集成设计

2026-10-20。全部结论来自 `Reference/artex-global/` 源码逐文件阅读（evidence/store.go 425 行 + store_test.go、agent/finding_recorder.go、agent/capture.go、agent/finding_workflow.go、db/ 事务层），file:line 随文标注。

---

## 1. 一句话

ARTEX 的证据系统把「发现」与「支持它的原始流量」用**内容寻址 blob + 事务绑定**焊死：流量日志是可丢弃的，证据是不可丢弃的；agent 永远不亲手碰证据体，原子写由注入的实现负责；未引用的证据 24 小时宽限后 GC。

---

## 2. 存储层（evidence/store.go，425 行）

### 2.1 内容寻址 blob 库

- 写入：`writeBody` 对内容算 sha256 → `blobs/<hash前2位>/<hash>.bin`，**fsync 后才返回**（store.go:84-89）；已存在则 `verifyFile` 重验哈希与长度（:94-99）。
- 打开：`OpenBody` 每次都 `verifyFile`（:258）——**每次读取都是一次完整性断言**，不是信任历史。
- 目录混淆：hash 前两位做分片目录（:40），防单目录文件爆炸。

### 2.2 快照与自校验元数据

- 流量证据快照 `TrafficEvidenceSnapshot`（URL/Method/Status/ReqHead/RespHead/ReqHash/RespHash/长度），`v.Normalize()` 规范化一次，然后 **`v.ID = db.TrafficSnapshotID(v)`——ID 本身是元数据的哈希**（:170-175）。归档恢复时校验 `v.ID != TrafficSnapshotID(v)` 即拒绝（:319「归档证据快照元数据哈希不匹配」）。**元数据造假在结构上不可能**：改任何一个字段，ID 对不上。

### 2.3 事务与锁

- 所有写走 `WithEvidenceTx` + **advisory lock**（`LockTaskEvidenceTx` / `LockFindingEvidenceTx`，:183-186、:198-201）——同一 task/finding 的证据写串行化。
- **锁纪律有明确的并发推理**（:230-236 注释）：大 body 流式下载**不得**持有事务锁（会阻塞全进程的证据写），所以 `Binding` 只在锁内取元数据、`OpenBody` 在锁外流式读——安全性靠「blob 是内容寻址的 + GC 只回收未引用 + 24h 宽限 + 已打开的 fd 不受 unlink 影响」四条保证。

### 2.4 绑定模型

- `Record(finding, trafficRefs)`：原子地「记录发现 + 绑定其流量证据」（:182-195）。
- `Bind(findingID, refs)`：给已有发现补绑证据（:197-213）。
- finding 与 snapshot 是**多对多绑定表**（finding_traffic_bindings），不是嵌套——证据可复用于多个发现。

### 2.5 GC：宽限期 + 引用计数

`Collect`（:347-404）：把无绑定的快照打 `unreferenced_at` 时间戳 → 超 24h 且仍无绑定才删行 → 遍历 blobs/.staging 删除无引用且超 24h 的文件。`RunGC` 每小时 ticker。**证据不会因为「暂时没人引用」被误删**——24 小时宽限吸收所有竞态。

### 2.6 便携归档

- `CopySnapshots`：报告下载/便携任务归档用，**目标目录拥有真实拷贝，绝不链接进可丢弃存储**（:265-268 注释）。
- `InstallSnapshots/WithInstalledSnapshots`：恢复时先钉住 blob 再恢复元数据，且**回调内禁止再取证据锁**（:314-317）——锁序死锁被 API 形状直接排除。

---

## 3. Agent 侧：证据永不经过 agent 的手

`agent/finding_recorder.go`（全文 22 行）：

- **FindingRecorder 是宿主注入的接口**（`Record(ctx, input, refs)`），注入点覆盖 ToolSet/Worker/Planner/MainAgent 全部执行体。
- 注释原文：**「agents never synthesize or copy evidence bodies themselves. Its implementation owns the atomic write.」**——agent 只上报「我做了什么、看到什么」，证据体的落盘、哈希、绑定全部由宿主实现原子完成。
- **工具提示词级的绑定纪律**（findingTrafficGuidance，:17）：`report_finding` 时用 `traffic_refs` **按复现顺序**绑定真实 ID；「域名和时间只作候选筛选，不推定关联」；无确切匹配就省略或传 []；「不要猜测 ID，也不要仅为补包重复探测」；未绑定时**在 evidence 保留命令输出、日志等其他可验证证据，并说明未绑定原因**。

这条提示词纪律就是我们 A 级判档的「证据优先」条文的工程化版本：**允许无证据，但无证据必须显式声明并另行保留可验证材料**。

---

## 4. 设计原则提炼（六条，全部可迁移）

1. **证据与过程分离**：流量/日志是可丢弃的过程数据，发现证据是持久资产——两套存储、不同生命周期。
2. **内容寻址 + 读时验证**：哈希即地址，每次读取重新验证，信任不随时间衰减。
3. **元数据自哈希**：ID = 元数据哈希，篡改任何字段即结构失效。
4. **agent 与证据物理隔离**：agent 上报事实，原子写在宿主实现里——agent 无法伪造或污染证据体。
5. **终止态全覆盖的 GC**：无引用 ≠ 立删，24h 宽限 + 每小时巡检——竞态被时间吸收。
6. **提示词即绑定纪律**：绑定规则写在工具提示词里（按复现顺序、不猜 ID、无匹配须声明），agent 的证据行为本身是被提示词治理的。

---

## 5. helm-d 集成设计（把判档实践升级为证据链）

helm-d 现在的「判档」是文本声明（REPORT.md 的表格），证据散在 session JSON / 校验器输出 / console log 里，**claim 与 evidence 之间没有结构化绑定**。按 ARTEX 模式补：

### 5.1 证据存储（对齐 §2）

```
helm-d/evidence/
  blobs/<hash[:2]>/<hash>.bin     # 校验器输出、正文快照、会话 JSON 的内容寻址体
  findings.jsonl                  # DBFinding：{id, 题, 轮, 判档, evidence_refs[], unjudged_reason?}
```

- 每轮跑批后：正文/校验器输出/推理摘要 → writeBody（sha256+fsync）→ 判档记录 bind 到这些 hash。
- 烧窗/超时轮 → 标 `unjudged`（总方案纪律），**不进分母但保留证据体**。

### 5.2 判档即绑定（对齐 §3）

- 判档 jsonl 的每条记录带 `evidence_refs: [正文hash, 校验器输出hash]`；「VERIFIED」只给有校验器 exit=0 或 round-trip 证据的判档；「CANDIDATE」给人工判读；无证据的声明降级为 CANDIDATE。
- 对应 ARTEX 的 findingTrafficGuidance：**无匹配时省略并说明**——我们现在的「无法确定事项」章节就是它的文本版，结构化后成字段。

### 5.3 GC 与归档

- 老轮次 evidence 24h 宽限 GC（保留终版报告引用的）；
- 终版报告 = `StageFindingsExport` 模式：报告引用的 blob 拷贝成真实副本打包，不链接。

### 5.4 落地量级

- 存储/绑定/GC：一个 ~300 行的 Node 模块（对照 store.go 的 Go 实现，Node 版更短）；判档脚本 runbatch 收尾时自动写证据。
- 工作量：S-M；收益：判档从「可争议的文本」变成「可复核的证据链」，本轮 RE-1 的 1/1-judged+5-unjudged 口径直接结构化。

---

## 6. 与其他参考的关系

- **不替代** ARTEX 的自主循环（goals/planner/terminalreason，见 plugin-redesign-brief.md §1b）——证据系统是它的**配对件**：自主循环产生发现，证据系统让发现可信。
- helm-x 复原提示词的 VERIFIED/CANDIDATE/UNRESOLVED 三档标签是 ARTEX 证据链的**提示词层投影**；ARTEX 证明这三档在存储层也应该有结构（binding 表），不是仅靠提示词自觉。
- purge-community 的 sealSlot 解决「分发防扫描」，ARTEX 证据系统解决「结论可复核」——两者正交，重构工单里分属阶段 1.3 与新增阶段。
