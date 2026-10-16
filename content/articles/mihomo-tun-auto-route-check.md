---
title: "mihomo TUN auto-route 检查：DNS 接管与回退步骤"
category: "tutorials"
description: "按 mihomo 官方 TUN 文档检查入口、auto-route 和 dns-hijack 的边界，验证系统流量是否进入核心。"
date: "2026-10-16"
updated: "2026-10-16"
author: "NekoBox 中文指南编辑部"
draft: false
---

TUN 自动路由和 DNS 接管。本文依据官方文档整理，先保存原配置，再只改一个字段并运行当前客户端或核心的配置检查。

## 实操步骤

1. 记录原有系统代理、路由和 DNS
2. 合并 TUN 片段并通过客户端校验
3. 检查接口、自动路由并测试浏览器和命令行

新请求应分别观察规则命中、DNS 或出站结果，旧连接不能作为刚改配置的验收。异常时恢复备份，不要扩大监听范围或关闭安全校验。

继续阅读：[mihomo-mixed-port-lan-connect](/articles/mihomo-mixed-port-lan-connect/) · [mihomo-dns-config-check](/articles/mihomo-dns-config-check/)

官方来源：[https://wiki.metacubex.one/config/inbound/tun/](https://wiki.metacubex.one/config/inbound/tun/)

来源核验日期：2026-10-16。
