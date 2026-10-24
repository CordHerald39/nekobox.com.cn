---
title: "Xray-core network 路由：TCP 与 UDP 分流检查"
category: "tutorials"
description: "按 Xray 官方 routing 文档核对 network 条件、规则顺序和 TCP/UDP 新连接验收。"
date: "2026-10-24"
updated: "2026-10-24"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 路由规则可以按 network 区分 TCP、UDP 或两者。只改域名条件却发现 UDP 仍走旧出口，常见原因是规则没有覆盖对应 network，或更早的规则已经命中。本文依据官方 routing 文档说明检查顺序，不假定客户端界面名称与核心字段完全一致。

## 先看规则顺序与流量类型

备份当前 routing，记录入站标签、目标地址、目标端口和实际流量类型。浏览器页面通常主要产生 TCP，请用确实产生 UDP 的测试请求做第二组对照。若测试工具没有明确显示协议，不要据此判断 network 规则是否生效。

## 核对 network 字段

官方规则条件支持 `network`。示例仅展示规则片段：

```json
{
  "type": "field",
  "network": "udp",
  "outboundTag": "proxy"
}
```

将它合并到已有 rules 时，保留域名、端口和 inboundTag 条件。`udp`、`tcp` 等值要按当前版本文档和校验结果使用，不能把客户端显示的“游戏模式”直接替换成字段值。若一条规则同时有多个条件，确认它们是同时满足还是被前置规则截走。

## 用 TCP 与 UDP 对照验收

1. 运行 Xray 配置测试，确认 rule 结构和 outboundTag 存在。
2. 用一个明确的 TCP 请求记录命中规则。
3. 用一个明确的 UDP 请求记录命中规则和出站。
4. 交换规则顺序作一次最小对照，完成后恢复稳定顺序。

如果两种流量都没有命中，继续看 [Xray 路由规则基础](/articles/xray-core-routing-rules/)；如果命中但出口连接失败，查看 [Xray freedom 直连出站](/articles/xray-core-freedom-outbound-check/)。端口范围与 network 同时使用时，可参考 [port 路由规则](/articles/xray-core-routing-port-range-check/)。

## 官方来源

- [Xray-core routing 规则](https://xtls.github.io/config/routing.html)

来源核验日期：2026-10-24。示例不代表任何真实节点的连接测试或性能结果。
