---
title: "Xray-core REALITY 客户端配置：publicKey、shortId 与 serverName 怎么查"
category: "tutorials"
description: "参考 Project X 官方传输文档，按 REALITY 客户端字段和 TLS 握手阶段排查连接失败。"
date: "2026-11-07"
updated: "2026-11-07"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core REALITY 连接失败时，先将地址、端口、publicKey、shortId 和 serverName 分开核对。配置能解析只代表字段类型正确，不表示客户端与服务端参数已经对应。

## 先确认配置边界

保存一份可回滚配置，运行官方配置检查；检查实际出站引用的 streamSettings，再观察 TCP、TLS 和 REALITY 握手分别在哪一步失败。不要把真实 privateKey 写入文章、日志或工单。

## 验证与回滚

1. 备份当前配置并记录核心版本和错误时间。
2. 运行官方配置检查命令，确认字段结构和引用对象。
3. 建立一次新的最小连接，按日志阶段区分解析、监听、握手和路由问题。
4. 一次只改一个变量，验证后保留可回滚副本。

不要把真实订阅、密码、令牌或密钥写入公开日志。可继续阅读 [xray-core-config-test](/articles/xray-core-config-test/) 与 [xray-core-routing-network-check](/articles/xray-core-routing-network-check/)。

## 官方来源

- [官方文档](https://xtls.github.io/config/transport.html)

来源核验日期：2026-11-07。
