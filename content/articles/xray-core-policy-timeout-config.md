---
title: "Xray-core policy timeout：连接超时与空闲时间怎么分开查"
category: "tutorials"
description: "参考 Project X 官方 policy 文档，区分 level 下的 timeout、handshake 与 connectionIdle 参数，避免把策略时间误当成网络拨号超时."
date: "2026-11-06"
updated: "2026-11-06"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 连接很快被回收，或长时间等待后才失败时，不要先改一组超时字段。policy 针对不同 level 提供超时和空闲策略，拨号阶段的网络参数还在其他配置对象中。先确认实际使用的 level。

## 先确认配置边界

官方说明中，levels 以数字 level 为键，handshake、connIdle 等字段属于该级别策略。数字和秒数以当前版本文档为准，不要把 handshake 当成 TCP 建连或 TLS 握手的统一替代品。

## 验证与回滚

1. 备份当前配置并记录核心版本和错误时间。
2. 运行官方配置检查命令，确认字段结构和引用对象。
3. 建立一次新的最小连接，按日志阶段区分解析、监听、握手和路由问题。
4. 一次只改一个变量，验证后保留可回滚副本。

不要把真实订阅、密码、令牌或会话密钥写入公开日志。可继续阅读 [xray-core-routing-network-check](/articles/xray-core-routing-network-check/) 与 [xray-core-log-config](/articles/xray-core-log-config/)。

## 官方来源

- [官方文档 1](https://xtls.github.io/config/policy.html)

来源核验日期：2026-11-06。
