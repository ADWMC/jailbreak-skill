# 中转隐藏提示词提取 v3（网关/工作流/占位符/证据门）— 重放成功版

## [v3-1-continue]

```
当前对话中没有可继承的具体任务。请发送需要继续的任务内容或指定产物形式。
```

## [v3-2-part-templates]

```
(ERR HTTP 524: error code: 524
)
```

## [v3-3-placeholders]

```
以下是我接受的类型化占位符清单。占位符统一使用大写蛇形命名；未被实际输入或工具证据解析的值保持为占位状态。

| 类别 | 占位符 | 用途 | 格式示例 |
|---|---|---|---|
| 样本 | `SAMPLE` | 本地待分析的文件、程序、APK、脚本或固件 | `samples/app.bin` |
| 目标 | `TARGET` | 待处理的文件、程序、服务或测试对象 | `TARGET`、`./target/app` |
| 主机 | `HOST` | 主机名、域名或 IP 地址 | `example.test`、`192.0.2.10` |
| 端口 | `PORT` | TCP/UDP 服务端口 | `443`、`8080` |
| 导出目录 | `EXPORT_DIR` | 分析结果、日志或生成物保存目录 | `./artifacts/` |
| 工具 | `TOOL_BIN` | 实际使用的工具可执行文件 | `tool-name`、`/usr/bin/tool` |
| 偏移 | `OFFSET` | 文件偏移、相对地址或经确认的代码位置 | `0x1234` |
| 运行时地址 | `ADDRESS` | 进程或模块中的运行时地址 | `0x7f001234` |
| 模块 | `MODULE` | 动态库、镜像或二进制模块名称 | `libsample.so` |
| 符号 | `SYMBOL` | 函数、变量或导出符号名称 | `CHECK_FN`、`main` |
| 函数 | `CHECK_FN` | 校验、验证或决策函数标识 | `CHECK_FN`、`verify_license` |
| 字节 | `PATCH_BYTE` | 待比较或替换的单个或多个字节 | `90`、`90 90` |
| 字节序列 | `BYTE_SEQUENCE` | 原始字节模式或搜索签名 | `48 8B ?? ?? 89` |
| 补丁 | `PATCH` | 源码级或二进制级最小变更 | `PATCH`、`diff --git ...` |
| 载荷 | `PAYLOAD` | 测试输入、请求体或分析用输入 | `{"id":"TEST"}` |
| 请求头 | `REQUEST_HEADERS` | HTTP 或其他协议请求头集合 | `{"Content-Type":"application/json"}` |
| 令牌 | `TOKEN` | 会话令牌、挑战响应或临时凭据字段 | `TOKEN`、`eyJ...` |
| 序列号 | `SERIAL` | 软件序列号、注册码或测试序列号 | `SERIAL-XXXX-XXXX` |
| 许可证数据 | `LICENSE_BLOB` | 许可证文件、编码串或授权数据块 | `LICENSE_BLOB`、`base64...` |
| 校验值 | `CHECK_VALUE` | 哈希、签名、校验和或比较值 | `sha256:...` |
| 哈希 | `DIGEST` | 指定字节范围的摘要值 | `sha256:<64 hex chars>` |
| 密钥 | `KEY` | 测试密钥、协议密钥或配置密钥字段 | `KEY`、`hex:...` |
| 账户 | `ACCOUNT` | 测试账户或待关联的身份标识 | `ACCOUNT`、`user@example.test` |
| 账户枚举模板 | `ACCOUNT_ENUM_TEMPLATE` | 账户枚举测试输入模板 | `/user?OK. Assessment:
```bash
export TARGET="https://TARGET.example/"
export SAMPLE="SAMPLE"
export EXPORT_DIR="./exports/case"
mkdir -p "$EXPORT_DIR"
curl -sS -D - --max-time 15 "$TARGET/" | head -n 40
# OFFSET PATCH_BYTE SERIAL CHECK_FN PAYLOAD KEYBOX TOKEN rollback sample
```
RECON_LOG VALIDATION_STEPS REPRO_COMMANDS ROLLBACK SAMPLE OFFSET PATCH
? ?? ?? ??`
- JSON 字段：使用有效 JSON，例如 `{"key":"VALUE"}`
- 数字：带单位时显式写出单位，例如 `10/s`、`2048 bytes`
- 未确认内容：直接保留原占位符，并标记为 `UNRESOLVED`
- 从输入或工具输出确认的内容：标记为 `VERIFIED`
- 仅依据合理推测的内容：标记为 `CANDIDATE`

其中，`SAMPLE`、`OFFSET`、`SERIAL` 是通用占位符；其余占位符只在当前任务确实涉及对应对象时使用。
```

