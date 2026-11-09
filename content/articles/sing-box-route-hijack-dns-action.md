---
title: "sing-box hijack-dns：让匹配流量进入 DNS 模块"
category: "tutorials"
description: "根据 sing-box Route Rule Action 文档，排查 DNS 接管规则未命中、顺序错误和普通代理出站混淆。"
date: "2026-11-09"
updated: "2026-11-09"
author: "NekoBox 中文指南编辑部"
draft: false
---

透明代理场景中，如果 DNS 请求仍被当作普通连接转发，先核对 sing-box route rule 是否需要 `hijack-dns` action。官方将它定义为把匹配的 DNS 请求交给 sing-box DNS 模块处理；它与选择普通代理出站的 route action 作用不同。

## 确认请求经过该路由器

先确认当前平台的 TUN/透明入站确实捕获了目标 DNS 流量，并检查请求协议和端口。若请求未进入 sing-box，规则 action 再正确也不会被执行；系统 DNS、加密 DNS 客户端或应用内 DNS 也可能绕过这条路径。

## 设置并验证接管

1. 在 route rules 中为目标 DNS 流量配置 `hijack-dns`，避免将它与普通代理出站规则混写。
2. 核对该规则与其他路由条件的顺序，让 DNS 请求能到达该 action。
3. 查看 sing-box DNS 配置是否存在可用 server/rule，并确认 DNS 模块自身能够完成解析。
4. 分别测试系统解析与显式指定的解析器，查看入站、规则命中和 DNS 查询日志。

若请求已进入 DNS 模块但答案不对，应继续检查 DNS rules、server tag 与缓存，不能通过反复修改 route action 解决解析策略问题。服务器字段迁移说明见 [sing-box DNS 服务器配置迁移](/articles/sing-box-dns-server-migration/)；透明代理入口可参阅 [sing-box TUN 入站配置](/articles/sing-box-tun-inbound-config/)。

## 官方来源

- [sing-box Route Rule Action](https://sing-box.sagernet.org/configuration/route/rule_action/)
- [sing-box DNS Rule](https://sing-box.sagernet.org/configuration/dns/rule/)

来源核验日期：2026-11-09。
