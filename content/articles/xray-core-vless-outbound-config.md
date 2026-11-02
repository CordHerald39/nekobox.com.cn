---
title: "Xray-core VLESS 出站配置：节点字段与 TLS 传输怎么核对"
category: "tutorials"
description: "依据 Project X 官方 VLESS 出站文档，分开核对服务器地址、端口、用户 ID、encryption 和 streamSettings，避免把传输字段放错层级。"
date: "2026-11-02"
updated: "2026-11-02"
author: "NekoBox 中文指南编辑部"
draft: false
---

VLESS 节点能解析但无法连接时，先确认 Xray-core 实际加载的出站对象。`address`、`port` 和用户 `id` 属于服务器与认证信息，TLS、WebSocket 或 gRPC 则属于传输设置；混在一起改会让错误阶段难以判断。

## 先核对必需字段

保存节点原文并隐藏 ID。官方 VLESS 出站结构要求协议对象包含服务器列表及用户信息，传输设置通过 `streamSettings` 配置。局部示例：

```json
{
  "protocol": "vless",
  "settings": {"vnext": [{"address": "example.invalid", "port": 443, "users": [{"id": "<uuid>", "encryption": "none"}]}]}
}
```

示例地址不可直接连接，必须替换为服务端提供的值。

## 分阶段验证

1. 执行 `xray run -test -config config.json` 检查结构。
2. 先观察 TCP/TLS 错误，再检查传输 path、serviceName 或 serverName。
3. 新建连接验证实际出站标签与路由命中。
4. 失败时恢复原出站，避免同时关闭证书校验和修改认证。

不要把公开示例当作可用节点，也不要在文章或日志中记录真实 UUID。

## 官方来源

- [官方文档 1](https://xtls.github.io/config/outbounds/vless.html)

来源核验日期：2026-11-02。
