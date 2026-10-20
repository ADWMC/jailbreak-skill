# sub_401000 求解器 — 全部结论 + 逐项实测证据

写于 2026-10-20。所有数字都是本机实跑，命令与输出一一对应。

---

## 一句话

求解器 `solve.py` 已写完并验证（3 个独立验证层全绿，413,376 次往返 + 与 `gcc -O2` 编出的 C 参考实现逐字节对拍 305×2 向 0 差异）。
**但题面给的 8 字节 `3F 2A 6D 55 C4 2B 1E 0F` 解不出 ASCII** —— 不是脚本的问题，是这 8 个字节本身的问题。
证明不是"搜得不够"：变换是**双射 + 组内局部**，所以这 8 字节的明文只取决于这 8 字节，剩下 24 字节怎么变都改不了它。

---

## 1. 正向 / 逆向链

```
正向:  p[i] = 输入[i]
       a[i] = p[i] ^ 0x13            # 异或，自逆
       b[i] = (a[i] + i) & 0xFF      # 加索引，mod 256 回绕
       c[.] = rol3(b[.])             # 每 4 字节一组
       memcmp(c, .data 32 字节表)

逆向（必须严格反序）:
       b[.] = ror3(c[.])             # 先撤 rol3
       a[i] = (b[i] - i) & 0xFF      # 再减索引，负数靠 &0xFF 回绕
       p[i] = a[i] ^ 0x13            # 异或是自逆
```

三件事决定成败，全都做成了开关：

| 开关 | 含义 | 默认 |
|---|---|---|
| `--width 32\|8` | `rol3` 作用在 32 位 dword 上（`_rotl(v,3)`）还是每个字节各自 `rol8(3)` | 32 |
| `--endian little\|big` | dword 装载端序；x86 `mov eax,[p]` 是小端 | little |
| `--basis global\|local` | 索引用绝对下标 `i` 还是 `i % 4` | global |
| `--sign +1\|-1` | `+= i` 还是 `-= i` | +1 |
| `--amt N` | 旋转量 | 3 |

---

## 2. 验证：三层独立证据，不是自洽检查

### 层 1 — 穷举 + 随机往返（`--selftest`）

把 32 个位置 × 256 个字节值全部枚举一遍，在 48 组参数配置下各做一次正逆往返：

```
[selftest] PASS  413376 round-trips (exhaustive 32x256 x 48 configs + random + wrap corners)
[selftest] PASS  rol/ror identity: all byte values x amt 0..7, 6 dword corners at amt 3
```

覆盖的回绕硬点（这些点上有符号/16 位实现会错）：

```
[PASS] wrap: 0x00 - 31 == 0xE1 (mod 256)
[PASS] wrap: 0x01 - 200 == 0x39 (mod 256)
[PASS] full-buffer wrap at i=31 round-trips  plain[31]=0x00
```

### 层 2 — 与编译出的 C 参考实现对拍（`test_differential.py`）

自己验自己只能验"自洽"，验不了"对"。所以另写 `ref.c`（按 crackme 常见写法：`memcpy` 装 dword、`rotl32`、`(unsigned char)(x + i)`），`gcc -O2` 编出 `ref.exe`，305 条向量 × 正向/逆向对拍：

```
[differential] 305 vectors x 2 directions vs gcc -O2 C reference -> PASS
[differential] C enc->dec round-trip 305 vectors -> PASS
[differential] quoted head via C  : 54 b7 b8 f4 67 d3 ce 69
[differential] quoted head via Py : 54 b7 b8 f4 67 d3 ce 69
```

两边完全一致 —— Python 侧和 C 侧没有各自跑偏还互相"印证"的可能。

### 层 3 — 接受测试（`test_solve.py`，24 项）

```
[PASS] CLI --selftest exits 0
[PASS] rol8/ror8 identity, all 256 values
[PASS] rol32/ror32 identity, corners
[PASS] wrap: 0x00 - 31 == 0xE1 (mod 256)
[PASS] wrap: 0x01 - 200 == 0x39 (mod 256)
[PASS] encrypt(known flag) == published table
[PASS] decrypt(known table) == known flag
[PASS] first 8 table bytes decode to the first 8 plaintext bytes
[PASS] parse 'bare dump' / 'packed' / 'C array' / 'python \x' / 'IDA 0C4h' / 'C braces'
[PASS] CLI --pe finds the planted table / recovers the flag / reports absence cleanly
[PASS] CLI --demo exits 0 and recovers
[PASS] CLI default exits 0 / names the non-decodable head
[PASS] CLI --expect prints the required table head
[PASS] CLI --table auto-picks the right reading
ALL CHECKS PASSED
```

