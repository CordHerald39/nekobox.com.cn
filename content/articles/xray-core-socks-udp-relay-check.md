---
title: "Xray-core SOCKS UDP 不通：udp 开关与可达地址怎么检查"
category: "tutorials"
description: "依据 Project X SOCKS 与入站官方文档，排查 TCP 正常而 UDP 失败，检查 udp 默认值、settings.ip、多网卡监听与应用自身的 SOCKS5 UDP 支持。"
date: "2026-10-31"
updated: "2026-10-31"
author: "NekoBox 中文指南编辑部"
draft: false
---

SOCKS5 网页请求成功，并不能证明 UDP 应用也能通过 Xray-core 转发。官方 SOCKS 入站文档将 `udp` 的默认值设为 `false`；还要检查应用是否支持 SOCKS5 UDP，以及它能否访问代理返回的 UDP 地址。先把 TCP 与 UDP 两条路径分开验收。

## 先看应用实际使用的代理能力

记录应用、核心版本和失败时间，备份当前配置。确认应用文档明确支持 SOCKS5 UDP；只有 HTTP 代理或只支持 SOCKS TCP 的设置，不能靠打开内核开关补齐应用能力。

不要用普通 `curl` 网页请求验证 UDP，也不要仅凭客户端流量数字推断协议。保持一个已知可用的 TCP 请求作为对照，再为实际 UDP 应用记录连接情况。

## 在原 SOCKS settings 中核对开关

下面是现有 SOCKS 入站 `settings` 内待合并的局部字段，不是完整入站。保留原认证、用户与监听配置，不要新建第二个 `settings` 对象：

```json
{
  "udp": true
}
```

先检查外层 `listen` 与实际客户端所在设备。只在本机测试时，明确监听回环地址可减少无关网络条件；现有局域网服务则应保留其正确的地址与访问范围，不能直接照抄本机配置。

## settings.ip 与 listen 各有用途

官方说明，开启 UDP 后，Xray 需要知道客户端能据此找到服务端的本机地址。`settings.ip` 用于这个 UDP 地址，默认使用 TCP 连接对应的本地 IP。多数场景可以使用默认值，但 NAT 或多网卡可能需要核对它。

不要把 `settings.ip` 当成限制监听范围的字段，也不要给局域网客户端返回 `127.0.0.1`：客户端会把它理解成自己的回环地址。跨 NAT 的连接需要单独确认映射、路由与可达性，不能仅填一个公网地址就认定端口转发已完成。

入站通用文档还指出，基于 UDP 的入口在多 IP 网卡上监听 `0.0.0.0` 时，可能使用非预期的首选源地址回复。遇到这种情况，应核对实际目标接口与回包源地址，评估绑定具体本机地址；不要直接停用所有网卡。

## 用原应用逐层验证并回退

1. 在配置副本上执行 `xray run -test -config config-test.json`，通过后按原方式加载。
2. 重新建立 SOCKS 会话，再发起实际 UDP 请求，确认入站已收到对应流量。
3. 入站有流量而目标失败时，检查所选出站的 UDP 支持、路由规则、防火墙和回包路径。
4. 比较同一应用、节点和网络条件下的结果，无改善时恢复开关与地址备份。

本机认证和 TCP 基线见 [SOCKS 入站配置](/articles/xray-core-socks-inbound-config/)；分流条件见 [network 路由检查](/articles/xray-core-routing-network-check/)。保留失败阶段，避免把所有 UDP 故障都归为节点不可用。

## 官方来源

- [官方文档 1](https://xtls.github.io/config/inbounds/socks.html)
- [官方文档 2](https://xtls.github.io/config/inbound.html)
- [官方文档 3](https://xtls.github.io/document/command.html)

来源核验日期：2026-10-31。
