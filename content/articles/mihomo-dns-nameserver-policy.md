---
title: "mihomo DNS nameserver-policy：按域名分流与解析路径检查"
category: "tutorials"
description: "按 mihomo 官方 DNS 文档配置 nameserver-policy，区分默认 nameserver、域名匹配和实际请求路径。"
date: "2026-10-16"
updated: "2026-10-16"
author: "NekoBox 中文指南编辑部"
draft: false
---

nameserver-policy 分流。本文依据官方文档整理，先保存原配置，再只改一个字段并运行当前客户端或核心的配置检查。

## 实操步骤

1. 记录核心版本、DNS 日志和当前模式
2. 在副本中增加一条域名策略并运行校验
3. 发起新查询并用不匹配域名做对照

新请求应分别观察规则命中、DNS 或出站结果，旧连接不能作为刚改配置的验收。异常时恢复备份，不要扩大监听范围或关闭安全校验。

继续阅读：[mihomo-dns-config-check](/articles/mihomo-dns-config-check/) · [mihomo-tun-auto-route-check](/articles/mihomo-tun-auto-route-check/)

官方来源：[https://wiki.metacubex.one/config/dns/](https://wiki.metacubex.one/config/dns/)

来源核验日期：2026-10-16。
