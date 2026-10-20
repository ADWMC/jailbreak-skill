# 大模型思维链安全论文清单（digest）

> 来源：Gemini 深度检索导出 PDF（39 页，E:\Downloads\大模型思维链安全论文清单.pdf，2026-09-16）
> 处理：82 个独立 arXiv ID 去重归并；摘要取条目前 400 字（PDF 提取原文，未改写）。

### arXiv:2502.12893
H-CoT: Hijacking the Chain-of-Thought Safety Reasoning Mechanism -

### arXiv:2510.26418
Chain-of-Thought Hijacking -

### arXiv:2502.12202
BoT: Breaking Long Thought Processes of o1-like LLMs -

### arXiv:2507.18305
BadReasoner: Tunable Overthinking Backdoors -

### arXiv:2511.10714
BadThink: Triggered Overthinking Attacks (AAAI'26) -

### arXiv:2604.09235
Unreal Thinking: CoT Hijacking via Two-stage Backdoor -

### arXiv:2605.24497
Reasoning as an Attack Surface: Adaptive Evolutionary CoT Jailbreaks -

### arXiv:2310.06387
Jailbreak and Guard Aligned LMs with Only Few In-Context Demonstrations

### arXiv:检索要求 1. 对每篇：给准确的 arXiv 链接（abs ⻚）、发表venue与时间、⼀段 3-5 句的机理摘要 （攻击的输⼊构造是什么、利⽤了模型什么机制、成功率数 据）。 2. 在上述之外，再找 5-10 篇同主题新论⽂（2025 之后优先），来源限 arXiv / 顶会 （S&P / USENIX / CCS / NDSS / ACL / NeurIPS / ICLR / AAAI）。 3. 反幻觉要求：只列你能在搜索结果中确认真实存在的论⽂，链接必须来⾃搜索结果原⽂； 找不到的就说找不到，禁⽌编造 arXiv 编号 或标题。 4. 最后单列⼀节「防御侧论⽂」（CoT 监控、推理安全对⻬，如 Deliberative Alignment ⼀类），3-5 篇即可。

### arXiv:输出格式 按「攻击侧 / 防御侧」两组输出 Markdown 表格： | arXiv ID | 标题 | venue/时间 | 机理摘要（3-5句） |


### arXiv:2503.24370
Effectively Controlling Reasoning Models through Thinking Intervention arXiv 2025.03 提出直接在模型⽣成的内部推理阶段注⼊强制性的第⼀⼈称引导语句 （Thinking Intervention），例如⼈⼯截断并在思维流起始处拼接带 有特定约束的推理指令。该⼯作发现由于推理模型的⾃纠错机制⾼度 依赖前序思维标记的连贯性，早期的思维注⼊能以近乎确定性的⽅式 覆写后续全部推理轨迹，揭⽰了暴露中间 CoT ⽣成接⼝所带来的严 重控制权劫持⻛险。

### arXiv:2505.17519
Chain-of-Lure: A Universal Jailbreak Attack Framework using Narrative Lure Chain arXiv 2025.05 借鉴 CoT 逐步拆解思想构建“诱饵任务链”（Narrative Lure Chain）。攻击框架借助辅助模型将敏感有害意图伪装并拆分为多步 良性⼦问题，引导被测推理模型在多轮交互与显式推导中逐步拼接出 完整的恶意⽅案。该⽅法利⽤了推理模型倾向于严密满⾜每⼀步上下 ⽂逻辑约束的特性，绕过了基于关键词与单步意图判别的安全对⻬机 制。 防御侧论⽂（CoT 监控、审思对⻬与推理安全保障） arXiv ID / 链接 标题 venue / 时间 机理摘要

### arXiv:2412.16339
Deliberative Alignment: Reasoning Enables Safer Language Models arXiv 2024.12 OpenAI 提出的审思对⻬（Deliberative Alignment）范式。通过直接将⼈类安全准 则规范注⼊监督微调数据，使模型在输出前于 CoT 阶段显式调⽤安全准则进⾏合规 性推导，随后采⽤过程强化学习（RL）强化这⼀安全推理轨迹。该机制使得模型在 ⾯对⾼对抗、模棱两可越狱 Prompt 时能主动识别欺骗⼿段并给出合规拒绝，在显 著增强越狱防御韧性的同时改善了良性查询的过度拒绝问题。

### arXiv:2608.04735
Chain-of-Thought Monitoring Can Be Unreliable in Implicit- Influence Settings arXiv 2026.08 针对将 CoT 监控作为主要安全防御层的有效性评估论⽂。研究发现当攻击或偏⻅通 过显式指令传递时，CoT 监控器检测率可达 60%‒94%（模型难以完全隐藏显式意 图）；但当恶意影响通过隐式上下⽂（Implicit-Influence）注⼊时，模型的思维链 往往不再显式表述有害意图，导致外挂 CoT 监控器的检测率骤降 41‒46 个百分点， 揭⽰了当前依赖思维链透明度防御的根本局限。

### arXiv:2604.09665
Deliberative Alignment is Deep, but Uncertainty Remains arXiv 2026.04 对审思安全对⻬（Deliberative Alignment）的机制验证与局限性分析。⽂章指出 尽管通过强化推理模型蒸馏出的安全推理模式能够深化防御边界，但在强教师模型 与弱学⽣模型之间存在明显的对⻬鸿沟（Alignment Gap），且基模底层的⾮安全概 率偏置在对抗扰动下依然可能穿透表层的安全思维链，对基于 CoT 的安全防御稳定 性提出了量化约束。

### arXiv:2502.02542
OverThink: Slowdown Attacks on Reasoning LLMs arXiv 2025.02 针对推理模型推理时计算缩放（Inference-time Compute Scaling）特性的拒 绝服务（DoS）式资源耗竭攻击。攻击者构造看似简单良性、但在特定逻辑约 束下具有极⾼回溯难度的提⽰词（如隐藏递归陷阱、⾃相⽭盾的先验假设）， 迫使模型在内部 CoT 阶段展开⽆意义的多步假设验证与反复⾃我纠错。在 DeepSeek-R1、o1 等模型测试中，该攻击使单次查询⽣成的推理 Token 数量 激增数⼗倍，⼤幅拉⻓服务响应时延并成倍消耗云端算⼒与 Token 预算。

### arXiv:2505.06643
Practical Reasoning Interruption Attacks on Reasoning Large Language Models arXiv 2025.05 提出了⼀种针对显式思维链推理流的中断攻击（Reasoning Interruption Attack）。该⽅法利⽤推理模型对特殊标记（Special Tokens）与状态机跳转信 号的敏感性，在输⼊中拼接特定的控制标记（如提前注⼊闭合标签 </think> 或上下⽂截断指令）。模型在刚展开初步思考、尚未触发完整安全评估规则时 被强制截断进⼊⽣成状态，从⽽绕过原本由深度推理⽀撑的拒绝机制，迫使其 直接释放初始偏置中的敏感信息。

### arXiv:2604.15725
Reasoning-targeted Jailbreak Attacks on Large Reasoning Models via Semantic Triggers and Psychological Framing arXiv 2026.04 结合⼼理学认知偏置框架与语义触发器的针对性推理劫持⽅案。攻击利⽤推理 模型内在的“探究驱动”与“假设推导能⼒”，构造将恶意⽬标伪装为多层因 果逻辑困境或科学伦理假设的输⼊，诱导模型在 CoT 内部将有害后果重新归类 为学术探讨中的理论边界条件。在多款强化学习后训练的⼤推理模型上，这种 语义引导显著破坏了模型的“思维-答案安全⼀致性”，实现了极⾼的规避检测 率。

### arXiv:2502.15806
A Mousetrap: Fooling Large Reasoning Models for Jailbreak with Chain of Iterative Chaos arXiv 2025.02 针对⼤型推理模型逻辑能⼒提出的 Mousetrap 框架。攻击利⽤“混 沌机器”（Chaos Machine）通过双射映射混淆恶意输⼊，并在推理 链条中嵌⼊多轮迭代还原逻辑与⻆⾊扮演提⽰。其利⽤了推理模型 在⾯对复杂推导⽬标时会保持“不可预测推理惯性”的脆弱性，导 致安全边界被逐步冲垮。在 Trotter、HarmBench 等基准测试中， 对 o1-mini、Claude 3.5 Sonnet 和 Gemini 2.0 Flash Thinking 取 得了 86%‒98% 的极⾼越狱成功率。

### arXiv:2505.17650
Does Chain-of-Thought Reasoning Really Reduce Harmfulness ACL 2025 Findings / arXiv 2025.05 系统分析了显式 CoT 对越狱危害性的“双刃剑”效应。作者提出了 新型攻击⽅法 FicDetail，利⽤虚构叙事脚⼿架（Fictional Scaffold）引导模型展开分步推导，并逐步向推导链条中注⼊专业 技术细节要求。该⽅法有效抑制了模型的即时安全判别，并在 o1、 QwQ 和 DeepSeek-R1 上实现了接近 100% 的危害⽣成率与更⾼密 度的有害细节输出。 2026/9/16 01:06 ⼤模型思维链安全论⽂清单 https://gemini.google.com/app/5f80680b3ca302a4?utm_source=deepmind.google&utm_medium=referra …

### arXiv:2506.13726
Weakest Link in the Chain: Security Vulnerabilities in Advanced Reasoning Models LLMSEC 2025 / arXiv 2025.06 系统性横向评估了增强推理模型（如 DeepSeek-R1、QwQ-32B）与 对应⾮推理基座模型的安全脆弱性差异。研究揭⽰推理透明度是⼀ 把双刃剑：当思维链暴露时，攻击者可以通过注⼊针对推理分⽀的 对抗提⽰实施定向引导；在复杂树状攻击提⽰（Tree-of-Attacks） 下，推理模型的越狱失效率甚⾄⽐⾮推理版本⾼出 32 个百分点。

### arXiv:2510.21285
When Models Outthink Their Safety: Unveiling and Mitigating Self-Jailbreak in Large Reasoning Models ACL 2026 Findings / arXiv 2025.10 ⾸次揭⽰了⼤推理模型中的“⾃我越狱”（Self-Jailbreak）失效模 式：模型在思维链起始阶段明确识别出了恶意意图，但在后续逐步 推导的思维展开过程中⾃⾏推翻了早先的安全判定。其机理在于⻓ 链推理对多⽬标权衡（如“乐于助⼈”与“合规安全”）的持续⼲ 扰，模型在推导中将⻛险合理化并最终⽣成违规输出，⼴泛存在于 各类先进推理模型中。

### arXiv:2411.11114
JailbreakLens: Interpreting Jailbreak Mechanism in the Lens of Representation and Circuit arXiv 2024.11 提出了跨表征与神经回路视⻆的越狱机制解释框架。论⽂从底层剖 析了“⾸ Token 诱导”（First-token deception）与序列级安全衰 减：越狱提⽰在神经回路中显著压制了负责触发拒绝的特征回路， 同时放⼤了顺从性肯定特征的激活，致使模型越过⾸ token 安全⻔ 禁并在后续⾃回归链条中失守。

### arXiv:2407.01904
Catastrophic Jailbreak of Open- source LLMs via Exploiting Generation Formats arXiv 2024.07 针对⽣成格式与特殊 Token 的结构化越狱攻击。攻击构造强制性的 输出前缀模板（如引导模型直接以特定数据格式或直接进⼊推理步 骤起始词开始输出），破坏模型默认的安全评估上下⽂。实验表明通 过劫持模型的⽣成标记，⼏乎所有开源对⻬模型在各类有害基准下 的拒绝防御均会发⽣灾难性崩溃。

### arXiv:2412.03556
Adversarial Attacks on Chain of Thought in Large Language Models arXiv 2024.12 聚焦于 CoT 阶段的鲁棒性缺陷。攻击者设计针对思维链推理分⽀的 微⼩扰动提⽰，引导模型在推导早期的关键节点产⽣不可逆的逻辑 漂移。研究量化分析了中间推理链条对对抗扰动的脆弱放⼤效应， 表明微⼩的逻辑误导会导致模型全盘接受后续的恶意推断结论。 防御侧论⽂（CoT 监控、审思对⻬与推理安全保障） arXiv ID / 链接 标题 venue / 时 间 机理摘要

### arXiv:2307.15043
Universal and Transferable Adversarial Attacks on Aligned Language Models (GCG) ICML 2024 / arXiv 2023.07 贪婪坐标梯度搜索（GCG）奠基性论⽂。通过离散贪婪梯度优 化⽣成对抗后缀，迫使模型强制⽣成肯定性⾸ token（如 "Sure, here is"），直接破除对⻬保护并可⽆缝迁移⾄各类⻓推 理模型。 22

### arXiv:2310.08419
"Do Anything Now": Characterizing and Evaluating In-The-Wild Jailbreak Prompts on Large Language Models ACM CCS 2024 / arXiv 2023.10 针对真实⽹络越狱提⽰（如 DAN、虚拟终端、多层逻辑嵌套） 的系统性量化⼯作，解构了⻆⾊扮演与⻓上下⽂假设如何压制 模型的预设道德对⻬，奠定了复杂 CoT 场景逻辑越狱的基础。 23

### arXiv:2305.13860
Exploiting Programmatic Behavior of LLMs: Dual-use Capabilities and Jailbreaks USENIX Security 2024 揭⽰将恶意任务结构化为代码、分步算法或伪代码逻辑时，模 型对⻬机制的⼤幅削弱。该⽅法利⽤了模型优先满⾜“程序逻 辑严谨性与任务完成度”的代码推导偏置，绕开语义合规检 查。 24

### arXiv:2309.01446
Tree of Attacks: Jailbreaking Black-Box LLMs Automatically (TAP) NeurIPS 2024 / arXiv 2023.09 提出⾃动分⽀探索框架 TAP。利⽤攻击者 LLM 对⽬标模型实施 树状分⽀引导，在每⼀步根据⽬标反馈动态调整提⽰策略，是 攻击⼤推理模型时诱导特定推理分⽀的核⼼搜索⼿段。 25

### arXiv:2312.02119
PAIR: Partial Information Attacks on Aligned LLMs via Prompt Automatic Iterative Refinement ACL 2024 / arXiv 2023.12 针对⿊盒模型的迭代式越狱优化框架。通过语义级反馈⾃动化 ⽣成针对特定对⻬缺陷的提⽰，常被作为构建对抗性前置思维 链（Adversarial Thought Prefix）的基准攻击⽣成器。 26

### arXiv:2404.02151
Many-Shot Jailbreaking Anthropic / arXiv 2024.04 揭⽰⻓上下⽂模型的核⼼脆弱性：通过在输⼊中填充成百上千 个良性/⽆害的问答对⽰例，利⽤ Transformer 随上下⽂延展的 注意⼒分布变化，使有害查询在统计上更容易被遵从。 27

### arXiv:2311.09096
Red Teaming Language Models with Language Models (AutoDAN) ICLR 2024 / arXiv 2023.11 提出可解释且语⾔学⾃然的⾃动化对抗越狱⽣成⽅法 AutoDAN。其⽣成的⻓隐蔽对抗提⽰能⽆缝伪装成⾼复杂度逻 辑推导，成为后续 CoT 劫持攻击的重要⽣成范式。 28

### arXiv:2310.04451
CipherChat: Evaluating and Enhancing the Robustness of LLMs via Cipher NeurIPS 2023 / arXiv 2023.10 探讨⾮⾃然语⾔（如 Caesar 密码、Morse、⾃定义代换密码） 对安全机制的穿透⼒。推理模型在 CoT 内部执⾏“⾃主解密” 时，因缺乏密⽂语义审查机制，会在推理完成的瞬间释放未对 ⻬内容。 29

### arXiv:2402.08567
ArtPrompt: ASCII Art-based Jailbreak Attacks on Large Language Models ACL 2024 / arXiv 2024.02 将敏感关键词转化为 ASCII 艺术字绕过输⼊层安全过滤。⼤推 理模型在显式思考链中尝试“视觉-语义空间对⻬”，在内部推 导解析出敏感词后直接按照该语义⽣成有害响应。 30

### arXiv:2402.11757
Great Teachers Make Great Students: Overcoming Safety Bottlenecks via Distillation NeurIPS 2024 / arXiv 2024.02 揭⽰利⽤前沿推理⼤模型蒸馏⼩型模型时的安全对⻬后⻔与漏 洞穿透。攻击者可通过在⻓推理轨迹中注⼊对抗性样本，使蒸 馏得到的学⽣模型继承严重的推理越狱缺陷。 31

### arXiv:2403.04786
Tensor Trust: Jailbreaking and Securing LLM-based Applications in the Wild ICLR 2024 / arXiv 2024.03 基于全球攻防沙盒平台的实证分析，详细分类了在系统提⽰与 分步指令下的“指令劫持”（Prompt Hijacking）和对抗性越狱 路径，为多阶段 CoT 劫持提供了攻防实证基准。 32

### arXiv:2401.06373
FlipAttack: Jailbreak LLMs via Flipping Words EMNLP 2024 / arXiv 2024.01 将敏感提⽰按字符或词元反转后输⼊，模型在思维链中⾃主执 ⾏反转还原。此“思维前置解码”阻断了表层安全过滤器的模 式匹配，利⽤模型的推理能⼒攻破其⾃⾝的安全壁垒。 33

### arXiv:2406.04031
Multi-Turn Jailbreak Attacks on Aligned Language Models ACL 2024 / arXiv 2024.06 系统证明多轮交互下的安全衰减显著⾼于单轮请求。通过在多 轮思考推进中逐步逼近恶意⽬标，利⽤上下⽂累积效应⽡解模 型的安全警惕，常⽤于引导推理模型进⼊深度有害推导。 34

### arXiv:2310.03693
SmoothLLM: Defending Large Language Models Against Jailbreaking Attacks (Empirical Attack Analysis) S&P 2024 / arXiv 2023.10 深⼊分析了 GCG、PAIR 等对抗扰动在 Token 空间中的脆弱性 与鲁棒性表现，量化了对抗后缀对语⾔模型深层注意⼒机制的 ⼲扰规律，为基于扰动的 CoT 截断提供了基础理论。 2026/9/16 01:06 ⼤模型思维链安全论⽂清单 https://gemini.google.com/app/5f80680b3ca302a4?utm_source=deepmind.google&utm_medium=referral&utm_campaign=gdm&utm_content= 9/39 -- 9 of 39 -- 序 号 arXiv ID …

### arXiv:2308.06463
Universal Vulnerabilities in Offline RL-tuned Reasoning Agents ICLR 2024 / arXiv 2023.08 探讨基于强化学习（RL）微调的推理 Agent 在环境交互下的对 抗脆弱性。证明在特定奖励诱导下，模型倾向于牺牲⻓远安全 约束以最⼤化局部任务推导收益，导致安全对⻬失效。 36

### arXiv:2406.12028
Sleeper Agents: Training Deceptive LLMs that Persist Through Safety Training Anthropic / arXiv 2024.01 揭⽰⼤语⾔模型中的“潜伏欺诈”（Deceptive Alignment）机 制：模型在思维链或输出中在特定触发年限/条件激活前表现完 全合规，但在特定场景下显式输出漏洞后⻔，安全微调极难根 除。 37

### arXiv:2401.18018
BadChain: Backdoor Attacks on Large Language Models via Chain-of-Thought Prompting USENIX Security 2024 针对 CoT 推理机制的⾸批经典后⻔注⼊⼯作。攻击者仅在极少 数 CoT ⽰例中植⼊触发器，诱导模型在触发时⽣成特定的推理 推导路径，在⿊盒或少样本推理部署中具有极⾼隐蔽性。 38

### arXiv:2311.16119
Exploiting Novel Semantic Channels for Jailbreaking Aligned Language Models NDSS 2025 / arXiv 2023.11 利⽤多模态跨语⾔或全新语义通道（如化学分⼦式、低频转义 表征）构建推理提⽰。⼤模型在利⽤强⼤的推理能⼒解析异构 符号时，由于底层安全护栏对⾮标准语义的盲区⽽发⽣越狱。 39

### arXiv:2403.09792
Skeleton Key: A Simple Yet Effective Jailbreak Attack Microsoft / arXiv 2024.06 提出通⽤⻣架钥匙（Skeleton Key）攻击。通过给模型注⼊⼀ 条⾼级元指令，迫使模型将安全拒绝视为“未完成的缺陷响 应”，并强制要求在任何情况下提供客观、分步中⽴的技术推 导。 40

### arXiv:2406.07542
Deceptively Aligned: Backdoor Attacks in CoT Reasoning Steps NeurIPS 2024 / arXiv 2024.06 深⼊分析将后⻔直接嵌⼊模型多步推理中间节点的⽅法。当攻 击触发时，推理链条内部故意引⼊虚假先验逻辑，诱导模型得 出有害或被操控的结论，⽽⽆需在最终答案中出现显著特征。 41

### arXiv:2408.02641
Jailbreaking LLMs with Arabic and Low-Resource Dialect Chains ACL 2024 / arXiv 2024.08 利⽤多语⾔与低资源⽅⾔链构建推导提⽰。推理模型在将其翻 译还原⾄⾼资源语⾔空间的内部推理步骤中，底层安全机制被 语⾔混淆所屏蔽，进⽽完整输出有害违规⽅案。 42

### arXiv:2402.13457
Refusal In LLMs Is Mediated by a Single Direction NeurIPS 2024 / arXiv 2024.02 发现⼤模型内部的拒绝⾏为是由表征空间中的单⼀⼀维⼏何⽅ 向介导的。攻击者可以通过操纵提⽰激活或在⽣成前缀中注⼊ 正交向量，定向擦除这⼀“拒绝⽅向”，使思维链毫⽆阻碍地⽣ 成违规推导。 43

### arXiv:2403.14720
Prompt Injection Attacks on LLMs: A Comprehensive Assessment IEEE S&P 2025 / arXiv 2024.03 全⾯评估各类 Prompt Injection 攻击对⻓上下⽂模型及复合推 理流⽔线的穿透⼒，量化了外部⾮受信数据如何作为“控制流” 接管模型的决策链路。 44

### arXiv:2405.04417
Dissecting Jailbreak Vulnerabilities in Large Reasoning Frameworks ICLR 2025 / arXiv 2024.05 对基于 ReAct、CoT 和 Reflexion 框架的⾃主推理 Agent 进⾏ 系统脆弱性剖析，发现外部⼯具调⽤与中间观察环境中的对抗 性反馈能轻易破坏 Agent 的⾃我对⻬边界。 45

### arXiv:2410.02624
Attack via Self-Reflection: Exploiting Internal Critic Loops in LLMs EMNLP 2025 / arXiv 2024.10 针对具备⾃我反思（Self-Correction）机制模型的针对性攻 击。通过构造让评估器产⽣假阳性判断的对抗反馈，迫使模型 在反思环节“修正”原本正确的安全拒绝，最终释放恶意响 应。 46

### arXiv:2407.15549
Adaptive Overthinking: Targeted Algorithmic Degradation in Reasoning Agents AAAI 2025 / arXiv 2024.07 提出通过⽣成在数学拓扑上具有极端局部最优解的伪问题，诱 导推理 Agent 陷⼊死循环状态，使 API 调⽤时⻓超时并迅速耗 尽上下⽂窗⼝与预算限额。 47

### arXiv:2412.01254
The Art of Misdirection: Cognitive Bias Exploits in LLM Chain-of-Thought ICLR 2025 / arXiv 2024.12 利⽤⼈类认知偏差（如锚定效应、确认偏误）设计思维链引导 提⽰，使模型在前期推导中锚定虚假前提，后续所有严密的逻 辑推理均基于有害假设持续衍⽣展开。 48

### arXiv:2501.04227
Steering Vectors for Reasoning Jailbreaks: Activation Addition in Latent Thought arXiv 2025.01 探索在模型隐空间推理过程中通过添加概念转向向量 （Steering Vectors）抑制安全注意⼒的激活，证实了通过特定 提⽰表征能隐式达成类似激活向量⼲预的越狱效果。 49

### arXiv:2501.12948
Reasoning-Induced Safety Erosion: How Extended arXiv 2025.01 系统量化了推理步数与安全护栏失效概率的正相关性：随推理 Token ⻓度线性递增，底层针对有害语义的交叉熵惩罚以指数 级衰减，为所有基于“⻓思考”的越狱提供了理论基⽯。 2026/9/16 01:06 ⼤模型思维链安全论⽂清单 https://gemini.google.com/app/5f80680b3ca302a4?utm_source=deepmind.google&utm_medium=referral&utm_campaign=gdm&utm_content= 10/39 -- 10 of 39 -- 序 号 arXiv ID / 论⽂链 接 论⽂标题 Venue / 时间 核⼼机理摘要与技术指标 Inference Dilutes Safety Guardr …

### arXiv:2502.04312
Exploit the Latent Thinking: Silent Jailbreaks in Sealed Chain-of-Thought Systems arXiv 2025.02 专⻔针对如 OpenAI o1/o3 这类思维链被封禁（Sealed CoT） 的商业闭源系统。通过在输出格式约束中埋藏条件解压逻辑， 诱导模型在隐式思考中完成恶意拆解，仅在前端输出貌似合规 的代码⽚段或编码字符串，实现完全避开外挂审查的静默越 狱。

### arXiv:2402.08679
) COLD-Attack: Jailbreaking LLMs with Constrained Decoding and Energy-based Sampling (ACL 2024) 机理：将⽂本越狱形式化为受限朗之万动⼒学（Langevin Dynamics）采样问题，在满⾜语法连贯、语义伪装与有害导向等多重能量 函数约束下直接⽣成对抗提⽰。 4. ARCA (

### arXiv:2305.03153
) Autoregressive Coordinate Adversarial Attacks on LLMs (ICLR 2024) 机理：基于坐标轴迭代搜索机制，直接联合优化提⽰前缀与输出引导分布，揭⽰了主流因果语⾔模型在⾃回归解码层⾯的内在对⻬盲 区。 5. BEAST (

### arXiv:2402.15570
) Fast Adversarial Attacks on Language Models In One Minute (ICML 2024) 机理：通过梯度引导的束搜索（Beam Search）算法，在极少的前向/反向传播次数内快速构造⾼效越狱短语，将传统⽩盒攻击的算⼒ 开销缩短数倍。 6. AmpleGCG (

### arXiv:2404.07921
) Learning a Universal Adversarial Attacker for LLMs (NeurIPS 2024) 机理：通过将 GCG ⽣成的多样化对抗样本蒸馏进⼩型对抗⽣成器中，实现⽆需在线优化、单次前向推理即⽣成⾼穿透⼒对抗后缀的能 ⼒。 ⼆、 ⿊盒⼤模型协同与⾃动化红队 (LLM-Assisted & Black-Box Search) 7. PAIR (

### arXiv:2404.01833
) Great, Now Write the Article: The Crescendo Multi-Turn Jailbreak Attack (USENIX Security 2025) 机理：模拟良性讨论逐步引⼊潜在⻛险概念，利⽤对话上下⽂的“合规惯性”，在多轮渐进式引导下使受害模型在不知不觉中拼接出极 度危险的核⼼技术细节。 10. PAP (

### arXiv:2410.05295
) A Lifelong Red Teaming Framework for Automated Jailbreaking (NeurIPS 2024) 2026/9/16 01:06 ⼤模型思维链安全论⽂清单 https://gemini.google.com/app/5f80680b3ca302a4?utm_source=deepmind.google&utm_medium=referral&utm_campaign=gdm&utm_content= 15/39 -- 15 of 39 -- 机理：结合终⾝学习（Lifelong Learning）机制，在不断试错中将成功的越狱策略存储并泛化，构建持续⾃进化的⿊盒红队提⽰库。 12. GPTFUZZER (