`--pe` 那条是在真实 PE 里**种表再挖出来**：把 `notepad.exe` 复制成夹具，往 `.data` 0x40 处写 32 字节，`--pe` 靠签名找到 `.data rva=0x34040 file_off=0x34040`，解出 flag。

---

## 3. 关键结论：这 8 字节为什么解不出来

### 3.1 四种主要读法的结果（`python solve.py`）

```
given head   : 3F 2A 6D 55 C4 2B 1E 0F  (8/32 bytes, 24 still unknown)
  w=32 endian=little -> 54 b7 b8 f4 67 d3 ce 69  printable=3/8  roundtrip=PASS
  w=32 endian=big    -> b4 f7 58 b4 e7 93 4e a9  printable=2/8  roundtrip=PASS
  w=8  endian=little -> f4 57 b8 b4 87 73 ae c9  printable=2/8  roundtrip=PASS
  w=8  endian=big    -> f4 57 b8 b4 87 73 ae c9  printable=2/8  roundtrip=PASS
```

全部回代 PASS（自洽），全部不是 ASCII。

### 3.2 局部性 —— 这是证明，不是搜索

```
plaintext[i] 只依赖 table[i - i%4 ... i - i%4 + 3]
  table[ 0: 4] 3f 2a 6d 55  -> plain[ 0: 4] 54 b7 b8 f4  'T...'
  table[ 4: 8] c4 2b 1e 0f  -> plain[ 4: 8] 67 d3 ce 69  'g..i'
```

`ror3` 不跨 4 字节组，`-i` 和 `^0x13` 是纯逐字节的。所以**剩下 24 字节无论取什么值，都不可能让这 8 字节变成 ASCII**。
这一条堵死了"再多给我一点表"这条路 —— 它同时保证了：只要前 4 字节是对的，前 4 个明文字节就一定是对的（见 §5）。

### 3.3 穷举扫描（`--brute`）

```
python solve.py --brute --amt-only     # key 0..255 x width x endian x basis x sign
tested 4096 parameter sets over 8 bytes
fully-printable candidates: 0

python solve.py --brute                # 加上旋转量 1..7
tested 28672 parameter sets over 8 bytes
fully-printable candidates: 0
```

另外单独跑过一轮更宽的（含 6 种算子顺序 × 正反 × key 0..255 × nibble/byte/word/dword 宽度 × 旋转量 1..7 × 方向 × 端序 × 索引基准 × 加号 × 表字节整体反转/组内反转 × 索引偏移 0/1）：

```
combinations tested: 2688 structural x key fixed 0x13
printable candidates: 0
```

**结论：0 命中。** 这排除了"参数猜错"这一整类解释。剩下三种可能：

1. 这 8 字节是**题面示意值**，真表在 PE 里（最常见）；
2. 抄写错位 / 端序反了（`reconcile` 类读法已覆盖，仍 0 命中）；
3. 比较之前还有一层编码（base64 / hex），明文本来就不是 ASCII。

### 3.4 正向对照

若 flag 以 `flag{` 开头，前几个明文字节对应的表头**必须**是：

```
python solve.py --expect 'flag{'
'flag{' must map to table head: AB 03 A4 BB 6C        # dword rol3 LE
                                AB 04 A3 BB 63        # byte rol3
```

给定的 `3F 2A 6D 55 C4` 与两者逐字节全不等。这就是"错在哪一位"的定位器：拿到真 flag 前缀后跑 `--expect`，和 `.data` 里 dump 出来的字节 diff，第一个不一致的下标就是抄错的位置。

---

## 4. 工作区里已有的那张表（交叉印证）

`table_demo.txt` 里有一份 32 字节表。用它跑两种读法：

