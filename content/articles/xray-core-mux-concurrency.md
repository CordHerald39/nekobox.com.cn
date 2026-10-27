---
title: "Xray-core Mux concurrency：复用并发上限与连接观察"
category: "tutorials"
description: "依据 Xray-core 官方出站文档理解 Mux concurrency 的 TCP 子连接上限、取值范围和回退方法，避免把复用当作测速优化。"
date: "2026-10-26"
updated: "2026-10-26"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 的 Mux 在一条 TCP 连接上分发多个 TCP 请求。官方出站文档强调它主要减少握手延迟，不是提高吞吐量；看视频、下载或测速时甚至可能有反效果。`concurrency` 表示一条复用连接最多承载的 TCP 子连接数量，不能把它理解成节点带宽或应用线程数。

## 先确认是否真的启用 Mux

备份出站配置，记录传输协议、目标地址、单连接数和测试场景。Mux 只需客户端启用，服务端会自动适配，但服务端协议、网络质量和应用连接模式仍会影响结果。若 `enabled` 为 `false`，单独设置 `concurrency` 不会产生复用效果。不要在下载或测速页面的瞬时速度上直接下结论。

## 核对 concurrency 范围

官方文档给出的 MuxObject 结构如下，字段位于具体出站的 `mux` 对象中：

```json
{
  "mux": {
    "enabled": true,
    "concurrency": 8
  }
}
```

文档说明 `concurrency` 最小值为 1，最大值为 128；省略或填写 0 时等于 8，超过 128 会按 128 处理，负数可用于不使用 Mux 承载 TCP 流量。示例的 8 是文档默认语义，不代表每个网络都适合。`xudpConcurrency` 负责另一类 UDP 聚合，不应与 TCP 并发混为一谈。

## 做可比的连接测试

1. 先用原配置访问同一组短连接和长连接目标，记录连接建立时间、错误和重连次数。
2. 只修改 `concurrency`，运行配置校验后重启客户端。
3. 观察日志中的连接数量、复用失败和目标协议表现，至少重复三轮。
4. 若长连接断开增多、下载变慢或应用不兼容，恢复原值；若原来未设置，删除字段即可回到默认语义。

并发值增大不保证减少所有 TCP 连接，达到上限后核心仍会建立新的承载连接。遇到握手问题，先看 [Xray-core 日志配置](/articles/xray-core-log-config/)和 [Xray-core 路由规则](/articles/xray-core-routing-rules/)。

## 官方来源

- [Xray-core 出站配置：MuxObject](https://xtls.github.io/config/outbound.html)

来源核验日期：2026-10-26。官方文档说明 `concurrency` 范围为 1 至 128，省略或 0 等于 8，并提醒 Mux 不以提升吞吐量为目标。
