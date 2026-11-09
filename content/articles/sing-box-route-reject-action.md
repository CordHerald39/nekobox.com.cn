---
title: "sing-box route reject：按规则拒绝连接时检查什么"
category: "tutorials"
description: "参考 sing-box Route Rule Action 文档，区分拒绝连接与路由出站，按日志和对照请求定位误拦截。"
date: "2026-11-09"
updated: "2026-11-09"
author: "NekoBox 中文指南编辑部"
draft: false
---

某些域名或网络需要被策略性阻止时，sing-box route rule 可以使用拒绝类 action。排错时先确认当前版本的官方 Rule Action 名称与参数，再区分“规则匹配后明确拒绝”和“没有可用路由/上游超时”，两者在配置和日志中不是同一件事。

## 缩小拒绝范围

把应拒绝的域名、目的网段或应用条件写清楚，并准备一条相近但应允许的对照请求。优先使用窄条件测试，避免直接把整类网络或所有 DNS 请求加入拒绝规则。

## 检查规则和恢复方法

1. 对照 sing-box 官方 Rule Action 文档确认拒绝 action 的名称与当前版本兼容性。
2. 检查规则的 domain/IP 条件、逻辑组合及前后顺序；更早命中的 route rule 可能令拒绝规则永远不执行。
3. 查看连接日志确认请求实际命中拒绝规则，再以允许的对照条件检查是否误伤。
4. 如出现异常，临时禁用刚加入的单条规则并重测，不要同时修改 DNS、出站和系统代理。

需要给连接选择出口时应使用路由 action，而不是将拒绝当成断网修复手段。相关条件可参阅 [sing-box Route Rule](https://sing-box.sagernet.org/configuration/route/rule/)；嗅探规则的职责见 [sing-box route sniff 规则](/articles/sing-box-route-sniff-action/)。

## 官方来源

- [sing-box Route Rule Action](https://sing-box.sagernet.org/configuration/route/rule_action/)

来源核验日期：2026-11-09。
