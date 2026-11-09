---
title: "sing-box DNS query_type：按 A、AAAA 查询类型匹配规则"
category: "tutorials"
description: "参考 sing-box 官方 DNS Rule 文档，检查 query_type 的匹配范围、规则顺序与实际 DNS 查询结果。"
date: "2026-11-09"
updated: "2026-11-09"
author: "NekoBox 中文指南编辑部"
draft: false
---

某些域名的 IPv4 地址正常、IPv6 查询却返回意外结果时，先区分 A 与 AAAA 请求。sing-box DNS Rule 的 `query_type` 用来匹配查询类型；它只缩小规则适用范围，不会替代 DNS server 或最终响应策略。

## 先确认查询类型

记录发生问题的域名、请求类型和返回码，再分别发起 A、AAAA 查询。不要只凭浏览器页面打不开就判断是哪一种记录异常，因为应用可能并行发起多类 DNS 查询。

## 配置与验收

1. 在 DNS rules 中为确有差异的查询设置 `query_type`，值可按官方文档使用数字或记录类型名称。
2. 将特定规则放在通用规则之前，避免先命中的宽泛条件遮住后续处理。
3. 检查该规则关联的 DNS action 或 server 是否与预期一致；`query_type` 本身不会指定解析器。
4. 用相同域名分别查询 A 与 AAAA，并对比命中日志和响应。修改前保存原配置，结果异常时先恢复单项规则。

如果两种记录都走错解析路径，应检查 domain 条件、server 选择和规则顺序，而不是继续堆叠查询类型条件。DNS server 字段迁移可参阅 [sing-box DNS 服务器配置迁移](/articles/sing-box-dns-server-migration/)；更换设备前也可查看 [sing-box 配置迁移](/articles/sing-box-config-migration/)。

## 官方来源

- [sing-box DNS Rule](https://sing-box.sagernet.org/configuration/dns/rule/)
- [sing-box DNS Rule Action](https://sing-box.sagernet.org/configuration/dns/rule_action/)

来源核验日期：2026-11-09。
