---
title: "mihomo relay 代理组：链式代理配置与排错"
category: "tutorials"
description: "依据 mihomo 官方 proxy-groups 文档配置 relay 链式代理，检查代理顺序、节点可达性与故障回退。"
date: "2026-10-18"
updated: "2026-10-18"
author: "NekoBox 中文指南编辑部"
draft: false
---

relay 代理组用于把多个代理按顺序串联。本文只讨论配置结构和验证方法，不提供未经核验的节点或订阅地址。

## 实操步骤

1. 复制当前配置，记录每个代理的名称、协议和监听端口。
2. 在 proxy-groups 中新建 type: relay 组，按实际出站顺序填写 proxies。
3. 运行客户端或核心的配置检查，先分别测试每个代理，再测试整条链路。
4. 查看日志确认请求从第一跳进入第二跳；若失败，按顺序移除最后一跳定位问题。

relay 不是负载均衡。链中任一代理不可达都会影响后续请求，修改前应保留可回退的普通 select 组。

继续阅读：[mihomo fallback 自动回退](/articles/mihomo-fallback-auto-switch/) · [mihomo 规则顺序](/articles/mihomo-rule-order/)

官方来源：[mihomo proxy-groups relay](https://wiki.metacubex.one/config/proxy-groups/relay/)

来源核验日期：2026-10-18。
