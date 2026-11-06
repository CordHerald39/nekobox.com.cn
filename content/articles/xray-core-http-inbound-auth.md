---
title: "Xray-core HTTP 入站认证：401 与账号不生效怎么排查"
category: "tutorials"
description: "根据 Project X 官方入站文档，检查 HTTP 入站的 accounts、监听端口和客户端账号对应关系，区分认证错误与路由错误."
date: "2026-11-06"
updated: "2026-11-06"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core HTTP 入站已经监听，但客户端返回 401 或立即断开时，先核对入站协议、settings.accounts 和客户端使用的账号。端口能连接只说明 socket 建立，不表示认证对象被当前入站加载。

## 先确认配置边界

用配置检查确认 HTTP 入站和 accounts 结构；从本机发起最小请求并记录状态码；核对用户名、密码、端口和监听地址；认证通过后再检查路由和 TLS。不要记录真实密码。

## 验证与回滚

1. 备份当前配置并记录核心版本和错误时间。
2. 运行官方配置检查命令，确认字段结构和引用对象。
3. 建立一次新的最小连接，按日志阶段区分解析、监听、握手和路由问题。
4. 一次只改一个变量，验证后保留可回滚副本。

不要把真实订阅、密码、令牌或会话密钥写入公开日志。可继续阅读 [xray-core-http-inbound-local](/articles/xray-core-http-inbound-local/) 与 [xray-core-config-test](/articles/xray-core-config-test/)。

## 官方来源

- [官方文档 1](https://xtls.github.io/config/inbound.html)

来源核验日期：2026-11-06。
