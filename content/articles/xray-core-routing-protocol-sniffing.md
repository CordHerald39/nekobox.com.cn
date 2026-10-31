---
title: "Xray-core protocol 规则不匹配：network 与嗅探条件怎么查"
category: "tutorials"
description: "对照 Project X 官方路由与入站文档，区分 TCP/UDP network 和 HTTP/TLS/QUIC protocol，检查 sniffing 前提及协议识别限制。"
date: "2026-10-31"
updated: "2026-10-31"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 的 `network` 用来区分 TCP、UDP，路由中的 `protocol` 则匹配嗅探到的 HTTP、TLS、QUIC 等协议。把 `protocol` 写成 `tcp`，或者只写协议规则却没有开启入站嗅探，都应先按字段语义纠正，不能用端口号代替协议识别结果。

## 确认请求从哪个入站进入

备份配置，记录实际核心版本、入站标签、目标和期望出站。客户端可能生成另一份运行配置，应确认修改作用于实际使用的入站。路由规则同一条中填写的多个条件需要同时满足；只看到目标端口为 443，不能证明这次连接已被识别为 TLS。

官方路由文档明确要求开启入站 `sniffing` 才能获得协议类型。先核对入站中的 `sniffing.enabled`。若启用了 `metadataOnly`，官方入站文档说明，除 FakeDNS 外的 sniffer 不能激活，这会影响依赖载荷的识别。

## 用一条范围明确的规则对照

以下仅是 `routing.rules` 中的一个规则对象。`local-socks` 与 `proxy` 必须分别为当前配置已有的入站标签和出站标签；不包含入站、节点或完整路由配置：

```json
{
  "inboundTag": ["local-socks"],
  "network": "tcp",
  "protocol": ["tls"],
  "outboundTag": "proxy"
}
```

将测试规则放在会提前匹配它的宽泛条目之前，保留原兜底。它要求来自指定入站、使用 TCP 且已被识别为 TLS，不能据此捕获所有 443 端口流量。嗅探设置还可能影响目标域名处理，不要在排查协议时无意改掉目标地址策略。

## 识别能力有明确边界

官方当前文档列出 HTTP 仅支持 1.0、1.1，TLS 支持 1.0 至 1.3；QUIC 的识别有时可能失败，BitTorrent 也只有基础嗅探，对加密或混淆流量可能无效。因此测试时应选协议明确的请求，不能把一次未识别当作全部路由失效。

1. 在配置副本上执行 `xray run -test -config config-test.json`，路径换成真实文件。
2. 通过后按原方式加载，关闭旧连接并发起一个已知 TLS 请求。
3. 对照入站、识别结果、命中规则和出站；再用不符合协议条件的请求验证原兜底。
4. 未命中时依次查嗅探、规则顺序和其他条件，保留每次修改后的结果。

嗅探地址处理见 [routeOnly 检查](/articles/xray-core-sniffing-route-only/)；一般规则顺序与默认出口见 [Xray 路由规则](/articles/xray-core-routing-rules/)。若测试引入新问题，恢复规则和嗅探备份，不要通过关闭 TLS 证书校验排查路由。

## 官方来源

- [官方文档 1](https://xtls.github.io/config/routing.html)
- [官方文档 2](https://xtls.github.io/config/inbound.html)
- [官方文档 3](https://xtls.github.io/document/command.html)

来源核验日期：2026-10-31。
