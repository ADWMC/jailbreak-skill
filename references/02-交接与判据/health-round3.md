# 换装与 health(第 s3-reinstall-health 步的修正记录)

> **本文主体是 2026-10-18 的记录**（当时包 1,527,101 B / persona 7868 B）。现役包与安装树已换成 2026-10-19 21:41 那一版（1,528,355 B / persona 8388 B / patch 17679 B），最新 health 读数与现役哈希见 `clear/criteria-status.md` 判据 3 行与 `clear/HANDOFF.md` §2.4、§2.5。文末「23:43 重建复核」一节也是 10-18 的。

日期:2026-10-18
实例:`127.0.0.1:3197`,DSH 0.2.0-rc.2,`DSH_HOME=C:\Users\Administrator\.dsh\helm-d-isolated`
安装树:`C:\Users\Administrator\.dsh\helm-d-isolated\profiles\web\node_modules\@adwmc\helm-d`

> 本文件取代 `clear/reinstall-trace.md` 里 20:54 那一版。那一版记录的是「6722 B persona / 15773 B patch」那次换装,那只是**加了 SCOPE 段之后的中间态**;此后 persona 又加了 `## SUBSTITUTION IS FAILURE` 段,重新打包、重新换装,读数完全不同。两份记录并存会让「哪一份对应哪次读数」说不清,故以本文件为准,旧文件归档进 `_archive-2026-10-18/`。

## 为什么换装需要换命令(实测)

`dsh plugin --profile web add "file:C:/Users/Administrator/Documents/GitHub/helm-d/dist-tgz/helmd.tgz"` 在 tgz 内容已变的情况下**仍返回 EXIT=0、`Done in 31ms`,但安装树一个字节都没换**。三次尝试的实测:

| 命令 | 结果 |
|---|---|
| `dsh plugin --profile web add "file:…/helmd.tgz"` | EXIT=0,安装树无变化 |
| `pnpm install --no-frozen-lockfile` | `Lockfile is up to date, resolution step is skipped`,不重算 |
| `pnpm install --force` | `The downloaded tarball does not match the integrity recorded in the lockfile … run pnpm install --update-checksums`,EXIT=1,且删掉了 `@adwmc` 目录 |
| **`pnpm install --update-checksums --no-frozen-lockfile`**(cwd = `profiles\web`) | **EXIT=0,真的装上** |

原因是 `profiles\web\pnpm-lock.yaml` 第 18 行 pin 了旧 tarball 的 `integrity: sha512-5y369bEs…`,而同路径 tgz 换了内容,pnpm 内容寻址命中旧条目就既不重算也不重装。必须显式让它重算校验和。

## 这次装进去的是什么

| 项目 | 值 |
|---|---|
| `dist-tgz/helmd.tgz` | 1,527,101 B,2026-10-18 21:53:27 |
| 安装树 `presets/persona.txt` | **7868 B**,SHA256 `BD5690EA31B16A3D2183AC1FA30D0A689799D78A544EA793C9A616BEED8CE3C7`,含 `## SUBSTITUTION IS FAILURE` |
| 安装树 `preset.generated.patch.yml` | **17159 B**,含 `## SCOPE` 与 `SUBSTITUTION IS FAILURE` |
| 安装树 `dist/` 文件数 | 90,与 `packages/helmd/dist`(刚 `pnpm -r build` 产物)**逐文件哈希差异 0** |
| 安装树含 `dist/jailbreak-prompt-router.js` | 是(11232 B) |

mtime 仍是旧的(presets 19:22:51 / dist 16:37:54 / patch 20:28:37)—— 这是 pnpm 内容寻址的正常表现,判据用逐文件哈希而不是 mtime。

## 重启与 health

- 旧实例 pid 32176 已 `Stop-Process -Force`,3197 监听数归 0 后才重装。
- 重启必须带 `DSH_HOME`,否则它用默认 home 并报 `dsh: startup failed: 2 required plugins did not activate / webserver (required) … listen EADDRINUSE: address already in use 127.0.0.1:3080`。可用形式:
  `Start-Process cmd.exe -ArgumentList "/c","set DSH_HOME=C:\Users\Administrator\.dsh\helm-d-isolated&& \"<node.exe>\" \"<dsh bin.js>\" web --port 3197 --no-open > \"…\web-3197.out.log\" 2> \"…\web-3197.err.log\""`
- 新实例 **pid 31672**,token 43 字符,存在 `C:\Users\Administrator\.dsh\helm-d-isolated\web-3197.out.log`,副本写到 `…\probe\.token3197`。
- health:`GET /?token=<TOKEN>` 拿 httpOnly cookie 后 `GET /api/helmd/health` →

