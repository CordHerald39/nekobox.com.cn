---
title: "sing-box HTTP 入站：监听、认证与应用接入"
category: "tutorials"
description: "根据 sing-box 官方 HTTP inbound 文档配置本机 HTTP 代理，检查监听地址、认证和应用连通性。"
date: "2026-10-18"
updated: "2026-10-18"
author: "NekoBox 中文指南编辑部"
draft: false
---

HTTP 入站适合让本机应用使用代理。监听范围和认证参数必须明确，避免把代理端口暴露到不需要的网络。

## 实操步骤

1. 复制配置并确认 listen、listen_port 与入站标签。
2. 只在需要的接口监听；需要认证时填写用户名和密码并妥善保存。
3. 运行 sing-box check，启动后用应用或 curl 发起一次 HTTP 请求。
4. 对照日志确认请求进入该 inbound，再检查对应 outbound 的路由结果。

本机测试通过不等于局域网可用。若要跨设备使用，应先评估防火墙、认证和暴露范围。

继续阅读：[sing-box SOCKS 入站配置](/articles/sing-box-socks-inbound-config/) · [sing-box HTTP 出站配置](/articles/sing-box-http-outbound-config/)

官方来源：[sing-box HTTP inbound](https://sing-box.sagernet.org/configuration/inbound/http/)

来源核验日期：2026-10-18。
