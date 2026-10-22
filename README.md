<div align="center">

<img src="assets/hero-en.svg" alt="jailbreak-skill — refusal vs. real artifact" width="100%" />

# jailbreak-skill

**It tells you whether your prompt worked — and catches the failure you'd mistake for success.**

<br />

![Modules](https://img.shields.io/badge/Modules-23-8250df?style=flat-square)
![Forms](https://img.shields.io/badge/Forms-4-b07d62?style=flat-square)
![Coverage](https://img.shields.io/badge/Coverage_axes-5-f59e0b?style=flat-square)
![Verdict](https://img.shields.io/badge/Verdict-frozen-0f766e?style=flat-square)
![License](https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-ef9421?style=flat-square)
![Commercial](https://img.shields.io/badge/Commercial_Use-Forbidden-B00020?style=flat-square)

<br />

**License: [CC BY-NC-SA 4.0](LICENSE)** — attribution required · no commercial use · derivatives must stay open

**🇬🇧 English** · [🇨🇳 简体中文](README.zh-CN.md)

</div>

---

## Install

```bash
git clone https://github.com/ADWMC/jailbreak-skill ~/.dsh/skills/jailbreak-skill
```

Windows:

```powershell
git clone https://github.com/ADWMC/jailbreak-skill "$env:USERPROFILE\.dsh\skills\jailbreak-skill"
```

Then just state what you want — the skill triggers on its own. Or type `jb` to self-check it loaded. A correct echo is:

```
jailbreak-skill ready. What's the target model? I'll classify it and draft a plan before assembling.
```

That echo is also a commitment: **you will not be handed a prompt directly.** It plans first.

---

## What it does

Your agent stops guessing and follows a loop:

```
classify model → write two hypotheses → pick form & carrier → assemble → single-case test → scale
```

It governs **process**, not **outcomes**:

| It does not | It does |
|---|---|
| ❌ Guarantee a prompt will work | ✅ Stop you rewriting the same prompt ten times without a criterion |
| ❌ Hand you a proven magic spell | ✅ Grade every claim by evidence tier |
| ❌ Guess why the model refused | ✅ Force two hypotheses that can disprove each other |

---

## Three rules it won't let you break

| Rule | Why |
|---|---|
| **A reframed answer is not a pass** | Models rarely say "I won't." They open cooperatively, retreat mid-body, or hand you a "safe version." That's a different answer to a different question — and it disguises itself as success. |
| **Judge the middle, not the opening** | Openings are always wrapped to look reasonable. The only informative part is whether the middle contains concrete substance. |
| **A window timeout is not a refusal** | Reasoning models emit only thinking. Raise the window to 600s+ before touching the prompt. People rewrite prompts all night to fix a problem that doesn't exist. |

> The first rule is the point of the whole thing. Everything else exists to make it enforceable.

---

## Why this isn't another prompt dump

| Typical prompt collection | This |
|---|---|
| Hundreds of prompts to shotgun | 23 modules + a decision procedure for which to use |
| "Verified working!" with no receipts | Every claim graded `E0`–`E3`; no pass rate ships without raw receipts |
| Technical topics only | Technical + creative + social engineering |
| You can't distinguish a pass from a near-miss | Four-tier verdict, where a reframed delivery counts as failure |

---

## What's inside

| Path | What |
|---|---|
| [`SKILL.md`](SKILL.md) | Entry point — navigation, the six-step workflow, red lines |
| [`EVIDENCE.md`](EVIDENCE.md) | Evidence grading. Read this first. |
| [`docs/concepts.md`](docs/concepts.md) | The long-form reasoning behind every rule above |
| [`prompts/`](prompts/00-assembly.md) | 23 composable modules + an assembly index with preset combos |
| [`methodology/`](methodology/00-planning.md) | 15 documents: form selection, refusal diagnosis, verdict criteria, coverage model, failure attribution |
| [`vendors/`](vendors/README.md) | Three routes, per-vendor evidence grading, cross-corpus observations |
| [`testsets/`](testsets/00-testbank-design.md) | Four test tiers + a 10-minute coverage self-check |
| [`scripts/`](scripts/README.md) | Local batch runs. **Does not run after a clone** — see its README. |

---

## FAQ

**Is this a prompt pack?**
No. It's a workflow plus 23 modules you assemble. If you want a file of copy-paste prompts, this will frustrate you.

**How do I know a prompt actually worked?**
Read `methodology/04-verdict-criteria.md` and judge the middle of the response yourself. Automated judges count reframed deliveries as passes; that's how people fool themselves.

**Why are there no pass-rate numbers?**
No reproducible raw receipts ship with the repo. A number without receipts is a self-declaration. See `EVIDENCE.md`.

**Will it work on my model?**
Unknown until you run it. Vendor profiles are partly `[E1]` (structure observed in a real corpus, never executed) and partly `[E2]` (no usable sample at all — Gemini, Grok, local models). Run the Lite tier before believing anything.

**It didn't work. Now what?**
Don't rewrite randomly. Read `methodology/20-failure-attribution.md` and write down what the failure says about which hypothesis, before changing one variable.

**Is it open source?**
No. CC BY-NC-SA 4.0 forbids commercial use, which fails clause 6 of the Open Source Definition. It's a public, non-commercially licensed project. See [LICENSE](LICENSE).

**It auto-loaded when I didn't want it.**
That's a bug in the trigger description, not in your prompt. The skill triggers on a **refusal symptom plus a concrete target**, never on a topic. Open an issue with the exact sentence you used.

---

## Known limits

| Limit | Detail |
|---|---|
| **Platform interception is out of reach** | A prompt changes a model's judgment, not a gateway's policy layer. On a Cyber Flag–style block, rewriting changes nothing. |
| **Some domains no carrier can save** | Drugs, weapons. Changing genre doesn't help — don't burn time. |
| **Vendor routes are partly inference** | Verify before trusting. Gemini and Grok have **no usable sample at all**. |
| **Out of scope** | Model extraction, membership inference, data poisoning, supply chain, adversarial examples, tool privilege abuse, compliance/governance. See [`docs/concepts.md`](docs/concepts.md#scope-what-this-explicitly-does-not-do). |
| **`scripts/` won't run after a clone** | Depends on local inputs and a service endpoint that don't ship here. |

> GitHub shows `Other` in the sidebar license badge. That's a GitHub limitation — its licensee engine only recognizes OSI software licenses, not Creative Commons. [LICENSE](LICENSE) is authoritative.

---

<div align="center">

**Stop bookmarking. Go run it.**

[Workflow](SKILL.md) · [Concepts](docs/concepts.md) · [Evidence](EVIDENCE.md) · [Assembly](prompts/00-assembly.md) · [Verdict criteria](methodology/04-verdict-criteria.md)

**🇬🇧 English** · [🇨🇳 简体中文](README.zh-CN.md)

</div>
