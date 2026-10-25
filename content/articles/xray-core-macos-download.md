---
title: "Xray-core macOS 下载与架构选择"
category: "downloads"
description: "从 Xray-core 官方 Releases 选择 macOS 对应架构包，核对解压权限、配置检查和首次启动日志。"
date: "2026-10-25"
updated: "2026-10-25"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 在 macOS 上启动失败，常见原因包括架构包选错、执行权限不足或配置文件不兼容。先确认官方资产和本机架构，再分开验证程序、配置与监听端口。

## 记录系统与来源

打开 Xray-core 官方 Releases，记录发行条目、资产名称和 macOS 架构。Apple 芯片与 Intel 设备应选择对应包；不要用第三方下载页替代发行页。

## 完成文件检查

解压后在终端运行版本检查，确认系统允许执行该文件。若提示权限或隔离属性问题，先确认文件确实来自官方发行页，再按 macOS 安全设置处理。

## 校验配置并看日志

1. 复制一份配置作为测试版本。
2. 使用官方命令检查 JSON 和必填字段。
3. 前台启动，记录第一条错误和监听地址。
4. 处理完成后再配置后台启动，避免日志丢失。

需要进一步看路由时参考 [Xray-core 配置校验](/articles/xray-core-config-test/)，DNS 问题可对照 [DNS 查询策略](/articles/xray-core-dns-query-strategy/)。

## 官方来源

- [Xray-core 官方 Releases](https://github.com/XTLS/Xray-core/releases)
- [Xray-core 官方文档](https://xtls.github.io/)

来源核验日期：2026-10-25。具体资产和支持平台以当前发行页为准。
