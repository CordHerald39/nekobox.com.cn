---
title: "sing-box Linux 安装与首次启动检查"
category: "downloads"
description: "从 sing-box 官方发行页选择 Linux 架构包，完成解压、权限与配置校验，避免把下载成功误认为服务已启动。"
date: "2026-10-25"
updated: "2026-10-25"
author: "NekoBox 中文指南编辑部"
draft: false
---

sing-box Linux 安装需要同时确认 CPU 架构、文件权限和配置格式。下载后先校验文件来源与架构，再运行官方检查命令；不要把示例路径或版本号当成当前发行版承诺。

## 选择官方发行包

打开官方 GitHub Releases，按系统架构选择对应 Linux 压缩包。记录发行页 URL、文件名和本机架构，保留校验信息。发行页中的具体版本会变化，本文不复制固定版本号。

## 解压并验证可执行文件

将文件解压到用户可写目录，赋予可执行权限后运行版本检查。若系统提示架构不匹配，重新选择 arm64、amd64 等对应包，不要用重命名掩盖错误。

## 检查配置再启动

1. 先准备最小配置并确认 JSON 语法。
2. 使用当前版本支持的 `sing-box check` 检查配置。
3. 前台启动并观察日志，再交给 systemd 或其他进程管理器。
4. 记录监听端口，确认没有旧进程占用。

需要迁移配置时可参考 [sing-box 配置迁移](/articles/sing-box-config-migration/)，DNS 问题可对照 [DNS 服务器迁移](/articles/sing-box-dns-server-migration/)。

## 官方来源

- [sing-box 官方 Releases](https://github.com/SagerNet/sing-box/releases)
- [sing-box 官方文档](https://sing-box.sagernet.org/)

来源核验日期：2026-10-25。具体版本和依赖以发行页为准。
