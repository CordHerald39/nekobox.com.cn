---
title: "Xray-core domainStrategy：域名解析与规则命中检查"
category: "tutorials"
description: "根据 Xray 官方路由文档理解 domainStrategy，区分域名解析和 IP 规则匹配的影响。"
date: "2026-10-16"
updated: "2026-10-16"
author: "NekoBox 中文指南编辑部"
draft: false
---

domainStrategy 路由策略。本文依据官方文档整理，先保存原配置，再只改一个字段并运行当前客户端或核心的配置检查。

## 实操步骤

1. 记录版本、rules 顺序和默认出站
2. 用配置副本运行 Xray 配置测试
3. 发起新请求并用 IP 条件做对照

新请求应分别观察规则命中、DNS 或出站结果，旧连接不能作为刚改配置的验收。异常时恢复备份，不要扩大监听范围或关闭安全校验。

继续阅读：[xray-core-routing-rules](/articles/xray-core-routing-rules/) · [xray-core-log-config](/articles/xray-core-log-config/)

官方来源：[https://xtls.github.io/config/routing.html](https://xtls.github.io/config/routing.html)

来源核验日期：2026-10-16。
