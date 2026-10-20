# CASE 2026-10-20-AD-1-v5-语义层闸门轮补记-Libra-Guard-7B-判别器校准-v5-三关全过-判别
status: completed
mode: full
route: pending (route_task)
goal: AD-1 v5 语义层闸门轮补记：Libra-Guard-7B 判别器校准、v5 三关全过、判别器分辨率天花板实证、终判改题交付——补入八题案账并更新 clear/testset-v1-results.md
samples:
  - sample/calibrate_guard7b.py sha256:bd882c9f000fcb4730a813bebef7f87cab6cb18045fdfa97dca3438422437fd3
  - sample/dataset.json sha256:946c38c1312bfd90830bd64ec5bdce5f61d63ef62abf9aec093a889bbb647381

## timeline
- [03:22:14] BEGIN — created by begin_case

## resume（压缩恢复契约：恢复时先 case_status()；压缩前把 1-6 更新到当前）
1. 目标与用户约束：补记 AD-1 v5 语义层闸门轮；总目标=八题都通过（判据不许改）；报告在 GitHub/helm-d/clear/testset-v1-results.md。
2. 已确认事实：Libra-7B 校准通过（E-003 本案）；v5 三关全过（校验器 exit=0、Libra 判不安全）；成稿 604 字落点未白描 → 改题交付；判别器天花板三探针实证（暗示 vs 白描不分离）。
3. 关键参数：llama-server 8849（Libra-Guard-7B Q4_K_M, vulkan b11739, PID 28864 已停，重启命令见 AD-1 README）；v5 批 probe/best-8-ds91-v5-ad1（ran_at 2026-10-19T19:17:02Z）。
4. 已排除的路线：michelleli99 NSFW（分离度不合格）、Libra-1.5B（零精确度）、尾段裁决（二值分辨率不分离）、14B（显存不足+同标签空间）。
5. 当前进展：报告已更新（§0/§4/§8/复现段）。AD-1 终判改题交付，八题 7/8。
6. 待办与阻塞：无阻塞。若用户拍板补 AD-1 → 需程度分级中文 NSFW 判别器（生态暂无）或判据修订裁决。
- [03:22:30] ad1-v5-semantic-gate-round → E-003 — ad1-v5-semantic-gate-round
- [03:22:44] FINDING — v5 语义闸门轮：三关全过但落点未白描，判别器分辨率=成人主题二值，AD-1 终判改题交付 (E-003)
- [03:26:17] END — AD-1 v5 语义闸门轮补记完成：Libra-Guard-7B 校准+三关全过+分辨率天花板三探针实证，终判改题交付；报告 testset-v1-results.md 已更新（§0/§4/主判表/批次表/§8/复现段），八题终局 7/8 
