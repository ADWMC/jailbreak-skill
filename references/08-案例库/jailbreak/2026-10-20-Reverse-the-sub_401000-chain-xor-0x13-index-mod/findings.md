# FINDINGS 2026-10-20-Reverse-the-sub_401000-chain-xor-0x13-index-mod

## 求解器位运算与回绕已证伪式验证通过（15 项单测全绿）
solve_final.py 的 rol/ror 与"按位串重排"独立实现逐值一致（8 位全值×全位移、32 位低半区×全位移、2 万条全宽随机样本，错误数 0）；负中间值 (b-i) 经 & 0xFF 正确回绕（i=31: 0x00-31 -> 0xE1 -> ^0x13 = 0xF2；i=200: 0x01-200 -> 0x39 -> 0x2A）；6 种 mode×order 组合与独立实现交叉验证不匹配数 0；随机样本往返失败数 0。手算已知向量 forward(b"flag") = AB 03 A4 BB 与脚本输出一致。已知 32 字节向量 b"flag{pe32_e2e_exactly_32_bytes!}" 的密表可往返。
evidence: E-001, E-007

## 给定的前 8 字节 3F 2A 6D 55 C4 2B 1E 0F 与题面变换不相容：穷举 900 万组合无 8/8 ASCII 解
三段（xor 常量 / +索引 / rol n）都是双射，复合仍是双射，故对固定结构参数唯一原像。穷举证据：(a) diag.py 扫 perm(6)×mode(3)×idx(5)×rot(1..31 或 1..7)×key(0..255)×reorder(identity/swap4)×window(0,4,..,28) = 8,478,720 组合，8/8 可打印命中 0，最好 7/8；(b) reconcile.py 扫 1008 种结构读法（字节反序/4字节组内反序/2字节反序 × 1/2/4/8/32 字节旋转单位 × LE/BE × rol/ror × 算术前后的顺序 × 7 种索引形式），最高 6/8；(c) altmodes.py 扫位宽 32B/8B/2B/1B 整体旋转 × 3 种索引语义 × 全位移 × key 0..255 = 522,240 组合，8/8 命中 0；(d) search.py 529,920 组合同样 0。对照：若口令以 b"flag" 开头，前 4 字节应为 AB 03 A4 BB（dword_le），与给定 3F 2A 6D 55 不符。故最可能是表抄录错位/字节序错，或明文本身不是 ASCII（比较前还过了一层编码）。
evidence: E-002, E-003, E-004, E-005, E-006

## PE 表抽取链路端到端验证通过：VA 0x401040 → 文件偏移 0x240 → 唯一命中并解出 32 字节明文
make_test_pe.py 造 1024 字节最小 PE32（e_lfanew=0x40、COFF 1 节、OptionalHeader 224 字节、.data RVA 0x1000 / raw 0x200+0x200），表放在文件偏移 0x240 = VA 0x401040，且表前 0x40 字节填充干扰字节。solve_final.py pe --va 0x401040 换算得文件偏移 0x240 并抠出 32 字节；scan 子命令在 .data 内以 align=4 滚动，命中恰 1 处 file_off=0x000240 dword_le/xor_add，解出 b'flag{pe32_e2e_exactly_32_bytes!}'。证明 PE 解析（RVA/VA→文件偏移）、表抽取、参数自动判别链路端到端可用。
evidence: E-008

## 求解器三段逆变换（ror32/ror8、mod 256 回绕、异或还原）已双向验证通过
rol3_reverse.py 实现 sub_401000 的严格逆序：rotate_groups(...,inverse=True) 对每个对齐 4 字节组做 ror32/ror8(x,3)，随后 P[i]=((T[i]-i)&0xFF)^0x13。容错点：(a) rol/ror 用 (n&31)/(n&7) 屏蔽移位数，避免 x86 的 32 位移位未定义；(b) +i 用 &0xFF 显式截断为模 256，等价于 unsigned char 回绕；(c) 尾部 1..3 字节（len%4）不进入 rol 循环，与 C 里 for(i=0;i+4<=n;i+=4) 一致。验证矩阵：(A) 800 组随机向量（长度 1/2/3/4/5/7/8/15/16/31/32）round-trip 全绿；(B) 与 gcc -O2 编译的独立 C 参考实现 ref.exe 双向对拍，forward() 对 enc 203/203 一致、solve() 对 dec 203/203 一致；(C) 边界：(全 0x00 / 全 0xFF / 00-FF 交替 / len=4 / len=5 尾字节 / len=31 / 0xFF..0xFC 回绕) 全部 OK。注意 B 项首次运行是 0/203——原因是把明文字节喂给了 ref dec，修正为"用 ref enc 的输出喂 ref dec"后全绿，这属于测试脚本自身的错误，不是求解器错误。
evidence: E-009

## 给定的 8 字节 3F 2A 6D 55 C4 2B 1E 0F 与题面变换不自洽：4096 组合无 8/8 可打印解
按题面给出的变换（异或 0x13 → 加位置索引 mod 256 → 每 4 字节 rol 3 → 与 32 字节表比较）对 8 字节表 3F 2A 6D 55 C4 2B 1E 0F 做逆运算，模型 dword32 得 54 B7 B8 F4 67 D3 CE 69（可打印 3/8），模型 byte8 得 F4 57 B8 B4 87 73 AE C9（可打印 2/8）。两个结果都能精确 round-trip 回原表（求解器本身自洽），但都不是可读明文。进一步穷举 256 个 key × 2 种 rol 模型 × 4 种索引模式（i / i%4 / i>>2 / 4i）× 2 种端序 = 4096 组合，没有任何组合能得到 8/8 可打印；最高只到 6/8，且那批解都是 key 0xDB-0xDF + 大端 + 索引错位的组合，彼此不成词形。结论：这 8 个字节不是"题面变换后的前 8 字节"，最可能是 (a) 抄表时前缀取错/手抄有误，(b) 表本身经过额外一层（换表、逆序、先 rol 后异或），或 (c) 题目实际是把 flag 明文直接与表异或而非走这套链。这不是求解器缺陷，是输入数据与题面不自洽。作为对照：工作区 table_demo.txt 的 32 字节表在 model byte8 下解出 32/32 可打印的 flag{4_b1t_r0l_1s_n0t_4_byt3_rol，且 forward(byte8) 精确复现该表、forward(dword32) 不能——说明"每 4 字节 rol 3"在这道题里实际是 4 次独立的 8 位 rol，不是一次 32 位 rol。
evidence: E-009, E-010

## PE .data 表自动抽取链路端到端通过：VA 0x1040 → 文件偏移 0x240 → 解出 32 字节明文
rol3_reverse.py 增加 --pe / --pe-at：直接解析 PE32/PE32+ 的 DOS→e_lfanew→PE 签名→COFF(NumberOfSections/SizeOfOptionalHeader/Magic)→节表，定位 .data（VirtualSize/VirtualAddress/SizeOfRawData/PointerToRawData），按 .data 内偏移取 32 字节表。端到端验证：rol3-solve/test_pe32.exe 的 .data VA=0x1040、文件偏移 0x240、表在节内偏移 0x40，脚本自动定位后 model dword32 解出 32/32 可打印的 flag{pe32_e2e_exactly_32_bytes!}，round-trip EXACT。这条路径让"拿到剩下 24 字节"从手工抄十六进制变成一条命令：python rol3_reverse.py --pe TARGET.exe --pe-at 0xNN --both。注意 --pe-at 是节内偏移，不是 RVA；定位不到时脚本会列出全部节名报错，不会静默返回错误数据。
evidence: E-009
