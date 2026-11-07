---
title: "Xray-core HTTPUpgrade 传输配置：path、host 与入站出站如何对齐"
category: "tutorials"
description: "根据 Project X 官方传输文档，整理 HTTPUpgrade 的路径、请求头和两端配置核对顺序。"
date: "2026-11-07"
updated: "2026-11-07"
author: "NekoBox 中文指南编辑部"
draft: false
---

HTTPUpgrade 连接失败时，先确认实际使用的传输类型，再核对 path、host 和端口。HTTPUpgrade 的请求路径与普通 WebSocket 配置不能混用。

## 先确认配置边界

在客户端和服务端各保留一份配置快照；用配置检查确认 streamSettings 结构；先验证 TCP，再检查 HTTPUpgrade 请求路径和 Host，最后再排查路由。每次只修改一个字段并建立新连接。

## 验证与回滚

1. 备份当前配置并记录核心版本和错误时间。
2. 运行官方配置检查命令，确认字段结构和引用对象。
3. 建立一次新的最小连接，按日志阶段区分解析、监听、握手和路由问题。
4. 一次只改一个变量，验证后保留可回滚副本。

不要把真实订阅、密码、令牌或密钥写入公开日志。可继续阅读 [xray-core-websocket-path-config](/articles/xray-core-websocket-path-config/) 与 [xray-core-config-test](/articles/xray-core-config-test/)。

## 官方来源

- [官方文档](https://xtls.github.io/config/transport.html)

来源核验日期：2026-11-07。
