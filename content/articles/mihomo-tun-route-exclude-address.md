---
title: "mihomo TUN 排除内网网段：route-exclude-address 配置与验证"
category: "tutorials"
description: "TUN 开启后 NAS 或办公内网无法访问，按 mihomo 官方文档核对 auto-route 与 route-exclude-address，用单个目标地址验证绕过范围。"
date: "2026-10-30"
updated: "2026-10-30"
author: "NekoBox 中文指南编辑部"
draft: false
---

开启 mihomo TUN 后，浏览器还能访问外网，但 NAS、打印机或办公内网连接失败，可以先检查目标网段是否被自动路由接管。`route-exclude-address` 用于在 `auto-route` 开启时排除指定网段；它改变的是进入 TUN 的范围，不能修复服务本身未启动的问题。

## 先确认故障发生在哪一层

记录客户端与内核版本，备份当前配置；选一个你有权访问且明确知道 IP 的内网设备。先关闭 TUN，使用同一地址和端口测试，再开启 TUN 测试。如果两种状态都失败，应先查设备服务、网线、Wi-Fi 和防火墙。如果只有域名失败而 IP 可以访问，优先查内网 DNS。

还要确认应用没有同时手动指定 HTTP/SOCKS 代理。排除 TUN 网段不会取消应用自己的代理设置，这会干扰对照结果。

## 只排除需要访问的地址

在现有 `tun` 块中合并下面两项，不要新建第二个同名 `tun`。这个片段不是完整配置；保留原有 `enable`、协议栈和 DNS 设置。

```yaml
tun:
  auto-route: true
  route-exclude-address:
    - 192.168.50.10/32
```

示例中的地址表示一台设备，仅在它确实属于你的内网时使用，否则改为实测目标的 CIDR。先用单个 IPv4 地址的 `/32` 验证，确认确有需要后再扩大网段；不要直接排除所有私有地址。办公网络中，部分私有网段可能本来就需要经代理或 VPN 访问。

官方文档还列有 `route-exclude-address-set`，但它依赖 Linux、nftables、`auto-route` 和 `auto-redirect`，不要把它与普通地址列表混用。旧的 `inet4-route-exclude-address`、`inet6-route-exclude-address` 已被文档列为即将废弃的写法，迁移时应按所装内核的支持情况处理。

## 重载后做三项对照

1. 使用客户端的配置检查功能，再重新加载配置；若图形客户端生成了运行配置，确认该字段确实出现在生成结果中。
2. 关闭并重新建立到目标设备的连接，使用相同 IP、端口与应用复测。已有长连接不能作为新路由的证据。
3. 再访问一个原本需要代理的目标，确认排除范围没有意外扩大。必要时对照系统路由和内核日志，而不要仅看代理界面的开关。

若内网仍不可用，恢复备份，分别检查应用代理、系统中另一个 VPN 以及目标服务的访问控制。不要连续叠加多个绕过字段后再猜哪项生效。

涉及自动路由入口可先看 [mihomo TUN auto-route 检查](/articles/mihomo-tun-auto-route-check/)；域名与 IP 结果不一致时，继续看 [mihomo DNS 配置检查](/articles/mihomo-dns-config-check/)。

## 官方来源

- [mihomo TUN 配置：auto-route 与排除地址](https://wiki.metacubex.one/config/inbound/tun/)

来源核验日期：2026-10-30。
