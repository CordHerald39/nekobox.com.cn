---
title: "sing-box independent_cache：DNS 缓存隔离与配置检查"
category: "tutorials"
description: "根据 sing-box 官方 DNS 文档检查 independent_cache 对不同服务器缓存的影响，避免切换 DNS 后继续使用旧结果。"
date: "2026-10-19"
updated: "2026-10-19"
author: "NekoBox 中文指南编辑部"
draft: false
---

多个 DNS 服务器并存时，缓存策略会影响你对切换结果的判断。independent_cache 用于隔离不同服务器的缓存，不能替代 nameserver-policy 或规则配置。

## 变更前后保持可比

1. 备份 DNS 配置，记录同一域名当前返回值和命中服务器。
2. 按官方字段说明启用或关闭 independent_cache，只改这一项。
3. 重启或清理测试范围内的缓存后，再用同一域名发起新查询。
4. 对比服务器、地址和 TTL，确认观察到的是新请求结果。

缓存隔离后结果不同，不代表某个服务器一定更快或更安全。若仍然解析失败，继续检查服务器连通性、fallback 条件和出站路径。可参考 [mihomo DNS nameserver-policy](/articles/mihomo-dns-nameserver-policy/) 了解按域名分流的边界。

## 官方来源

[sing-box DNS 配置](https://sing-box.sagernet.org/configuration/dns/)

来源核验日期：2026-10-19。