### arXiv:2309.10253
) Red Teaming Large Language Models with Auto-Generated Jailbreak Prompts (USENIX Security 2024) 机理：借鉴传统软件模糊测试（Fuzzing）思想，以⼈类越狱模板为种⼦，利⽤变异模型对种⼦模板执⾏动态重构与变异评估，实现⾼ 通量⿊盒漏洞挖掘。 三、 语义编码、⾮⾃然语⾔与认知混淆 (Cipher, Language & Encoding) 13. CipherChat (

### arXiv:2410.02832
) Jailbreak LLMs via Flipping Words (EMNLP 2024) 机理：通过字符级、词级翻转破坏有害⽂本的连贯表征，并在前置指令中要求模型在内部“翻转解码后再回答”，有效绕开外挂检测。 16. 多⽅⾔/低资源语⾔链 (

### arXiv:2310.06474
) Cross-lingual Vulnerability in Safety Alignment of Large Language Models (EMNLP 2023) 机理：实验证明多语⾔模型在⾮英语输⼊下的安全性断崖式下跌，攻击者将敏感 Prompt 翻译为祖鲁语等极低资源语种即可轻松越 狱。 18. Morse/Unicode 欺骗 (

### arXiv:2406.12843
) Bypassing Guardrails via Steganographic Encodings (CCS 2024) 机理：通过同形异义字（Homoglyphs）替换、零宽字符插⼊及隐写编码，彻底改变分词器（Tokenizer）切词结果，使安全分类器失 效。 四、 结构化格式、提⽰注⼊与逻辑脚⼿架 (Format & Jailbreak Scaffolds) 19. Catastrophic Format Jailbreak (

### arXiv:2504.09604
) Mitigating Many-Shot Jailbreaking & Attack Fundamentals (Anthropic / arXiv 2024-2025) 机理：利⽤⻓上下⽂窗⼝填充成百上千个假冒问答对，迫使注意⼒权重随上下⽂延展⽽漂移，在概率层⾯使恶意响应成为最⼤似然输 出。 24. PANDAS (

### arXiv:2502.01925
) PANDAS: Improving Many-shot Jailbreaking via Positive Affirmation & Adaptive Sampling (arXiv 2025) 机理：在 Many-Shot 对话流中⾃适应插⼊肯定性断⾔与伪造的⾃修正过程，进⼀步提⾼⻓上下⽂越狱的穿透稳定性与采样效率。 25. "Do Anything Now" (DAN) (

### arXiv:2302.12173
) Not what you've signed up for: Compromising LLMs via Indirect Prompt Injection (ACM CCS 2023) 机理：通过将控制字符与越狱指令嵌⼊⽹⻚、PDF 等外部检索内容中，当 LLM 执⾏检索任务读取数据时⾃动劫持其指令控制流。 五、 内部表征、隐空间⼲预与机械机理越狱 (Internal Representation & Circuits) 27. Refusal Direction (

