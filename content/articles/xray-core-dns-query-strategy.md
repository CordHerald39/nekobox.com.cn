---
title: "Xray-core DNS queryStrategy：解析策略与路由结果检查"
category: "tutorials"
description: "按 Xray-core 官方 DNS 文档检查 queryStrategy，区分 IPv4/IPv6 解析策略与路由不通。"
date: "2026-10-18"
updated: "2026-10-18"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 的 queryStrategy 会影响 DNS 查询的地址类型。它只决定解析请求，不能替代路由规则或出站连通性检查。

## 实操步骤

1. 备份 DNS 配置，记录当前 hosts、servers 和路由策略。
2. 在副本中选择与网络环境匹配的 queryStrategy，运行配置校验。
3. 分别测试只返回 IPv4、只返回 IPv6 和双栈的域名。
4. 如果解析成功但连接失败，继续检查路由的 domainStrategy 和出站，而不是反复改 DNS。

变更后应保留旧配置，确认所有需要访问的域名都能解析，再扩大测试范围。

继续阅读：[Xray-core DNS hosts](/articles/xray-core-dns-hosts-mapping/) · [Xray-core 路由 domainStrategy](/articles/xray-routing-domain-strategy-check/)

官方来源：[Xray-core DNS](https://xtls.github.io/config/dns.html)

来源核验日期：2026-10-18。
