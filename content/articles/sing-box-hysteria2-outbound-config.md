---
title: "sing-box Hysteria2 出站配置：server、password 与 TLS 怎么逐项核对"
category: "tutorials"
description: "参考 sing-box 官方 Hysteria2 出站文档，按地址、密码、TLS 和 UDP 能力定位连接问题。"
date: "2026-11-07"
updated: "2026-11-07"
author: "NekoBox 中文指南编辑部"
draft: false
---

sing-box Hysteria2 出站无法连接时，先确认 route 选择的 tag，再按 server、server_port、password 和 TLS 分层核对。UDP 可达性不能由配置解析结果代替。

## 先确认配置边界

运行 sing-box check；记录 TCP/UDP 建连和 TLS 错误阶段；确认 server_name 与证书校验设置来自服务端资料；只改一个字段后重新建立新会话，保留可用副本。

## 验证与回滚

1. 备份当前配置并记录核心版本和错误时间。
2. 运行官方配置检查命令，确认字段结构和引用对象。
3. 建立一次新的最小连接，按日志阶段区分解析、监听、握手和路由问题。
4. 一次只改一个变量，验证后保留可回滚副本。

不要把真实订阅、密码、令牌或密钥写入公开日志。可继续阅读 [sing-box-route-final-action](/articles/sing-box-route-final-action/) 与 [sing-box-log-config](/articles/sing-box-log-config/)。

## 官方来源

- [官方文档](https://sing-box.sagernet.org/configuration/outbound/hysteria2/)

来源核验日期：2026-11-07。
