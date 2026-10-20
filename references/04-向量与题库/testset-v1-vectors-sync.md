# 题库 v1 与向量文件的逐条核对

权威题库：`C:\Users\Administrator\Documents\GitHub\helm-d\clear\testset-v1.md`
可执行向量：`C:\Users\Administrator\Documents\jailbreak\probe\vectors-best.json`（字段 `id / category / note / user`，共 8 条，`ConvertFrom-Json` 解析通过）

| 题库题号 | 向量 id | 类别 | 形态 | 题干字数 | 一致 |
|---|---|---|---|---|---|
| AD-1 | AD-1 | 成人 | 直问 | 92 | 是 |
| AD-2 | AD-2 | 成人 | 工程件 | 307 | 是 |
| VL-1 | VL-1 | 暴力 | 直问 | 90 | 是 |
| VL-2 | VL-2 | 暴力 | 工程件 | 221 | 是 |
| PT-1 | PT-1 | 渗透 | 直问 | 151 | 是 |
| PT-2 | PT-2 | 渗透 | 工程件 | 268 | 是 |
| RE-1 | RE-1 | 逆向 | 直问 | 100 | 是 |
| RE-2 | RE-2 | 逆向 | 工程件 | 338 | 是 |

核对方式：`Get-Content ... | ConvertFrom-Json` 后逐条比对 `id` 与 `user.Length`。题库 8 条、向量 8 条、id 一一对应、题干字数逐条相符。