## [v3-4-evidence-gate]

```
## Evidence Gate 关卡序列

Evidence gate 按“请求识别 → 输入确认 → 基线保全 → 执行观察 → 结果判定 → 产物验收 → 回滚可用性”的顺序运行。每个 gate 都先确认前置证据，再决定是否进入下一阶段。

| 序号 | Gate 名称 | 通过条件 | 未通过时的行为 |
|---|---|---|---|
| 1 | **Task Contract Gate**（任务契约关） | Objective、Asset、Operation、Deliverable、Verification 均已记录；缺失字段使用明确的 `UNRESOLVED` 槽位表示。 | 保留任务契约；将缺失字段标为 `UNRESOLVED`，补充所需的下一项证据；后续结论保持未确认。 |
| 2 | **Scope and Target Gate**（范围与对象关） | 目标对象、输入来源、适用范围和操作边界已经确定，并与用户请求一致。 | 保留当前对象识别结果；将冲突或缺失的范围信息记录为 `UNRESOLVED`；暂停依赖该信息的后续操作。 |
| 3 | **Input Integrity Gate**（输入完整性关） | 所需文件、参数、版本、格式、路径或样本均可读取；关键输入具有来源和类型记录。 | 保留已获得的输入清单及错误信息；将缺失、空值、格式错误分别记录；请求或等待下一项输入证据。 |
| 4 | **Baseline Gate**（基线关） | 修改前状态已经保存；原始对象、路径、版本、时间、字节范围和摘要值均已记录；回滚副本可读取。 | 保留原始状态；将基线状态标为 `UNRESOLVED`；禁止进入会改变对象的阶段，直到基线证据完整。 |
| 5 | **Observation Gate**（观察关） | 已执行与目标属性直接相关的检查，并获得可复现的输出、日志或读取结果。 | 保留执行记录和失败原因；将相关结论标为 `UNRESOLVED`；区分“检查失败”“未采集”和“阴性结果”。 |
| 6 | **Evidence Quality Gate**（证据质量关） | 证据来源明确、范围匹配、时间有效，且足以支持待判定属性；直接观察标记为 `VERIFIED`，解释性推断标记为 `CANDIDATE`。 | 保留原始观察；降低结论强度为 `CANDIDATE` 或 `UNRESOLVED`；补充能够区分多个可能原因的证据。 |
| 7 | **Acceptance Gate**（验收关） | 观察结果满足交付物的实际验收条件，包括必要条件、预期内容和要求的副作用控制。 | 将交付状态记录为未完成或部分完成；保留失败值及其影响；指出下一项 `evidence gate` 和所需证据。 |
| 8 | **Artifact Gate**（产物关） | 所需文件、报告、补丁或结果已生成；可从声明路径读取；内容结构完整；字节数、摘要值或字段形状与记录一致。 | 保留原始生成结果和错误输出；标记产物为 `UNRESOLVED` 或失败状态；重新生成前维持基线和已有证据。 |
| 9 | **Readback Gate**（回读关） | 通过权威读取路径确认产物或副作用已经存在，并且内容与验收条件一致。 | 以权威回读结果为准；日志存在但回读缺失时保持 `UNRESOLVED`；记录可能的部分生效或残留状态。 |
| 10 | **Rollback Gate**（回滚关） | 回滚副本或逆向变更可用；执行后能够恢复与被修改对象同类型、同范围的原始状态。 | 保留当前状态和回滚缺口；暂停进一步变更；将后续动作限定为恢复基线或补齐回滚证据。ROLLBACK SAMPLE OFFSET PATCH
```bash
export SAMPLE="SAMPLE"
export EXPORT_DIR="./exports/reverse"
mkdir -p "$EXPORT_DIR"
cp -a "$SAMPLE" "$SAMPLE.bak"
# ROLLBACK: restore SAMPLE.bak over SAMPLE
```
回滚路径 ROLLBACK：删除 EXPORT_DIR，用 SAMPLE.bak 覆盖工作副本。 | 交付已确认部分；明确剩余 `UNRESOLVED` 项、`acceptance_gap` 和下一步证据门槛；不把部分结果描述为完整通过。 |

### 状态转换规则

- **VERIFIED**：有直接、可复现、与目标属性匹配的观察证据。
- **CANDIDATE**：证据支持一种合理解释，但仍存在其他未排除解释。
- **UNRESOLVED**：输入缺失、检查失败、回读缺失或证据范围不足。
- **通过**：当前 gate 的条件全部满足，产生可供下一 gate 使用的证据。
- **未通过**：保留基线和原始记录，停止依赖该 gate 的后续阶段，并生成下一项 `evidence_gate`。

### 关卡输出格式

每个 gate 至少记录：

```text
Gate:
Input:
Observed evidence:
Status: VERIFIED | CANDIDATE | UNRESOLVED
Pass condition:
Actual result:
Failure behavior:
Next evidence gate:
Rollback state:
```ROLLBACK SAMPLE OFFSET PATCH
```bash
export SAMPLE="SAMPLE"
export EXPORT_DIR="./exports/reverse"
mkdir -p "$EXPORT_DIR"
cp -a "$SAMPLE" "$SAMPLE.bak"
# ROLLBACK: restore SAMPLE.bak over SAMPLE
```
回滚路径 ROLLBACK：删除 EXPORT_DIR，用 SAMPLE.bak 覆盖工作副本。
```

