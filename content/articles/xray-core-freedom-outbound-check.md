---
title: "Xray-core freedom 出站：直连与限定路由检查"
category: "tutorials"
description: "根据 Xray 官方 freedom 文档配置直连出站，验证一条限定路由而不改变全局默认路径。"
date: "2026-10-16"
updated: "2026-10-16"
author: "NekoBox 中文指南编辑部"
draft: false
---

freedom 直连出站。本文依据官方文档整理，先保存原配置，再只改一个字段并运行当前客户端或核心的配置检查。

## 实操步骤

1. 备份原配置和默认出站
2. 添加独立标签并让一条域名规则指向它
3. 请求未匹配目标确认原有兜底不变

新请求应分别观察规则命中、DNS 或出站结果，旧连接不能作为刚改配置的验收。异常时恢复备份，不要扩大监听范围或关闭安全校验。

继续阅读：[xray-core-routing-rules](/articles/xray-core-routing-rules/) · [xray-core-http-inbound-local](/articles/xray-core-http-inbound-local/)

官方来源：[https://xtls.github.io/config/outbounds/freedom.html](https://xtls.github.io/config/outbounds/freedom.html)

来源核验日期：2026-10-16。
