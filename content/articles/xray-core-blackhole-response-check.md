---
title: "Xray-core blackhole response：none 与 HTTP 403 有什么区别"
category: "tutorials"
description: "依据 Project X 官方 blackhole 文档，说明 response.type 的 none/http 行为，检查阻断路由命中，避免把本地拒绝响应误当成远端网站错误。"
date: "2026-11-03"
updated: "2026-11-03"
author: "NekoBox 中文指南编辑部"
draft: false
---

连接立即关闭或返回 403，未必是远端网站拒绝访问。若 Xray-core 路由把请求送到了 blackhole 出站，数据会被丢弃；response 设置还会影响关闭前是否发送简单的 HTTP 响应。

## 先看阻断出站的响应类型

Project X 文档列出 `none` 与 `http` 两种类型。none 是默认行为，直接关闭连接；http 会发送一个简单的 HTTP 403 数据包再关闭。下面是出站数组中的局部对象：

```json
{
  "tag": "blocked",
  "protocol": "blackhole",
  "settings": {"response": {"type": "none"}}
}
```

这段配置只定义出站，仍需现有路由把流量指向 blocked。改成 http 不会把被阻断的请求恢复成正常访问，也不等于远端服务真的返回了 403。TLS 客户端还可能把原始 HTTP 数据识别成握手异常。

## 验证是否误入阻断规则

1. 备份配置，执行 `xray run -test -config config.json` 检查结构。
2. 核对路由规则的 `outboundTag` 与 blackhole 的 tag 是否一致。
3. 选一个明确应被阻断的目标和一个正常目标，分别创建新连接。
4. 对照路由顺序、日志和响应阶段，区分规则误命中与真正的上游故障。

若正常目标被误挡，应修正路由匹配范围，而不是只切换 response 类型。回退本轮出站或规则后再次测试；不要为了排障把所有阻断策略整体移除。

延伸阅读：[Xray 路由规则](/articles/xray-core-routing-rules/)、[配置校验](/articles/xray-core-config-test/)。

## 官方来源

- [官方文档 1](https://xtls.github.io/config/outbounds/blackhole.html)

来源核验日期：2026-11-03。
