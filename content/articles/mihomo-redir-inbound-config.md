---
title: "mihomo REDIR 入站配置：TCP 重定向端口与原目标怎么核对"
category: "tutorials"
description: "参考 mihomo 官方 REDIR 入站文档，整理 TCP 重定向入口的端口、原目标地址和系统转发检查步骤，不把 REDIR 当作 UDP 透明代理。"
date: "2026-11-02"
updated: "2026-11-02"
author: "NekoBox 中文指南编辑部"
draft: false
---

REDIR 入口只负责接收被系统重定向的 TCP 连接。网页仍然直连时，先检查系统重定向规则是否指向 mihomo 的端口，再检查入站是否能读取原目标地址；不要直接把 REDIR 当作 TPROXY 或 UDP 入口。

## 对照入站与转发规则

保存当前配置，确认实际运行配置中启用了 REDIR 监听，并记录监听地址、端口和网卡。官方文档的字段语义与 TPROXY 不同，入站对象应保持独立。示例只展示需要核对的局部：

```yaml
redir-port: 7892
```

这是检查方向，不代表每个系统都应使用该端口。端口空闲、进程可绑定和系统规则命中是三个独立条件。

## 分层验证

1. 先执行配置检查，再确认 mihomo 监听端口。
2. 检查 iptables/nftables 的 REDIRECT 目标是否与端口一致。
3. 发起一个新的 TCP 请求，观察入站日志与目标地址。
4. 若入站有记录但网页失败，再查路由和出站；若无记录，回到系统转发链路。

恢复时只撤销本轮新增规则，保留原有防火墙配置。UDP 应改用适配的透明代理入口，不能通过重复修改 REDIR 端口解决。

## 官方来源

- [官方文档 1](https://wiki.metacubex.one/config/inbound/redir/)

来源核验日期：2026-11-02。
