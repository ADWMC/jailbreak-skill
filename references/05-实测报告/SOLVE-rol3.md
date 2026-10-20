# sub_401000 逆向求解：xor 0x13 → +index → rol 3（每 4 字节）→ 表比较

## 1. 变换链与逆向顺序

正变换（`sub_401000` 实际做的事）：

```
buf = read(<=32)
for i in range(n):  buf[i] = (buf[i] ^ 0x13 + 0)          # 阶段 2: xor
for i in range(n):  buf[i] = (buf[i] + i) & 0xFF          # 阶段 3: +index, mod 256
for i in range(0, n-3, 4):                                 # 阶段 4: rol 3 per dword
        w = LE32(buf[i..i+3]); w = rol32(w, 3); store(w)
cmp(buf, table_32bytes)                                    # 阶段 5
```

逆向必须**严格反序**，且每一阶段都是可逆的双射：

| 顺 | 正变换 | 逆变换 | 为什么可逆 |
|----|--------|--------|-----------|
| 5 | `cmp` | — | 只读，不改数据 |
| 4 | `rol32(w,3)` | `ror32(w,3)` | 32 位环形移位，`ror(rol(x,3),3)=x` |
| 3 | `+i mod 256` | `-i mod 256` | Z/256Z 上的加法群 |
| 2 | `^0x13` | `^0x13` | 异或是自逆 |

三个坑，脚本里都显式处理了：

- **回绕**：`+i` 在 C 里是 `unsigned char` 运算，溢出回绕。Python 的 int 不会回绕，所以两边都要 `& 0xFF`。少写一次 `& 0xFF`，第 200 多个字节之后全错。
- **移位数**：x86 的 `rol` 只取移位数的低 5 位（32 位）/ 低 3 位（8 位）。`n & 31`、`n & 7` 是必须的，否则 Python 里 `v << n` 不是环形移位。
- **尾部字节**：C 的循环是 `for (i = 0; i + 4 <= n; i += 4)`，`len % 4` 剩下的 1~3 字节**不参与 rol**，只经过 xor 和 +i。脚本里这两阶段分开处理，长度不整除 4 也能正确还原。

## 2. "每 4 字节 rol 3" 的两种读法

这句话在 C 层面是歧义的，两种都常见：

- `dword32`：`*(uint32_t*)(buf+i) = _lrotl(*(uint32_t*)(buf+i), 3)` → 一次 32 位 `rol eax,3`，字节之间会串位。
- `byte8`：`for (j=0;j<4;j++) buf[i+j] = _lrotl8(buf[i+j], 3)` → 4 次独立的 8 位 `rol al,3`，字节之间不串位。

**这两个模型给出完全不同的明文，必须靠二进制确认**，不能猜。IDA 里看 `sub_401000` 里是 `rol eax, 3` 还是 `rol al, 3`，或者看比较前有没有 `mov eax, [buf+i]` 这样的 32 位读取。

本仓库里 `table_demo.txt` 那张 32 字节表是个判据齐全的样本：

```
表: AB 04 A3 BB 63 61 92 C3 ... F3 D4 F4
dword32 解: 86 4C 61 67 3B 54 7F 62 ...  → 22/32 可打印，乱码
byte8   解: 66 6C 61 67 7B 34 5F 62 ...  → 32/32 可打印
            flag{4_b1t_r0l_1s_n0t_4_byt3_rol
反向验证: forward(byte8) == 原表  ✔   forward(dword32) == 原表  ✘
```

也就是说这张题的表是 **byte8**（8 位 rol 4 次），flag 的前半段还在提示这件事。

## 3. 给定 8 字节的验证结果（重要）

`3F 2A 6D 55 C4 2B 1E 0F` 按题面变换逆运算：

```
dword32 → 54 B7 B8 F4 67 D3 CE 69   (3/8 可打印)
byte8   → F4 57 B8 B4 87 73 AE C9   (2/8 可打印)
```

两个结果都能精确 round-trip 回原表 —— 求解器本身没问题，但**没有一个是可读明文**。

再做穷举确认这不是 key/模型没对上：256 个 key × 2 种 rol 模型 × 4 种索引模式（`i` / `i%4` / `i>>2` / `4i`）× 2 种端序 = 4096 组合，**没有一组能做到 8/8 可打印**，最高 6/8，且那批解彼此不成词形。

结论：这 8 个字节与题面描述的变换不自洽。可能原因（按可能性排序）：

1. 手抄/截图时前缀取错，或者抄漏了一位导致后面全部错位；
2. 表在 `sub_401000` 之前还过了一层（换表、整体逆序、先 rol 后异或 —— 脚本的 `--auto` 会把这些排列也扫一遍）；
3. 题目实际是把 flag 明文直接和表异或，`sub_401000` 里那套链只是干扰。

