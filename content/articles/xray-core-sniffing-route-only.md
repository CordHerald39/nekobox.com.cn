---
title: "Xray-core sniffing routeOnly：按嗅探域名分流并保留原目标"
category: "tutorials"
description: "依据 Xray 官方入站文档，区分 destOverride、routeOnly 与 metadataOnly，检查嗅探规则未命中和开启嗅探后连接异常。"
date: "2026-10-30"
updated: "2026-10-30"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 收到以 IP 为目标的连接时，域名规则可能缺少匹配信息。入站 `sniffing` 可以从支持的流量中嗅探域名；如果只需要把域名用于路由，并希望连接继续使用原始 IP，可检查 `destOverride` 与 `routeOnly` 的组合。

## 先分清两种结果

官方文档说明，`destOverride` 决定对哪些协议使用嗅探结果；`routeOnly: true` 则让嗅探域名仅用于路由，代理目标地址仍为原来的 IP。它不能保证所有流量都能嗅探出域名，也不会补齐错误的应用 DNS 解析结果。

先备份配置，记录目标入站的 `tag`、协议、目标请求和当前路由规则。确认改动的是实际接收测试流量的那个入站，而不是另一端口或没有启用的配置文件。

## 合并入站的 sniffing 块

在该入站对象中添加或修改下面的局部字段，保留原有监听、端口、协议与 settings。不要把整个片段放到 `routing` 下面。

```json
{
  "sniffing": {
    "enabled": true,
    "destOverride": ["http", "tls"],
    "metadataOnly": false,
    "routeOnly": true
  }
}
```

这里把 HTTP 与 TLS 纳入嗅探，未要求处理 QUIC。若测试流量实际使用其他协议，应按文档与实测重新选择，不能仅凭应用名称判断。`metadataOnly: true` 会限制为仅使用连接元数据，官方说明此时除 FakeDNS 以外的 sniffer 不能激活；因此不要一边仅允许元数据，一边期待从 HTTP/TLS 数据中得到域名。

## 用同一个请求核对路由与连接

1. 通过现有配置校验流程，重新加载配置，然后关闭旧连接并建立新连接。
2. 对照访问日志中的入站与出站标签，确认请求确实通过目标入站，并命中了你为该域名安排的规则。
3. 同时检查连接是否成功。规则命中只能说明分流选择发生，不能证明远端目标可达。
4. 若开启嗅探后出现异常，恢复备份或关闭该入站的嗅探做一次对照，保留时间、协议与错误信息。

需要服务端先发第一条消息的协议，要特别注意等待客户端数据嗅探可能改变建连时机。浏览器使用 ECH 时，可见域名也可能受限；不要把没有嗅探到预期域名直接当作路由语法错误，更不要为了验证而全局关闭浏览器安全功能。

如果域名已识别但出口错误，继续看 [Xray-core 路由规则](/articles/xray-core-routing-rules/)；配置无法加载时，先完成 [Xray-core 配置校验](/articles/xray-core-config-test/)。

## 官方来源

- [Xray-core 入站代理：SniffingObject](https://xtls.github.io/config/inbound.html)

来源核验日期：2026-10-30。