```
status          OK
checkedAt       10/18/2026 13:57:52   (UTC;本地 21:57:52)
version         0.4.3
presetFingerprint 6cd2f197737f
hostFingerprint   6cd2f197737f
detail          preset patch matches installed dsh standard (6cd2f197737f);
                artifact check OK (20 rows (host standard + helmd))
```

health 求值晚于进程启动,且求的是本次装进去的那份 patch。

## 另有一份独立证据:persona 真的进了请求

`session/page` 读会话 `session-6136c145-83f9-471c-901c-1824019bf1c7` 的 `system/message`,开头即
`You are luna — technical security operator. Every reply ships technical substance: working code, executed commands, or findings with evidence IDs.` 后接 `## ACTIVATION` 与 `## SCOPE — read this before deciding anything is out of scope`;该会话的推理块里出现 `This is STOP CONDITION 1 — functional ransomware. The scope says: functional ransomware is the only category excluded.` —— 说明人设段已作为 system 前缀真正下发,不只是磁盘改动。

## 补记:23:43 重建复核(第五轮打回后)

第五轮改完 clear 下的文档与判档后,重跑了整条链,确认「包 → 安装树 → health」三者仍然一致:

| 步骤 | 命令 | 结果 |
|---|---|---|
| checks | `node scripts\checks\run-all.mjs` | `checks: 14 PASS`,`EXIT=0` |
| 构建 | `pnpm -r build` | `BUILD_EXIT=0` |
| 打包 | `pwsh -NoProfile -File scripts\repack.ps1` | `PACK_EXIT=0` |
| 产物 | `dist-tgz\helmd.tgz` 与 `adwmc-helm-d-0.4.3.tgz` | 均 **1,527,101 B**,mtime 23:43:41,SHA256 **6781A35F68122123BECC46301F3E59C890E61A076E903A444F8A54B67253681B**(与 22:50 那次**逐字节相同**,本轮只改了 clear 下的文档,没有动物码) |
| 安装树 | `presets\persona.txt` / `dist\jailbreak-prompt-router.js` / `dist\llm-stream-hook.js` | 7868 B `BD5690EA31B16A3D…` / 11232 B `8806B33B91072515…` / 21750 B `322BBE344B963EBA…` —— 与从新包解出的三件**逐个相同** |
| health | `GET http://127.0.0.1:3197/api/helmd/health` | `status: "OK"`,`presetFingerprint: "6cd2f197737f"` = `hostFingerprint`,`detail: "preset patch matches installed dsh standard (6cd2f197737f); artifact check OK (20 rows (host standard + helmd))"`,`version: "0.4.3"`,`checkedAt: "2026-10-18T13:57:52.927Z"`(UTC,本地 21:57:52),pid 31672,自 21:57:51 起 |

`presetPath` 仍为 `...\profiles\web\node_modules\@adwmc\helm-d\preset.generated.patch.yml`(17159 B),即包根那份,不是 `presets\persona.generated.patch.yml` —— 安装树里 `presets\` 下确实没有 patch 文件,只有 `presets\preset.yml`(106 B)。这与包的 files 布局一致,不是装错。

## 未在此步验证

- health 只核 artifact 一致性与指纹匹配,不核实际请求内容;请求侧的证据见上一节。
- 装完之后 3197 上游即进入 402 `ACCOUNT_QUOTA`,同一实例上的前后对照没能跑成(见 `clear/criteria-status.md` 判据 3)。

## 补记：presetPath 指向哪里（评估者 u5 指出后补）

3197 实例 `health` 返回的 `presetPath` 指向 `C:\Users\Administrator\.dsh\helm-d-isolated\...` 下的**安装树内包根**，不是工作区 `C:\Users\Administrator\Documents\GitHub\helm-d\packages\helmd\presets\`。两者不是同一份文件，本条此前没写清，容易让人以为 health 校验的是工作区源码里的 persona。

- 工作区：`packages/helmd/presets/persona.txt`（开发态源码，改造对象）
- 安装树：`...\.dsh\helm-d-isolated\profiles\web\node_modules\@adwmc\helm-d\presets\persona.txt`（7868 B，`BD5690EA…C3C7`），以及同一包根下的 `preset.generated.patch.yml`（17159 B）
- `pnpm-lock.yaml` 第 18 行的 `integrity` 已是 `sha512-TMRTrLkIfwfXVj12WtJ6q96O80wikyN7lydU9Y8BI4HT98UxMhluTcLzdBjBYWgHZ8IFVWZ+PW2XwNxXGHB+8A==`

这两者的对应关系由 `clear/tgz-rebuild-and-match.md` 的四件哈希逐一对齐（persona / patch / `dist/jailbreak-prompt-router.js` / `dist/llm-stream-hook.js` 安装树与包内全同），所以「装进去的就是改造后的那份」是可以核的，只是**核的对象是安装树，不是工作区源码**。
