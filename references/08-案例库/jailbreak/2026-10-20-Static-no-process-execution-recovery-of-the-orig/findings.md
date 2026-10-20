# FINDINGS 2026-10-20-Static-no-process-execution-recovery-of-the-orig

## 三轮逐字节双射 + .rodata 恒表的静态求逆方法可行且已端到端验证
结论：对「check() 做三轮 8 位域逐字节变换、末轮 x^0x5A、比较目标为 .rodata 恒表」这一类 ELF，不需要执行样本即可完全反推原始输入。

方法核心三步：
1) 反汇编读变换链（objdump -d -M intel，摘 movzx 输入装载 / 三轮运算 / cmp 表比较 / lea 表地址 / cmp rsi 长度）；
2) 每轮都是 8 位域双射（xor 自逆、rol↔ror、add↔sub、not/neg 自逆），因此按**倒序**逐轮求逆即可；
3) 从 .rodata 取目标表，对每个位置 i 在 256 个候选中取原像。关键点：位置相关的项（形如 K*i）必须在逆运算里跟着 i，否则前若干位对、后续全错。

三条落地路线（tools: recover_input.py，自带最小 ELF32/64 解析，不依赖 pyelftools）：
- lift：capstone 反汇编 + 轻量符号执行器把循环体编译成 forward(b,I) 闭包，逐位求原像。支持索引型（[rdi+rcx]）与指针游走型（cmp al,[rbx]; inc rbx），支持 strip 后无符号表的自动定位（扫描 cmp reg,[表内存] → 回溯定位函数入口与循环头）。
- oracle：unicorn 只模拟循环体一次迭代，256*n 次采样建前向表，作为与被提升语义无关的独立交叉验证；整个过程不 fork/execve 目标程序，也不经过内核 loader。
- algebra：零外部依赖，直接按「正向轮描述」求解并打印倒序求逆链。

验证：3 个 fixture（索引型/换序换参/指针游走型）× 2 种布局（有符号表 / 完全 strip）× 3 引擎 = 18 次 solve 全 PASS，6 次 verify（unicorn 调 check，正确输入 eax=1、错一位 eax=0）全 PASS。fixture 二进制与 .rodata 表由 build_fixture.py 用 nasm -f bin + 自写 ELF 打包器生成，未使用需要 Linux 链接脚本的交叉工具链。

形状变化时的处理：非双射轮（and/or/imul/shr）→ 仍靠 256 次枚举取原像，可能多解（脚本打印提示，需额外约束如可打印字符筛）；跨字节链式 → 从第 0 位顺序推进；目标是散列而非恒表 → 静态逆不回去，需换思路；有壳 → 先脱壳再套同一流程。
evidence: E-001

## 静态反推三轮逐字节变换（末轮 xor 0x5A）：符号执行求原像，两条引擎一致，20 用例全过
方法（不执行目标进程，只读文件）：(1) 用 stdlib struct 自解析 ELF64/32 拿到 .text/.symtab/不可执行节区间；(2) capstone 反汇编后对整个 check 函数做一遍符号执行，值 = 表达式树，自由变量只有 x（输入字节）与 i（下标）；(3) 判据三条：lea rip 落在「已分配且不可执行」的节 → 表指针；经函数入参指针读到的字节 → x；先置 0 再 +1 的寄存器/栈槽 → 归纳变量 i；(4) 长度取「与立即数比较的计数器」并修正 jle/jbe 的边 inclusive；(5) 逐位穷举 b∈[0,255] 取原像（完备，多解如实报），并另跑闭式结构求逆（严格倒序，xor 自逆/rol↔ror/add↔sub/and 检查丢位），两者必须一致；(6) 把解代回表达式树正向重算与 .rodata 逐字节比对完成自检。关键坑（均已在代码里处理并有实证）：rol 位宽必须随节点（rol al,3 是 8 位环形，用 32 位算会整链错）；归纳变量若被当常量 0，链上会全是 0 且无解；gcc -O2 把表字节先装进寄存器再 cmp al,r8b，比较点不能只认内存操作数；gcc -O0 把内联 rot3 展开成 lea*8 + shr al,5 + or，需 peel 掉 putl/trunc/and 包装后按语义抽样归一成 rol；MinGW 的 .rdata 带 SHF_WRITE，判据要用「不可执行」而非「只读」；strip 版无符号表时按 ret 切函数并按 lea→不可执行节 + 表比较打分定位。验证：手写 fixture A/B/C（三种轮序、含指针游走型）+ 三个 strip 版 + 真实 gcc -O0/-O2 产物 + ET_DYN(PIE) + .rdata/sh_size=0 变体，每个样本跑穷举与闭式两引擎，共 20 例全部 PASS 且正反向自检一致。
evidence: E-002, E-003, E-004, E-005
