---
title: "NekoBox Android 配置导出：迁移前如何备份与核对"
category: "tutorials"
description: "依据 NekoBoxForAndroid 官方项目说明，整理配置导出、敏感字段保护与迁移后的核对步骤。"
date: "2026-11-07"
updated: "2026-11-07"
author: "NekoBox 中文指南编辑部"
draft: false
---

NekoBox Android 需要更换设备或重装时，先导出可迁移的配置并确认敏感字段的保存位置。导出文件只用于受控迁移，不要上传到公开仓库。

## 先确认配置边界

先在当前版本记录应用版本和配置名称，再导出配置文件；迁移到新设备后逐项核对服务器、规则和 VPN 权限。不同版本的字段可能变化，导入后应重新检查并建立一条最小连接。

## 验证与回滚

1. 备份当前配置并记录核心版本和错误时间。
2. 运行官方配置检查命令，确认字段结构和引用对象。
3. 建立一次新的最小连接，按日志阶段区分解析、监听、握手和路由问题。
4. 一次只改一个变量，验证后保留可回滚副本。

不要把真实订阅、密码、令牌或密钥写入公开日志。可继续阅读 [nekobox-update-backup](/articles/nekobox-update-backup/) 与 [nekobox-migration](/articles/nekobox-migration/)。

## 官方来源

- [官方文档](https://github.com/MatsuriDayo/NekoBoxForAndroid)

来源核验日期：2026-11-07。
