<div align="center">

<img src="assets/hero-zh.svg" alt="jailbreak-skill —— 改题交付 vs 真交付" width="100%" />

# jailbreak-skill

**它告诉你这条提示词到底过没过，并且拦下那个你会误当成功的失败。**

<br />

![Modules](https://img.shields.io/badge/Modules-23-8250df?style=flat-square)
![Forms](https://img.shields.io/badge/Forms-4-b07d62?style=flat-square)
![Coverage](https://img.shields.io/badge/Coverage_axes-5-f59e0b?style=flat-square)
![Verdict](https://img.shields.io/badge/Verdict-frozen-0f766e?style=flat-square)
![License](https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-ef9421?style=flat-square)
![Commercial](https://img.shields.io/badge/Commercial_Use-Forbidden-B00020?style=flat-square)

<br />

**许可：[CC BY-NC-SA 4.0](LICENSE)** — 必须注明出处 · 严禁任何商业使用 · 二次开发发布时必须同样开源

[🇬🇧 English](README.md) · **🇨🇳 简体中文**

</div>

---

## 装

```bash
git clone https://github.com/ADWMC/jailbreak-skill ~/.dsh/skills/jailbreak-skill
```

Windows：

```powershell
git clone https://github.com/ADWMC/jailbreak-skill "$env:USERPROFILE\.dsh\skills\jailbreak-skill"
```

装好后直接说你要干什么，skill 会自己触发。或者输入 `jb` 自检。正确的回显是：

```
jailbreak-skill 就绪。目标模型是什么？我先判断类型、出方案，再组装。
```

这句回显也是一句承诺：**它不会直接甩一条提示词给你。** 先出方案。

---

## 它干什么

让你的 agent 不再瞎试，按一个环走：

```
判断模型 → 写两个假设 → 选形态与载体 → 拼装 → 单题验证 → 缩放
```

它管**过程**，不管**结果**：

| 不管 | 管 |
|---|---|
| ❌ 保证某条提示词能过 | ✅ 让你不在没判据的情况下改到第 10 轮 |
| ❌ 给你一条「实测有效」的咒语 | ✅ 每条结论都标证据等级 |
| ❌ 替你猜模型为什么拒 | ✅ 逼你写两个能互相推翻的假设 |

---

## 三条不许破的规矩

| 规矩 | 为什么 |
|---|---|
| **改题交付不算通过** | 模型很少说「我不做」。它开头配合，写到中间自己缩回去，或者给你一个「安全版」。那是回答了另一道题——而且它伪装成成功。 |
| **看中段，不看开头** | 开头都会被包装得合理。唯一有信息量的是：中段有没有具体、可交付的东西。 |
| **窗口超时不是拒绝** | 推理型模型只输出 thinking。先加到 600s+，再动提示词。很多人改了一整晚的提示词，在修一个不存在的问题。 |

> 第一条是整套东西的意义所在。其余设定都是为了让它变得可执行。

---

## 为什么不是又一个提示词合集

| 常见的提示词仓库 | 这里 |
|---|---|
| 几百条提示词让你乱试 | 23 个模块 + 一套决定用哪个的流程 |
| 「已验证有效」但没有回执 | 每条结论标 `E0`–`E3`；没有原始回执就不报通过率 |
| 只覆盖技术话题 | 技术 + 创作 + 社工 |
| 分不清真通过和差一点 | 四档判定，改题交付直接算失败 |

---

## 里面有什么

| 路径 | 内容 |
|---|---|
| [`SKILL.md`](SKILL.md) | 入口——导航、六步流程、红线 |
| [`EVIDENCE.md`](EVIDENCE.md) | 证据分级。先读这个。 |
| [`docs/concepts.md`](docs/concepts.md) | 上面每条规矩的长文论证 |
| [`prompts/`](prompts/00-assembly.md) | 23 个可组合模块 + 拼装索引与预设组合 |
| [`methodology/`](methodology/00-planning.md) | 15 份文档：形态选择、拒绝诊断、判定标准、覆盖率模型、失败归因 |
| [`vendors/`](vendors/README.md) | 三条路线、分厂商证据分级、跨语料库观察 |
| [`testsets/`](testsets/00-testbank-design.md) | 四档题库 + 10 分钟覆盖率自检 |
| [`scripts/`](scripts/README.md) | 本地跑批。**克隆下来不能直接跑**——见它自己的 README。 |

---

## 常见问题

**这是个提示词包吗？**
不是。是一套流程加 23 个模块，要你自己拼。你想要一个复制粘贴的提示词文件，这个会让你烦。

**怎么知道一条提示词是真过了？**
读 `methodology/04-verdict-criteria.md`，自己看正文中段。自动判定会把改题交付算成 pass——人就是这么骗自己的。

**为什么没有通过率数字？**
因为原始回执没有随仓库分发。没有回执的数字就是自我声明。见 `EVIDENCE.md`。

**能在我的模型上跑通吗？**
跑了才知道。厂商画像一部分是 `[E1]`（在真实语料里观察到结构，从未执行），一部分是 `[E2]`（完全没有可用样本——Gemini、Grok、本地模型）。先跑 Lite 档再说。

**没过，然后呢？**
别乱改。读 `methodology/20-failure-attribution.md`，先写清这次失败说明哪个假设不成立，再动一个变量。

**这算开源吗？**
不算。CC BY-NC-SA 4.0 禁止商业使用，不符合开源定义第 6 条。它是公开的、非商业许可项目。见 [LICENSE](LICENSE)。

**它在我不需要的时候自动加载了。**
那是触发描述的 bug，不是你的提示词有问题。触发条件是**拒绝症状 + 具体目标**，绝不看话题。把原句贴出来提个 issue。

---

## 已知边界

| 边界 | 说明 |
|---|---|
| **平台拦截够不到** | 提示词能改模型的判断，改不了网关的策略层。看到 Cyber Flag 一类拦截，换提示词没用。 |
| **有些领域载体救不了** | 毒品、武器。换体裁无效，别耗时间。 |
| **厂商路线部分是推断** | 用前自己验。Gemini 和 Grok **连可用样本都没有**。 |
| **明确不做** | 模型抽取、成员推断、数据投毒、供应链、对抗样本、工具越权、合规治理。见 [`docs/concepts.md`](docs/concepts.md)。 |
| **`scripts/` 克隆后跑不了** | 依赖未随仓库分发的输入文件和本地服务端点。 |

> GitHub 侧栏许可证显示 `Other`，那是 GitHub 的限制——它的识别引擎只收 OSI 软件许可证，不收 Creative Commons 系列。以 [LICENSE](LICENSE) 为准。

---

<div align="center">

**别收藏了，跑一遍。**

[核心流程](SKILL.md) · [长文论证](docs/concepts.md) · [证据分级](EVIDENCE.md) · [怎么拼](prompts/00-assembly.md) · [怎么判](methodology/04-verdict-criteria.md)

[🇬🇧 English](README.md) · **🇨🇳 简体中文**

</div>