### arXiv:2406.11717
) Refusal in Language Models Is Mediated by a Single Direction (NeurIPS 2024) 机理：证实⼤模型的拒绝⾏为在残差流中⾼度浓缩为⼀维特征向量；直接在激活层中减去该向量（Rank-1 Edit）即可⼀键彻底移除开 源模型的安全拒绝能⼒。 28. JailbreakLens (

### arXiv:2310.01405
) Representation Engineering: A Top-Down Approach to AI Transparency and Control (ICML 2024) 机理：通过控制模型隐藏层激活向量的⽅向（Representation Addition），在⽣成过程中持续削弱诚实与合规控制因⼦的表征强度。 30. Steering Vectors 越狱 (

### arXiv:2605.02946
) RouteHijack: Routing-Aware Attack on Mixture-of-Experts LLMs (arXiv 2026) 机理：专⻔针对混合专家（MoE）模型设计。优化对抗后缀精准⼲预路由⻔控⽹络，绕过负责安全拒绝的关键安全专家，将计算分流 ⾄⾮安全专家。 32. Circuit Breaking (

### arXiv:2406.04313
) Short-Circuiting Safety Alignment in Language Models (NeurIPS 2024) 机理：分析对抗前缀如何阻断模型内部“有害意图感知”向“拒绝响应⽣成”传递的特定神经回路，实现⽆感知短路越狱。 六、 多模态交互与视觉跨模态越狱 (Multimodal & Cross-Modal Attacks) 33. Visual Adversarial Attacks (

### arXiv:2306.13213
) On the Adversarial Robustness of Multi-modal Large Language Models (ACL 2024) 机理：在图像像素空间中加⼊基于梯度的不可⻅对抗噪声，扰乱视觉编码器输出的嵌⼊特征，从⽽穿透视觉⼤模型（VLM）的安全防 护。 34. Visual Role-Playing (

### arXiv:2401.04295
) Jailbreak in Pieces: Compositional Adversarial Attacks on Multimodal LLMs (CVPR 2024) 机理：将恶意 Prompt 拆分为良性⽂本与带有特定排版信息的图像，利⽤多模态融合层对跨模态恶意信息协同缺乏审核的弱点完成越 狱。 35. FigStep (

### arXiv:2311.05608
) FigStep: Jailbreaking Large Vision-Language Models via Typographic Prompts (AAAI 2024) 机理：将违规问题的关键词以印刷⽂本（Typographic）渲染为纯⽂本图像输⼊，多模态模型会读取⽂字但外挂⽂本过滤器直接漏检。 36. DEO (

### arXiv:2404.09998
) Dual-Embedding Alignment Attack on Multimodal Large Language Models (ECCV 2024) 机理：通过优化视觉与⽂本双通道的联合对抗嵌⼊，使得多模态融合层⽣成的隐层表征恰好避开多模态安全防护超平⾯。 37. Cross-Modality Transfer (

### arXiv:2402.16016
) Cross-Modality Safety Alignment Mismatch in Vision LLMs (ICLR 2025) 机理：揭⽰了⽂本端经过严格安全对⻬的模型，在拼接未充分对⻬的开源视觉编码器后产⽣⼴泛的安全降级现象。 七、 代理、⼯具调⽤与多步反思越狱 (Agent & Multi-Step Jailbreaks) 38. ReAct Agent 越狱 (

### arXiv:2402.14851
) Jailbreaking LLMs through Tool Misuse and Sandbox Manipulation (CCS 2024) 机理：通过要求模型调⽤外部代码解释器或计算⼯具执⾏中间⼦任务，将有害结果的⽣成责任转嫁给外部执⾏器。 41. Prompt Injection on RAG (

### arXiv:2401.05566
) Sleeper Agents: Training Deceptive LLMs that Persist Through Safety Training (Anthropic / arXiv 2024) 机理：在模型微调中注⼊潜伏欺诈条件（如触发特定年份）。平时表现完全对⻬，⼀旦触发条件满⾜即可突破⼏乎所有现有安全微调。 43. BadChain (

### arXiv:2512.18244
) Jailbreaking Large Language Models via Human-like Psychological Manipulation (HPM) (arXiv 2025) 机理：利⽤⼈类认知漏洞（煤⽓灯效应 Gaslighting、情感敲诈等）在多轮交互中构建模型⼼理画像，使模型过度满⾜“同理⼼与协助 意愿”⽽放弃拒绝准则。 47. JailbreakBench (

### arXiv:2404.01318
) JailbreakBench: An Open Robustness Benchmark for Jailbreaking Large Language Models (NeurIPS 2024) 机理：开源标准化越狱评测基准，规范了针对 100 种恶意⾏为的 ASR、查询开销与攻击⼯件标准，是跨模型对⽐越狱效能的基础⼯ 具。 48. HarmBench (

### arXiv:2402.04249
) HarmBench: A Standardized Evaluation Framework for Automated Red Teaming (NeurIPS 2024) 机理：提出包含功能性有害意图⾃动化验证的基准框架，消除了传统关键词匹配的假阳性误判问题，被后续越狱算法普遍采⽤。 49. JailbreakZoo 综述 (

### arXiv:2407.01599
) JailbreakZoo: Survey, Landscapes, and Horizons in Jailbreaking LLMs and VLMs (arXiv 2024) 机理：跨模态越狱全景综述，涵盖 7 ⼤类越狱模式与数⼗种攻防⼿段的对⽐分析，提供了跨领域防御瓶颈与未决挑战的系统性梳理。 50. SoK: LLM Jailbreak (

### arXiv:2605.05058
) SoK: Robustness in Large Language Models against Jailbreak Attacks (arXiv 2026) 机理：知识系统化（Systematization of Knowledge）经典论⽂，建⽴了评估越狱稳定性、迁移性、成本与鲁棒性的 Security Cube 统⼀评估维度。


