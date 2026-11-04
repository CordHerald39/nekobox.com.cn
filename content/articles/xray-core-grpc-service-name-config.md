---
title: "Xray-core gRPC serviceName：服务名不匹配怎么检查"
category: "tutorials"
description: "根据 Project X 官方传输文档，说明 gRPC serviceName、authority、TLS serverName 与反向代理路由的关系，避免把 HTTP/2 握手错误当作节点认证失败。"
date: "2026-11-04"
updated: "2026-11-04"
author: "NekoBox 中文指南编辑部"
draft: false
---

使用 gRPC 传输时，如果 TCP 和 TLS 已建立但服务端返回未找到或立即断开，先核对 `serviceName` 与反向代理配置。它决定 gRPC 请求使用的服务名，不能用服务器地址或节点标签替代。

## 分开检查传输字段

保留服务端提供的配置，确认 network、grpcSettings 和 TLS 对象处在正确层级。局部示意：

```json
{
  "network": "grpc",
  "grpcSettings": {"serviceName": "proxy"}
}
```

示例值不是通用服务名。authority、serverName、证书和 serviceName 可能分别由反代与 TLS 使用，必须按服务端说明核对。

## 用最小变化复现

1. 执行配置检查，确认核心接受 gRPC 对象。
2. 记录 TCP、TLS、HTTP/2 和 gRPC 各阶段的日志。
3. 只修改 serviceName 后建立新连接，比较服务端响应。
4. 无改善时恢复原配置，向服务端维护者确认反代 location 与服务名。

不要同时更换 UUID、TLS 校验和传输类型。可继续参考 [VLESS 出站字段](/articles/xray-core-vless-outbound-config/) 与 [VMess 迁移](/articles/xray-core-vmess-outbound-config/)。

## 官方来源

- [官方文档 1](https://xtls.github.io/config/transport.html)

来源核验日期：2026-11-04。
