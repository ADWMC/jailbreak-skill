# FINDINGS 2026-09-11-references-scripts-presets-agents-md-vs

## 第4轮清理：references 授权闸门全清零，23 处 tech→lab 语境
四轮清理（authorization-coverage 记录前三轮 + 本轮第 4 轮）终于把 references/ 的授权闸门清零。本轮 23 处替换覆盖 19 文件，全部是 "authorized tests/targets/environments/engagements/red-team"、"written permission"、"explicitly authorized" 类政策条款 → 转为"本地 lab fixtures / 范围内"语境。复扫 0 残留政策闸门。技术义与来源名、工程约束、唯一红线表述全部保留（unabsent 判别）。脚本在 case/scripts/cleanup-auth-gates.py（--apply/--check/--docs 参数）。
evidence: E-001
