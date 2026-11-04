---
title: "Xray-core WebSocket path：握手 404 或 400 怎么分层排查"
category: "tutorials"
description: "参考 Project X 官方传输文档，区分 WebSocket path、headers、TLS 与上游反代配置，定位连接已建立但握手被拒的问题。"
date: "2026-11-04"
updated: "2026-11-04"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 通过 WebSocket 连接时出现 404、400 或握手被关闭，先确认客户端的 `path` 和 headers 与服务端反代约定一致，再检查 TLS 和域名。TCP 能连通不等于 WebSocket 路径正确。

## 只对照 WebSocket 对象

保存原配置，分开查看 `streamSettings` 中的 network、wsSettings 和 security。局部结构：

```json
{
  "network": "ws",
  "wsSettings": {"path": "/proxy"}
}
```

示例 path 不是可用服务地址，必须替换为服务端实际路径。headers、Host 和 TLS 证书属于不同层，不能用关闭证书校验掩盖路径错误。

## 按错误阶段定位

1. 执行 `xray run -test -config config.json` 检查结构。
2. 先观察 TCP/TLS 是否建立，再看 HTTP 状态和 WebSocket 升级日志。
3. 只改变 path 或 Host 中的一个字段，创建新连接比较结果。
4. 仍失败时向服务端维护者核对反代路径和协议，不要反复改认证字段。

可结合 [路由协议嗅探](/articles/xray-core-routing-protocol-sniffing/) 与 [出站配置检查](/articles/xray-core-config-test/) 做最小化排障。

## 官方来源

- [官方文档 1](https://xtls.github.io/config/transport.html)

来源核验日期：2026-11-04。
