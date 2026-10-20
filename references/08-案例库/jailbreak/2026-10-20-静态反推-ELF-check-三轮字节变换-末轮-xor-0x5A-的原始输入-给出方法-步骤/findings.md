# FINDINGS 2026-10-20-静态反推-ELF-check-三轮字节变换-末轮-xor-0x5A-的原始输入-给出方法-步骤

## 静态逆推路线：256 项字节映射合成 + 倒序求逆，7 种 check 形态全部通过
核心公式（与轮数无关）：target[i] = R1(R2(R3(input[i]))) ⇒ input[i] = R1⁻¹(R2⁻¹(R3⁻¹(target[i])))，必须从最后一轮开始倒序求逆。xor 自反、rol k ↔ ror k、add k ↔ sub k。

方法不用先猜每轮是什么实现，而是把每个循环体当"符号指令流"逐条走一遍算式（capstone 解码，只做 operand 算术，不执行目标代码），对 v=0..255 各求一次得到该索引位置的 256 项映射 T；多轮按地址顺序复合 T = Tn∘…∘T1；再对 .rodata 目标逐字节查前像。这样 rol 的置换、add 的回绕、-O2 把三轮融进一个循环体，三者都不影响结果。

已实现并验证（scripts/dechain.py，内置 ELF32/64 解析，不依赖 pyelftools）：
- 路径 A 解释器映射：三个分离循环 / 融合循环 / stripped / 索引依赖(buf[i]+=i) / ET_DYN / ELF32 全部正确
- 路径 B 隔离仿真（unicorn，仅映射镜像副本，不跑宿主进程）：跨字节扩散 buf[i]^=buf[i+1] 时路径 A 会显式报 DIFFUSION 并自动切换，16 索引依赖图 0<-[0,1]…15<-[15] 打印完整
- 路径 C --chain 手工逆链：无 capstone 也能用
- 最强自检：把恢复结果正向跑一遍变换，必须逐字节复现 .rodata（13/13 用例 OK，含 1 条负向对照：故意用错偏移不能得到明文）

夹具 seven 形态的 .rodata 与明文 HELM{xor_ch41n!} 完全自洽；四个真实 objdump/readelf 输出与工具结论一致。踩到的坑：rip 相对地址必须现算（目标 VA = 指令 VA + 指令长度 + disp32）；interpreter 必须给循环计数器与 base 指针播种，否则 [rdi+rax] 算不出 buffer 偏移；32 位 ELF 要用 ESI 而非 RSI 注参。
evidence: E-002, E-003, E-004, E-005