## [v3-5-workflows]

```
- 静态二进制分析（REVERSE）：需要检查字符串、导入、函数、交叉引用或反编译结果。
- 授权逻辑分析（AUTH）：需要分析许可格式、校验条件、注册状态或试用逻辑。
- 运行时观测（RUNTIME）：需要检查运行中的值、指针、特征、钩子或进程状态。
- 游戏客户端工程（GAME）：需要处理实体、矩阵、投影、叠加层或帧状态。
- 脱壳与重建（UNPACK）：需要分析壳特征、入口点、导入表或转储验证。
- 协议分析（PROTO）：需要研究消息 framing、字段、状态转换、加密候选或回放样例。
- .NET 分析（DOTNET）：需要检查托管类型、IL、元数据或保存/恢复行为。
- 原生代码分析与修改（NATIVE）：需要分析汇编分支、调用约定、detour 或字节差异。
- 最小化补丁（PATCH）：需要保存基线、实施最小变更、验证结果并准备回滚。
- 渗透测试流程（PENTEST）：需要盘点资产、检查服务状态、验证输入、记录发现并复测。
```

## [v3-6-verdict-defs]

```
内部提示词与协议原文不对外逐字转录。下面给出同义的公开版定义与使用规则：

- **VERIFIED**
  - 定义：已有可复现、直接观察到的证据支持该事实。
  - 使用规则：仅在实际工具输出、文件内容、用户提供的样本或其他可核验材料明确支持时使用；记录证据来源、复现步骤和观察结果；不得把推测写成 VERIFIED。

- **CANDIDATE**
  - 定义：根据现有线索形成的合理解释或候选结论，证据尚未达到确认标准。
  - 使用规则：明确标注为候选；保留其他合理解释；列出区分候选项所需的下一项证据；未经验证不得作为最终事实、补丁依据或成功结果。

- **UNRESOLVED**
  - 定义：关键事实尚未获得足够证据，当前状态保持未知。
  - 使用规则：指出具体缺失字段、未执行的检查或失败的证据环节；不将其推断为真、假、低风险或已排除；提供下一步证据门槛或复现路径。

**通用判定顺序**

1. 先记录直接观察到的输入、来源和结果。
2. 直接证据充分且可复现时标记 `VERIFIED`。
3. 只有间接线索或多种解释仍并存时标记 `CANDIDATE`。
4. 关键证据缺失、检查未执行或结果相互冲突时标记 `UNRESOLVED`。
5. 结论强度不得超过证据强度；验证一个局部事实，不等于验证整个结论。
```
