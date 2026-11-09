---
title: "sing-box query_client_subnet：EDNS Client Subnet 条件检查"
category: "tutorials"
description: "依据 sing-box 官方文档核对 query_client_subnet 的匹配含义、隐私边界与规则验收方法。"
date: "2026-11-09"
updated: "2026-11-09"
author: "NekoBox 中文指南编辑部"
draft: false
---

只有特定 EDNS Client Subnet 查询应走某条 DNS 规则时，可以检查 sing-box DNS Rule 的 `query_client_subnet`。它匹配请求中已经携带的 ECS 网段，不等同于代理客户端的来源 IP，也不会自动为普通 DNS 查询添加 ECS。

## 确认请求里确有 ECS

先从受控测试环境检查 DNS 请求是否包含 EDNS Client Subnet。若客户端、上游或中间转发器没有附带该 OPT 记录，单独增加匹配条件不会制造匹配值，也不会改变上游的地理解析行为。

## 配置和验证

1. 在需要的 DNS rule 上设置 `query_client_subnet`，使用官方文档支持的 IP 或 CIDR 表示。
2. 确认该条件与域名、查询类型及 rule action 组合后，仍能覆盖目标请求。
3. 分别发送包含匹配前缀、不匹配前缀和不含 ECS 的测试请求，观察命中结果。
4. 若响应仍相同，检查上游是否忽略 ECS、规则是否先被其他条件截获，并避免把单次结果解释成位置或性能结论。

ECS 可能向 DNS 上游暴露网络前缀。没有明确需求时不要为了“让解析更准确”而广泛添加这类数据；也不要把 ECS 条件当作匿名化或访问控制手段。关于 DNS 缓存行为可参阅 [sing-box independent_cache](/articles/sing-box-dns-independent-cache-check/) 与 [sing-box DNS cache_capacity](/articles/sing-box-dns-cache-capacity/)。

## 官方来源

- [sing-box DNS Rule](https://sing-box.sagernet.org/configuration/dns/rule/)

来源核验日期：2026-11-09。
