---
title: "mihomo TUN dns-hijack：透明接管与 DNS 验收步骤"
category: "tutorials"
description: "按 mihomo 官方 TUN 文档检查 dns-hijack 的监听地址、系统路由和实际 DNS 请求，定位 TUN 启动后仍然直连的问题。"
date: "2026-10-19"
updated: "2026-10-19"
author: "NekoBox 中文指南编辑部"
draft: false
---

开启 TUN 后，应用仍可能绕过代理。先区分 TUN 入口没有启动、系统路由没有接管和 DNS 请求没有进入 mihomo 三种情况。

## 逐层检查

1. 备份配置，记录当前系统网络和原 DNS 设置。
2. 检查 TUN 入站的 address、auto-route 与 dns-hijack 是否符合当前系统。
3. 启动后查看日志，确认 TUN 接口创建成功且没有权限错误。
4. 用一个明确域名发起新请求，观察 DNS 查询和规则命中，不使用旧连接作结论。

dns-hijack 只描述 DNS 请求的接管目标；它不会自动解决所有应用的 IPv6、QUIC 或自定义 DNS 行为。若关闭 TUN 后网络恢复，先比较路由表和 DNS 响应，再决定是否调整字段。

继续阅读：[mihomo TUN auto-route 检查](/articles/mihomo-tun-auto-route-check/) · [mihomo 嗅探配置](/articles/mihomo-sniffer-config-check/)。

## 官方来源

[mihomo TUN 入站](https://wiki.metacubex.one/config/inbound/tun/)

来源核验日期：2026-10-19。