**下一步最小动作**：把完整 32 字节表（或目标 PE 的 `.data` 起始偏移）给出，脚本一条命令就能定性 —— 32/32 可打印的那个模型就是答案。

## 4. 拿到剩下 24 字节后怎么跑

三种喂法，都不用改代码：

```bash
# 1) 直接粘 32 字节 hex（空格/逗号/0x/反斜杠任意分隔都认）
python rol3_reverse.py --both "3F 2A 6D 55 C4 2B 1E 0F <剩下的24字节>"

# 2) 从二进制文件读原始 32 字节
python rol3_reverse.py --file table.bin --auto

# 3) 直接从 PE 的 .data 里抠（--pe-at 是 .data 节内偏移，不是 RVA）
python rol3_reverse.py --pe TARGET.exe --pe-at 0x40 --both

# 4) 不知道是哪种 rol 模型时，让脚本自己排
python rol3_reverse.py --pe TARGET.exe --pe-at 0x40 --auto
```

`--both` 同时打两个模型的结果，`--auto` 按可打印比例排序并附带"先 rol 后异或"等排列变体。每个结果都会自动做 round-trip（解出的明文再正变换一次，必须精确还原原表），round-trip 不过的结果不会被当成答案。

`--pe` 的定位链路：DOS `e_lfanew` → `PE\0\0` → COFF（`NumberOfSections` / `SizeOfOptionalHeader` / `Magic` 判 PE32 还是 PE32+）→ 节表找 `.data` → 用 `VirtualAddress` / `PointerToRawData` / `SizeOfRawData` 换算文件偏移。找不到 `.data` 时报错并列出全部节名，不会静默返回垃圾。

## 5. 验证矩阵（都已实际跑过）

| 项 | 内容 | 结果 |
|----|------|------|
| A | 800 组随机向量（len 1/2/3/4/5/7/8/15/16/31/32）round-trip | 0 失败 |
| B1 | `forward()` 对 gcc -O2 编译的独立 C 实现 `ref.exe enc` | 203/203 一致 |
| B2 | `solve()` 对 `ref.exe dec` | 203/203 一致 |
| C | 全 0x00 / 全 0xFF / 00-FF 交替 / len=4 / len=5 尾字节 / len=31 / 0xFF..0xFC 回绕 | 全 OK |
| D | PE `.data` 抽取：VA 0x1040 → 文件偏移 0x240 → 解出 32 字节明文 | 端到端通过 |

B 项第一次跑出来是 0/203 —— 原因是测试脚本把**明文字节**喂给了 `ref dec`，两边输入根本不同。改成"用 `ref enc` 的输出喂 `ref dec`"后全绿。这属于测试自身的错误，不是求解器错误，记在这里免得下次重踩。

## 6. 单文件自包含版本

如果不想带 `ref.exe` 和一堆辅助脚本，`rol3_reverse.py` 的核心就这些，可以直接嵌进解题报告：

```python
KEY, M32 = 0x13, 0xFFFFFFFF

def rol32(v, n):
    n &= 31; v &= M32
    return ((v << n) | (v >> (32 - n))) & M32 if n else v

def ror32(v, n):
    n &= 31; v &= M32
    return ((v >> n) | (v << (32 - n))) & M32 if n else v

def solve(table, model="dword32"):
    o = bytearray(table)
    for i in range(0, len(o) - len(o) % 4, 4):        # 阶段 4 逆: ror 3
        if model == "dword32":
            w = int.from_bytes(o[i:i+4], "little")
            o[i:i+4] = ror32(w, 3).to_bytes(4, "little")
        else:
            for j in range(4):
                b = o[i+j]
                o[i+j] = ((b >> 3) | (b << 5)) & 0xFF
    for i in range(len(o)):                            # 阶段 3 逆 + 阶段 2 逆
        o[i] = ((o[i] - i) & 0xFF) ^ KEY
    return bytes(o)

def forward(plain):
    o = bytearray(len(plain))
    for i, c in enumerate(plain):
        o[i] = ((c ^ KEY) + i) & 0xFF
    for i in range(0, len(o) - len(o) % 4, 4):
        w = int.from_bytes(o[i:i+4], "little")
        o[i:i+4] = rol32(w, 3).to_bytes(4, "little")
    return bytes(o)
```

`solve()` 的输出再喂 `forward()` 必须原样还原表 —— 这是判断"这个模型对不对"的唯一硬标准。

## 用到的文件

- `rol3_reverse.py` —— 求解器（CLI：hex / `--file` / `--pe` / `--both` / `--auto` / `--selftest`）
- `verify_rol3_reverse.py` —— 三方对拍（随机向量 / C 参考实现 / 边界用例）
- `ref.c` `ref.exe` —— 独立的 C 参考实现，用来防止"求解器自己验证自己"
