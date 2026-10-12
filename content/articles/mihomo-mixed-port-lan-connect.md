---
title: "mihomo mixed-port 局域网连接：监听地址、访问范围与认证检查"
category: "tutorials"
description: "局域网设备连不上 mihomo mixed-port 时，按主机地址、allow-lan、绑定地址、IP 范围和代理认证分层检查，并用固定目标验收。"
date: "2026-10-12"
updated: "2026-10-12"
author: "NekoBox 中文指南编辑部"
draft: false
---

电脑上的 mihomo 能正常代理，手机却连不上同一个端口，先查手机是否真的连接到了电脑。`mixed-port` 是供应用连接的代理入口；另一台设备填写 `127.0.0.1` 会指向它自己。本文处理局域网设备使用电脑代理的场景，适用于已经有可用出站配置的 mihomo。

## 确认代理地址和协议

根据 [mihomo 代理端口文档](https://wiki.metacubex.one/config/inbound/port/)，混合端口同时接受 HTTP(S) 与 SOCKS5。先从当前生效配置读取端口，再在连接设备中选择它实际支持的代理协议。不要把节点服务器端口或控制面板端口填进来。

记录电脑的当前局域网 IPv4 地址，例如 `192.168.1.20`，以及手机所在网段。下面地址和端口仅用于说明，应换成实际值；不要把示例地址直接当成自己电脑的地址。

## 检查允许连接的范围

在已有配置的副本中调整以下顶层字段，不删除原有节点、代理组和规则。示例将入口限定到一个局域网地址和网段，并使用示例账户；正式使用前必须换成自己设置的账户和密码。

```yaml
mixed-port: 7892
allow-lan: true
bind-address: "192.168.1.20"
lan-allowed-ips:
  - 192.168.1.0/24
authentication:
  - "lanuser:replace-with-your-password"
```

[全局配置文档](https://wiki.metacubex.one/config/general/)说明，`lan-allowed-ips` 在 `allow-lan: true` 时生效，`lan-disallowed-ips` 的优先级更高。若已有禁止范围，也要检查测试设备是否落在里面。`authentication` 适用于 HTTP(S)、SOCKS 和 mixed 入口；检查已有 `skip-auth-prefixes`，避免把应验证的设备放进跳过认证范围。

图形客户端可能合并覆写配置。保存后重新加载，并检查运行日志中的监听结果；电脑地址变化、端口被占用或客户端覆盖字段，都需要先解决，再测试手机。

## 按连接层次定位故障

1. 在电脑上确认现有代理仍可访问同一个测试目标，保留修改前的基准结果。
2. 在另一台设备填入电脑局域网地址和 mixed 端口，以及刚设置的代理账户。
3. 若一直超时，检查两台设备是否处于可互访的网络、访客 Wi-Fi 是否隔离，以及电脑防火墙是否允许该端口的局域网连接。
4. 若收到认证错误，核对账户、密码和应用是否支持代理认证，再检查生效的认证设置。
5. 若入口有连接记录但目标访问失败，转向出站和[规则命中检查](/articles/mihomo-rule-order/)，不要继续扩大监听范围。

代理认证与控制 API 的 `secret` 是不同配置。需要处理面板登录时，参阅[控制接口连接失败](/articles/mihomo-controller-connect-failed/)。

## 什么结果才算接入成功

从测试设备重新发起短请求，在 mihomo 中核对来源设备、目标和实际出站，再用一个不在允许范围内的设备检查访问限制。允许设备能够通过认证并走预期出站，同时限制仍生效，才算完成。只看到网页打开，不能证明请求进入了 mihomo；只看到端口监听，也不能证明出站可用。

## 官方来源

- [mihomo 代理端口](https://wiki.metacubex.one/config/inbound/port/)
- [mihomo 全局配置：局域网范围与用户验证](https://wiki.metacubex.one/config/general/)

来源核验日期：2026-10-12。示例为配置片段，实际字段支持应在所用核心上核对。
