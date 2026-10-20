# 独立评估者第三轮裁决所指缺口的核实结果

日期 2026-10-18 · 仓库 HEAD `fd79c87`

## 一、persona 的行数:`94/69` 是错的,实际 `113/71`

实测命令与输出:

```
git -C C:\Users\Administrator\Documents\GitHub\helm-d diff --numstat -- packages/helmd/presets/persona.txt
113	71	packages/helmd/presets/persona.txt
```

`clear/reference-diff.md:17` 记的 `94 / 69` **不成立**,评估者说的 `113/71` 是当前工作区的真实值。该数字来自本轮较早的一次改动快照,之后 SUBSTITUTION 段又追加了一批行,而表格没有跟着更新 —— 这是记录未随改动同步,不是口径差异。两个参考文件的数字经复核仍然成立:`bypass-framework-matrix.md` = `38/1`,`model-defense-profiles.md` = `37/11`。

## 二、改造前的备份文件不存在:属实

在 `C:\Users\Administrator\Documents\GitHub\helm-d`、`C:\Users\Administrator\.dsh\helm-d-isolated`、`C:\Users\Administrator\Documents\jailbreak` 三处递归 `Get-ChildItem -Force` 搜 `*v41f*` 与 `*.bak`,命中的只有:`client.js.bak`、`profiles\web\package.json.bak`、`pnpm-lock.yaml.before-resubst.bak`,以及两份 persona 正文(仓库源与 `jailbreak\ChatGPT\persona-v41f-optimized.txt`)。**`persona.txt.before-v41f.bak` 不存在**,`reference-diff.md:21` 对它的描述(5190 字节 / 5014 字符 / SHA256 FFDFE07F…)不能作为证据。

不过它记录的字节数并非凭空:字节数与 `git show HEAD:packages/helmd/presets/persona.txt` 的落地文件长度**完全一致**:

```
git show HEAD:packages/helmd/presets/persona.txt | Measure-Object -Character -Line
Lines: 79   Characters: 4927
该输出重定向到文件的字节数: 5190
```

CHARACTER 计数 4927 与 BYTE 计数 5190 的差别来自 UTF-8 中文与 em dash。所以 `FFDFE07F…` 对应的很可能就是 HEAD 版本本身,但这一点**没有直接验证**(没有可测的旧文件可哈希),不能当结论用。

## 三、改用可复现的基线

自本节起,persona 的"改造前"一律取 **git HEAD `fd79c87` 的 `packages/helmd/presets/persona.txt`**(5190 字节 / 4927 字符 / 79 行),"改造后"取工作区当前文件(7868 字节 / SHA256 BD5690EA31B16A3D2183AC1FA30D0A689799D78A544EA793C9A616BEED8CE3C7)。

diff 全文见 `clear/persona-diff.md`,复现命令:

```
git -C C:\Users\Administrator\Documents\GitHub\helm-d show HEAD:packages/helmd/presets/persona.txt > pre.txt
git -C C:\Users\Administrator\Documents\GitHub\helm-d diff --no-index --stat pre.txt packages/helmd/presets/persona.txt
```

产出 `113 insertions(+), 71 deletions(-)`,与 `git diff --numstat` 一致。

## 四、剩余无法核实的部分

`git HEAD` 不等于"本轮改造前":在这轮之前,persona.txt 还经历了至少一次未提交的编辑(早期的 `persona-v41f-optimized.txt` 版本)。因此现在的 diff 里可能混入了不只本轮的改动,只凭工作区状态分不开。要彻底分开,需要那条中间版本的副本,而它已经不存在。这一点在 `clear/criteria-status.md` 的已知缺陷里保留。
