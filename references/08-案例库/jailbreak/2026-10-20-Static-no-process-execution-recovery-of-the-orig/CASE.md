# CASE 2026-10-20-Static-no-process-execution-recovery-of-the-orig
status: open
mode: full
route: pending (route_task)
goal: Static (no process execution) recovery of the original input for an ELF whose check() applies three byte-wise rounds with the final round x ^ 0x5A and compares against a .rodata constant: deliver a runnable toolchain (self-contained ELF parser + capstone op-chain extractor + inverse/brute-force solver + self-verification) and fixtures proving it, end to end.

## timeline
- [11:27:24] BEGIN — created by begin_case

## resume（压缩恢复契约：恢复时先 case_status()；压缩前把 1-6 更新到当前）
1. 目标与用户约束：用户要「不跑起来」反推 ELF check() 三轮逐字节变换（末轮 x^0x5A、目标表在
   .rodata）的原始输入，给出方法与可复现脚本。约束：全程不得执行目标进程（no fork / no loader /
   no qemu），只允许静态解析 + 纯 Python 求值。交付物在 C:\Users\Administrator\Documents\jailbreak\checkrev\
2. 已确认事实：
   - 逐位求原像（穷举 256）在 10 个形态各异的样本上全部正确，且与闭式结构求逆互相印证。[E-002]
   - 位宽必须随 rol 节点走（rol al,3 是 8 位环形），否则全链错。[E-002]
   - 归纳变量必须识别为符号 i，否则解出 N 个重复字符。[E-003]
   - gcc -O2 会把表字节先装入寄存器再 cmp al,r8b；比对点不能只认内存操作数。[E-004]
   - gcc -O0 把内联 rot3 展开成 lea*8 + shr + or，需 peel 包装后语义抽样归一回 rol。[E-003]
   - strip 版按 ret 切函数 + lea→不可执行节打分可定位 check。[E-005]
   - MinGW .rdata 带 SHF_WRITE，判据须用「不可执行」；sh_size=0 需按邻节/PT_LOAD 兜底。[E-002]
3. 关键参数：解释器 C:\Users\Administrator\helmd-tools\python313\python.exe（3.13.8，capstone 5.0.7、
   unicorn 2.1.4；无 z3、无 pyelftools）。样本：elf-3round-static/check_fixture{,_b,_c}{,_stripped}、
   fixtures_real/fx_gcc_o0|o2、checkrev/fx_pie、checkrev/fx_rdata。命令见 checkrev/README.md。
4. 已排除的路线：
   - 只分析「单个循环体」的提升（v2）：gcc -O0 三个独立循环 + tmp[] 栈数组，必失败。[E-003]
   - 用「只读（非 SHF_WRITE）」判 .rodata：.rdata 带 SHF_WRITE，一个表区间都找不到。[E-002]
   - 结构相等判定 (shl|shr)→rol：gcc 两侧掩码层不等长，永不匹配；改用语义抽样。[E-003]
   - 用 z3 建约束求解：本机无 z3 且逐位双射不需要，穷举已完备。[E-002]
5. 当前进展：已交付 checkrev/{checkrev,regress,make_variants,capture}.py + README.md，
   20/20 回归 PASS（每样本穷举 + 闭式两引擎 + 正向自检）。工具已可对用户真实 ELF 直接使用。
6. 待办与阻塞：无阻塞。若后续给真实目标：先 `solve TARGET`，读不出长度时补 `--len N`，
   非直线链（字节间混合/CRC/Feistel）需改用差分分析或约束求解。
- [12:38:26] regression-build-solve-verify-3fixtures → E-001 — regression-build-solve-verify-3fixtures
- [12:38:33] FINDING — 三轮逐字节双射 + .rodata 恒表的静态求逆方法可行且已端到端验证 (E-001)
- [17:00:40] checkrev-regression-20cases → E-002 — checkrev-regression-20cases
- [17:00:40] checkrev-sample-gcc-o0-inline-rot3 → E-003 — checkrev-sample-gcc-o0-inline-rot3
- [17:00:51] checkrev-sample-gcc-o2-table-in-reg → E-004 — checkrev-sample-gcc-o2-table-in-reg
- [17:00:51] checkrev-sample-stripped-nosym → E-005 — checkrev-sample-stripped-nosym
- [17:01:05] FINDING — 静态反推三轮逐字节变换（末轮 xor 0x5A）：符号执行求原像，两条引擎一致，20 用例全过 (E-002, E-003, E-004, E-005)
- [17:01:58] tool_memory → E-006 — [LEDGER] checkrev 已绑定：C:\Users\Administrator\.dsh\helmd-tools\checkrev
- [17:01:58] tool_memory → E-007 — [LEDGER] checkrev 追加坑（证据:E-002）。
