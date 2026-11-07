---
title: "sing-box WireGuard 出站配置：private_key、peers 与路由怎么检查"
category: "tutorials"
description: "依据 sing-box 官方 WireGuard 出站文档，整理密钥、peer、endpoint 和路由的安全核对步骤。"
date: "2026-11-07"
updated: "2026-11-07"
author: "NekoBox 中文指南编辑部"
draft: false
---

WireGuard 出站配置应把密钥、peer 公钥、endpoint 和路由分开核验。私钥属于敏感信息，不能复制到公开日志；连接成功也要确认实际流量确实走到该出站。

## 先确认配置边界

先在受控副本运行配置检查；确认 peers、allowed_ips 和 endpoint 与服务端资料一致；检查 route 的出站 tag，再用最小请求验证握手和流量路径。迁移时只转移必要配置并轮换暴露过的密钥。

## 验证与回滚

1. 备份当前配置并记录核心版本和错误时间。
2. 运行官方配置检查命令，确认字段结构和引用对象。
3. 建立一次新的最小连接，按日志阶段区分解析、监听、握手和路由问题。
4. 一次只改一个变量，验证后保留可回滚副本。

不要把真实订阅、密码、令牌或密钥写入公开日志。可继续阅读 [sing-box-route-final-action](/articles/sing-box-route-final-action/) 与 [sing-box-route-default-domain-resolver-check](/articles/sing-box-route-default-domain-resolver-check/)。

## 官方来源

- [官方文档](https://sing-box.sagernet.org/configuration/outbound/wireguard/)

来源核验日期：2026-11-07。
