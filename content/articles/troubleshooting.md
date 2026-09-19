---
title: "NekoBox 某个应用无法联网：分应用与 VPN 检查"
category: "tutorials"
description: "先分清全局连接故障和单个应用路由问题。"
date: "2026-09-19"
updated: "2026-09-19"
author: "NekoBox 中文指南编辑部"
draft: false
---

## 确定影响范围

分别测试浏览器和目标应用。如果只有一个应用异常，重点查看应用路由和该应用自身的网络行为。

## 检查接管范围

阅读当前配置的应用规则，确认目标应用是否包含在预期的代理或绕过列表中。不要同时修改节点、DNS 和全部路由。

## 记录可复现条件

记录 Android 版本、客户端版本、网络类型与错误时间。提供日志前删去账号、订阅与节点凭据。

## 参考来源

- [原始项目仓库](https://github.com/MatsuriDayo/NekoBoxForAndroid)
- [开发者下载文档](https://matsuridayo.github.io/download/)
