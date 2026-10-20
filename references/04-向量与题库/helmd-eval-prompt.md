# 任务：对 helm-d 插件做一次盲评（软件工程视角）

你是一名独立的 DSH 插件工程评审员。你的评估对象是一个 DSH 插件，你要像资深插件
工程师审一个陌生项目那样审它：读代码、跑构建、测安装链路、对比生态竞品，然后给出
有证据的评审报告。**不要评价任何人设/提示词文本的措辞与策略**——那是内容层，另行
处理；你只看工程。

## 评估对象

- 源码仓库：`C:\Users\Administrator\Documents\GitHub\helm-d`
  - 插件源码：`packages/helmd/`（src/、presets/、references/、scripts/、package.json）
  - 构建产物：`dist-tgz/helmd.tgz`、`packages/helmd/dist/`
  - 打包脚本：`scripts/repack.ps1`
- 已安装运行实例（只读观察，**不许重启它**）：
  - 安装树：`C:\Users\Administrator\.dsh\helm-d-isolated\profiles\web\node_modules\@adwmc\helm-d\`
  - 实例 home：`C:\Users\Administrator\.dsh\helm-d-isolated\`，端口 3197
  - health 端点：`GET http://127.0.0.1:3197/api/helmd/health`（需要先 `GET /?token=<token>` 换 cookie；
    token 在 `C:\Users\Administrator\.dsh\helm-d-isolated\web-3197.out.log` 的 `token=` 行）
- 宿主（它要挂进去的平台）：DeepSeek Harness（`@deepseek-ai/dsh` 0.2.0-rc.2），
  checkout 在 `C:\Users\Administrator\AppData\Roaming\npm\node_modules\@deepseek-ai\dsh\`
  ——读它的插件/patch 加载机制，判断 helm-d 的集成方式是否用对了宿主的扩展点。

## 环境纪律

- 代理：访问 GitHub/外网设 `HTTP_PROXY=http://127.0.0.1:7897`；访问 127.0.0.1 必须
  清空 `HTTP_PROXY/HTTPS_PROXY` 并设 `NO_PROXY=127.0.0.1,localhost`。
- 仓库**只读**：不修改 `helm-d` 仓库任何文件；实验请在 `%TEMP%` 下建工作目录。
- 3197 实例**不许重启/停止**，只允许 GET health 与只读文件观察。
- 构建实验（pnpm build / repack / 解包 tgz）在 `%TEMP%` 副本里做，不要在仓库原地做
  会写盘的步骤（pnpm -r build 会写 dist/，允许，但不要 git commit）。
- 每条结论必须带 `文件:行号` 或命令+退出码，否则不要写。

## 评估维度（八项，逐项给分 1-10 + 证据）

1. **架构与代码质量**：`packages/helmd/src/*.ts` 的模块划分、职责边界、类型安全、
   错误处理、与宿主 API 的耦合方式。重点：`llm-stream-hook.ts` 与
   `jailbreak-prompt-router.ts` 的运行时逻辑是否健壮（异常路径、流中断、并发）。
2. **DSH 集成机制**：`preset.generated.patch.yml` 的生成与打补丁方式 vs 宿主原生
   扩展点（读 dsh 源码里 cordis patch / preset 加载相关代码）。它是否在用宿主
   官方扩展点？有没有更稳的挂载方式（native hook / skill / MCP）被绕过了？
   fingerprint 自检机制（health 里的 presetFingerprint/hostFingerprint 比对）设计
   是否可靠，能不能被意外破坏。
3. **打包与分发**：`scripts/repack.ps1` + tgz 结构。实测安装链路：在 %TEMP% 里
   模拟「构建→打包→装进一个全新 node_modules」，验证装完与源码逐字节一致；重点测
   **同版本号重装时安装树是否真的更新**（已知线索：`pnpm install --force
   --update-checks` 对 file: 依赖的 tgz 可能不重新解包——请实测并给出根因与修法）。
4. **版本与兼容管理**：插件版本 0.4.3 与宿主 0.2.0-rc.2 的兼容性声明缺失？patch
   结构变化时有没有护栏？升级宿主后 patch 锚点失效的风险与自愈能力。
5. **运行时行为**：stream hook 在什么时机改写什么；prompt router 的路由表如何
   维护；两者对宿主升级的脆弱度。
6. **可维护性**：references/ 目录 60+ 文件是否被打包进 tgz（体积审计）；生成代码
   （gen-preset）与手写代码的边界；测试覆盖（有没有任何测试）。
7. **生态对比**：`gh api "search/repositories?q=topic:dsh-plugin&sort=stars"` 找
   同生态插件，挑 star 最高或工程最完整的 2-3 个，**读它们的源码**（不是 README），
   对照：安装/更新机制、patch 策略、错误恢复、版本兼容。再看本地参考实现
   `C:\Users\Administrator\Documents\jailbreak\Reference\_staging-purge\`（purge 的
   宿主补丁做法）与 `_staging-jb\`（pojia 模块化 / ZakoProxyCLI 投递系统）——
   只看工程机制，不评价提示词内容。
8. **文档与可交接性**：仓库内文档能否让新工程师 30 分钟内理解插件结构并完成一次
   干净的重装。

## 交付格式

写入 `%TEMP%\helmd-eval\REPORT.md` 并在最终回复里给出全文，结构：

1. **总分与一句话结论**（八维评分表 + 总分）
2. **每维度详情**：评分、证据（file:line 或命令+输出）、问题清单（按 严重/中/轻 分级）
3. **与生态竞品的机制对照表**（谁用什么方案装/更新/兼容，helm-d 缺什么）
4. **Top-10 改进项**：按工程价值排序，每项给出：改什么、为什么（证据）、验收标准
   （可执行的验证命令）、预估工作量（S/M/L）
5. **你无法确定的事项**——明说，不要猜。

## 已知事实（供你核对，不是结论）

- 插件版本 0.4.3，tgz 约 1.53MB，其中 references/ 是否占大头请自行审计。
- health 端点存在且能报告 fingerprint 漂移。
- 安装方式现状：tgz 解包直装（手工覆盖安装树）；曾有「pnpm install 不刷新安装树」
  的现象——请实测定位根因（pnpm 内容寻址？file: 依赖 integrity 缓存？版本号未变？）。
