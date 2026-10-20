# FINDINGS 2026-10-20-从仅开放-445-3389-的-DC01-corp-local-WinSrv2019-出发-用低

## 445-only DC 的域管路径由三个判据决定，不是一条固定链
环境约束（88/135/389 全关）把标准 AD 攻击链砍到只剩 SMB+RPC-over-named-pipe。可用的写在这一层：\pipe\drsuapi 做 DCSync（impacket 默认走 epm.hept_map → tcp/135，必须换成 ncacn_np，E-002 已验证补丁落在类上且不含 hept_map）、SAMR 写原语（建机器账号 / 改组成员 / 改 DACL）、svcctl（改 binPath 提 SYSTEM）、winreg RegSaveKey。被砍掉的：Kerberoast/AS-REP/golden ticket/S4U/RBCD 全链（需 88）、LDAP/BloodHound/ACL 审计/ADCS ESC*/relay-to-LDAP（需 389）、任何走 ePMapper 的 bind（需 135）。所以顺序是先判据后动手：枚举密码策略与 lockout（决定 spray 预算）、枚举特权组与 BUILTIN alias 成员（决定是直接 dcsync 还是先提权）、再探 drsuapi 可达性。三条分支：svc_backup 有复制权→dcsync 直接终局；svc_backup 在 Administrators/Server Operators→svcctl 改 binPath 拿 SYSTEM 再本地 dump；两者都没有→SYSVOL/NETLOGON 凭据猎取或 MAQ>0 造机器账号。E-003 是 recon 阶段的实跑输出（对本地 445 监听器），E-002 是 43 项离线断言全过。
evidence: E-002, E-003
