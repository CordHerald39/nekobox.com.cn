---
title: "Xray-core API 服务配置：监听、services 与权限怎么核对"
category: "tutorials"
description: "依据 Project X 官方 API 文档，分开检查 services、API 入站和监听地址，避免把控制接口暴露范围误当成普通代理端口."
date: "2026-11-06"
updated: "2026-11-06"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray API 服务用于查询统计或控制入站。配置能通过解析，只说明 JSON 结构正确；是否可用还取决于 api.services、API 入站和路由是否分别接通。先备份配置，再逐层核对。

## 先确认配置边界

Xray API、API 入站和路由是不同层。先确认 services 中只列出需要的服务，再检查专用 API 入站是否存在，不要把业务代理端口当成 API 端口。

## 验证与回滚

1. 备份当前配置并记录核心版本和错误时间。
2. 运行官方配置检查命令，确认字段结构和引用对象。
3. 建立一次新的最小连接，按日志阶段区分解析、监听、握手和路由问题。
4. 一次只改一个变量，验证后保留可回滚副本。

不要把真实订阅、密码、令牌或会话密钥写入公开日志。可继续阅读 [xray-core-config-test](/articles/xray-core-config-test/) 与 [xray-core-log-config](/articles/xray-core-log-config/)。

## 官方来源

- [官方文档 1](https://xtls.github.io/config/api.html)

来源核验日期：2026-11-06。
