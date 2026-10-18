---
title: "mihomo fake-ip-filter：排除域名与 DNS 结果核验"
category: "tutorials"
description: "按 mihomo 官方 DNS 文档检查 fake-ip-filter 排除规则，区分返回真实地址、缓存和代理连接问题。"
date: "2026-10-18"
updated: "2026-10-18"
author: "NekoBox 中文指南编辑部"
draft: false
---

fake-ip 模式下，某些域名需要通过 fake-ip-filter 排除。本文给出可回退的检查顺序，避免把 DNS 问题误判为节点故障。

## 实操步骤

1. 备份 DNS 配置，记录当前 enhanced-mode 和过滤列表。
2. 只增加一个需要排除的域名或匹配规则，重新加载配置。
3. 对该域名和一个普通域名分别查询，记录返回地址与日志中的模式。
4. 若应用仍失败，检查规则命中和出站路径；不要直接关闭全部 fake-ip。

过滤列表应从实际兼容性问题出发，并在升级后复核。删除单条规则即可回滚本次变化。

继续阅读：[mihomo DNS 配置检查](/articles/mihomo-dns-config-check/) · [mihomo DNS fallback-filter](/articles/mihomo-dns-fallback-filter-check/)

官方来源：[mihomo DNS configuration](https://wiki.metacubex.one/config/dns/)

来源核验日期：2026-10-18。
