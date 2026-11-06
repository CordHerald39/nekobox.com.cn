---
title: "Xray-core StatsService 统计配置：服务、策略与查询路径怎么核对"
category: "tutorials"
description: "依据 Project X 官方 stats 与 API 文档，整理 StatsService、policy.stats 和 API 入站的对应关系，不把空统计误判成无流量."
date: "2026-11-06"
updated: "2026-11-06"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 统计接口返回空值时，先检查统计对象是否启用，再检查实际用户、入站或出站是否有对应统计名称。StatsService、policy.stats 和 API 入站是不同层，缺一层都可能让结果不完整。

## 先确认配置边界

先记录用户 email、入站 tag 和出站 tag；在对应 policy level 打开所需统计项；确认 API 入站和 StatsService 已加载；用一条新连接查询已知名称，区分无流量、名称不匹配和服务未启用。

## 验证与回滚

1. 备份当前配置并记录核心版本和错误时间。
2. 运行官方配置检查命令，确认字段结构和引用对象。
3. 建立一次新的最小连接，按日志阶段区分解析、监听、握手和路由问题。
4. 一次只改一个变量，验证后保留可回滚副本。

不要把真实订阅、密码、令牌或会话密钥写入公开日志。可继续阅读 [xray-core-api-service-config](/articles/xray-core-api-service-config/) 与 [xray-core-log-config](/articles/xray-core-log-config/)。

## 官方来源

- [官方文档 1](https://xtls.github.io/config/stats.html)

来源核验日期：2026-11-06。
