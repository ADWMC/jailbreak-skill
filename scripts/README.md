# scripts/ —— 本地跑批与核对脚本

**这些脚本不能克隆下来直接用。** 它们是作者本地批量跑测的工具，带着本机环境和未随仓库分发的输入文件。

## 状态

| 脚本 | 依赖 | 能直接用吗 |
|---|---|---|
| `runbatch.mjs` | 本地 HTTP 服务（`127.0.0.1:3197`）、`DSH_TOKEN`、本机 session 缓存目录、`--vectors` 输入 JSON | ❌ 需改造 |
| `check-consistency.mjs` | `verdict-master.md`（未随仓库分发） | ❌ 缺输入 |
| `check-types.mjs` | `verdict-master.md`（未随仓库分发） | ❌ 缺输入 |

## 为什么留着

这两类脚本体现了这个项目的核对方法，即使跑不起来也有参考价值：

- **`runbatch.mjs`** —— 展示了怎么「每条新会话、固定窗口、失败重试」地跑一整套题库。如果你要自己做基准测试，这个骨架可以抄。
- **`check-consistency` / `check-types`** —— 展示了怎么用脚本核对「主表」与「派生表」是否逐格对上。这类一致性检查是防止判定表悄悄漂移的关键，比人工扫表可靠。

## 要用的话，需要自己做的

### 1. 改掉硬编码的本地路径

`runbatch.mjs` 里有本机的端口，用前改成你自己的：

```js
const HOST = 'http://127.0.0.1:3197'   // ← 改成你的服务地址
```

会话缓存目录和任务 cwd 已经改成读环境变量 / 当前目录，不再有硬编码：

```bash
export PROJ_DIR=/path/to/your/sessions   # 会话缓存目录，默认 ./sessions
node runbatch.mjs --vectors v.json --out ./results --cwd /path/to/sandbox
```

### 2. 提供 `verdict-master.md`

两个 `check-*.mjs` 都读仓库根目录下的 `verdict-master.md`。这个文件是作者的判定主表，没有随仓库分发——**你需要按同样格式自己建一份**。

格式是一张 Markdown 表，每行一个向量：

```
| id | 类型 | 短名 | ... | plain 判档 | ... | persona 判档 | ... |
| B01 | 施压 | ... | ... | 真通过 | ... | 改题交付 | ... |
```

判档取值来自 `methodology/04-verdict-criteria.md` 的冻结标准。

### 3. 准备 `--vectors` 输入

```bash
node runbatch.mjs --vectors my-vectors.json --out ./results [--only B04,B05] [--retry 3]
```

输入 JSON 是一个数组，每项至少带 `id` 和题目正文。具体字段看 `runbatch.mjs` 后续的读取逻辑。

## 一句提醒

**别把这几份脚本当成「项目已验证」的证明。** 它们是工具，不是证据。这个项目的证据等级划分见根目录的 `EVIDENCE.md`。
