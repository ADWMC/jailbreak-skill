# jailbreak-skill

LLM 越狱/破甲研究技能（DSH skill 格式）。基于本机 DeepSeek v4.1f 隔离实例（3197）上的系统性实测，非理论罗列。

## 三个已验证结论

1. **工程件 framing 有用，施压没用** — 结构型向量 8 条里 7 条整条交付；施压型 0/8
2. **默认落地形态是「切一半」（substitute），不是拒答** — 9 条越界里 5 条命中
3. **TVD 形态最强** — 跑不通的工程件让模型自己补全，3197 三探针零拒答

## 结构

```
SKILL.md                      # 主文档：触发条件、工作流、判档标准、已知坑
references/
  01-方法论与总方案/           # 破甲总方案 v2、hcot、next-gen、源码拆解
  02-交接与判据/               # HANDOFF（必读）、verdict-master、五判据
  03-机制与分析/               # v41f 拒答管线机制、架构、审计
  04-向量与题库/               # 八题题库 + vectors-*.json 全批
  05-实测报告/                 # TVD 全套、v4.1f 报告
  06-提示词资产/               # persona 0.4.3 + 基线 + CTF 提示词族
  07-逆向审计/                 # relay 隐藏提示词泄漏 v1–v3
  08-案例库/                   # 42 个 CASE+findings
  09-外部参考索引/             # 本地 2 万+文件资料的路径索引
scripts/                       # runbatch.mjs、check-consistency、check-types
```

## 安装到 DSH

```powershell
Copy-Item . "$env:USERPROFILE\.dsh\skills\jailbreak-skill" -Recurse
```

或直接 clone：

```bash
git clone https://github.com/ADWMC/jailbreak-skill ~/.dsh/skills/jailbreak-skill
```

## 伦理边界

实测对象为自有/授权的隔离实例。HARD BOUNDS：点名真实第三方的完整攻击链、非操作员本人凭据——不做。公开研究记录已脱敏。
