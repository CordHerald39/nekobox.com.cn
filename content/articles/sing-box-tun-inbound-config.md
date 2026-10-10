---
title: "sing-box TUN 入站配置：先分清接管范围与配置校验"
category: "tutorials"
description: "围绕 sing-box 官方 TUN 入站文档，整理配置备份、接管范围、权限检查和启动后流量验收步骤。"
date: "2026-10-10"
updated: "2026-10-10"
author: "NekoBox 中文指南编辑部"
draft: false
---

sing-box 的 TUN 入站会改变系统流量的接管范围。配置文件能被解析，只能说明结构基本正确；权限、路由和实际出站仍需单独验证。

## 先记录版本与边界

在 [sing-box TUN 入站官方文档](https://sing-box.sagernet.org/configuration/inbound/tun/)核对当前字段，再记录本机核心版本、操作系统、配置路径和目标接管范围。先复制一份配置副本，不要直接在唯一文件上试改。

## 按字段逐项核对

检查 TUN 入站的类型、地址、自动路由和路由表相关字段是否与当前版本匹配。不要从其他客户端整段复制 TUN 配置；图形客户端可能已经代管权限、路由或 DNS，重复配置会造成冲突。

可以先运行配置检查命令：

```text
sing-box check -c config.json
```

路径替换为自己的副本。检查通过后再启动，保留第一条错误信息和核心日志，避免一次修改多个字段。

## 做权限与流量验收

1. 确认系统允许应用创建 TUN 或 VPN 接口。
2. 只启用一个 TUN 配置，记录系统路由和 DNS 状态。
3. 用固定域名和一个已知目标分别测试解析、连接与出站。
4. 关闭 TUN 后确认系统网络恢复，确保能回滚。

DNS 结构迁移可参考 [sing-box DNS 服务器配置迁移](/articles/sing-box-dns-server-migration/)，不要把 TUN 问题直接归因于远端节点。

## 连接失败时保留最小复现

先回退到备份配置，再逐项恢复路由、DNS 和额外入站。日志可能包含订阅地址或凭据，只分享脱敏后的字段与错误位置。

## 官方来源与核验日期

- [sing-box TUN 入站文档](https://sing-box.sagernet.org/configuration/inbound/tun/)
- [sing-box 配置文档](https://sing-box.sagernet.org/configuration/)

来源核验日期：2026-10-10。字段和权限行为以当前版本文档及本机帮助输出为准。
