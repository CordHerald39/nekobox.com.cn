---
title: "Xray-core Linux 下载：发行资产、架构与首次校验"
category: "downloads"
description: "从 Xray-core 官方 Releases 选择 Linux 发行资产，核对架构与校验信息，再用本地命令确认文件可执行。"
date: "2026-10-10"
updated: "2026-10-10"
author: "NekoBox 中文指南编辑部"
draft: false
---

Linux 上安装 Xray-core，先确认发行资产和 CPU 架构，再处理权限与配置。下载页面的 Source code 压缩包不是面向普通运行的预编译程序。

## 选择官方发行页

从 [Xray-core 官方仓库](https://github.com/XTLS/Xray-core)进入 Releases，记录发行标签和资产完整名称。用 `uname -m` 记录本机架构，再按发行说明选择匹配的 Linux 文件；不要把 Windows 资产改名后运行。

## 解压与权限检查

将文件解压到自己有权限管理的目录，确认主程序存在并添加执行权限：

```bash
uname -m
chmod +x xray
./xray version
```

命令输出只用于确认当前文件与版本。若系统提示架构不匹配或缺少依赖，先回到发行说明核对资产，不要连续下载不同来源的镜像。

## 配置前先做校验

准备配置副本后使用 [Xray-core 配置校验说明](/articles/xray-core-config-test/)检查 JSON、路径和引用。核心能输出版本不代表配置、监听端口或远端连接都可用。

## 记录回退点

保存发行标签、资产名称、下载来源和本地校验结果。升级前保留旧程序与配置副本，确认新版本能启动并完成最小连接测试后再清理。

## 官方来源与核验日期

- [Xray-core 官方仓库与 Releases](https://github.com/XTLS/Xray-core/releases)

来源核验日期：2026-10-10。资产命名、系统要求和发行说明以当前 Release 为准。