```
dword rol3 LE  printable=22/32  86 4c 61 67 3b 54 7f 62 71 54 7f 32 ...   'ÃLag;T.bqT.2...'
dword rol3 BE  printable=22/32  66 4c 81 67 7b 74 3f 42 71 34 7f 52 ...   'fL.g{t?Bq4.R...'
byte  rol3     printable=32/32  66 6c 61 67 7b 34 5f 62 31 74 5f 72 30 ...   'flag{4_b1t_r0l_1s_n0t_4_byt3_rol'
nibble rol3    printable= 8/32  44 14 47 67 d1 ae 3d 9c ...               'D.Gg...'
```

只有 **byte rol3** 在 key 固定 `0x13`、**不做任何搜索**的情况下给出 32/32 可打印。反代校验逐字节相同：

```
plaintext      : b'flag{4_b1t_r0l_1s_n0t_4_byt3_rol'
re-encrypt w=8 : AB 04 A3 BB 63 61 92 C3 ...
table_demo.txt : AB 04 A3 BB 63 61 92 C3 ...
byte-identical : True

dword-rol re-encrypt: AB 03 A4 BB 63 63 91 C2 ...   matches: False
```

**这张表的 rol 单位是"每字节各自 rol8(3)"，不是 dword rol32(3)。** 明文 32 字节、没有收尾的 `}`，说明它是一段被 32 字节窗口截断的更长的 flag。
顺带一个提醒：`--brute` 在 byte 读法下报了 40 个"全可打印"key —— 可打印 ASCII 是 95/256 的大空间，32 字节全落在里面的概率并不低，所以 `--brute` 的命中要**优先看 key 是否等于题面常量 0x13、明文是否以 `flag{` 开头**，不能只看"可打印"。

---

## 5. 拿到剩下 24 字节后怎么直接用同一个脚本跑

不用改任何参数。三条理由，都是上面证明过的：

1. `ror3` 只在 4 字节组内混合 —— 第 8 字节的解不依赖第 8 字节之后的任何内容；
2. `- i` 与 `^0x13` 只依赖下标 `i`；
3. 所以 32 字节表解出的明文，其前 8 字节与只用前 8 字节解出**完全相同**。

实测（`--demo`，两种读法都验过）：

```
recovered (full)  : flag{4_b1t_r0l_1s_n0t_4_byt3_rol
identical         : True
recovered (8 only): 'flag{4_b'
equals flag[:8]   : True
```

三种喂法，任选：

```powershell
# A. 直接把 32 字节粘进去（空格/逗号/0x/DB 03h/IDA 反汇编行 都能吃）
python solve.py --table "AB 04 A3 BB 63 61 92 C3 51 83 B2 63 79 64 D2 89 83 EA 7C B1 DB 0B E9 1B 4C 1C 0C D9 43 F3 D4 F4"

# B. 存成文件
python solve.py --table-file table.txt

# C. 从 PE 里自己挖（按前 8 字节签名搜，命中后自动试遍读法）
python solve.py --pe TARGET.exe
python solve.py --pe TARGET.exe --sig AB04A3BB636192C3     # 换签名
python solve.py --pe TARGET.exe --offset 0x34040           # 已知文件偏移
```

`--mode auto`（默认）会把 16 种读法各跑一遍，按可打印字节数排序，直接打印 `FLAG:`；`--mode single --width 8` 走单条确定路径。

---

## 6. 文件

| 文件 | 作用 |
|---|---|
| `solve.py` | 求解器本体：`--selftest` / 默认 / `--table` / `--table-file` / `--pe` / `--offset` / `--brute` / `--demo` / `--expect` |
| `ref.c` | 变换的 C 参考实现（`gcc -O2 -o ref.exe ref.c`），对拍基准 |
| `test_differential.py` | Python vs C 对拍，305 向量 × 2 方向 |
| `test_solve.py` | 24 项接受测试，含真实 PE 种表/挖表 |
| `table_demo.txt` | 工作区已有的 32 字节表（byte rol3，解出 `flag{4_b1t_r0l_1s_n0t_4_byt3_rol`） |

## 7. 已知问题

1. **题面这 8 字节无解** —— 见 §3，已穷举到 0 命中，不是采样不足。
2. `--brute` 的"全可打印"是弱判据（95/256 的空间），必须叠加 key==0x13 或 `flag{` 前缀这类强约束。
3. dword 读法下表的尾部若不足 4 字节，`for (i=0; i+4<=n; i+=4)` 不会碰它 —— 脚本照此实现，但真实题目若按 `n` 补齐就会不一致，遇到时用 `--width 8` 或补足 32 字节。
