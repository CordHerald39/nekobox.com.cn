---
title: "Xray-core Windows 下载：核心、客户端与配置文件要分开"
category: "downloads"
label: "Windows 下载"
description: "从 Xray-core 官方仓库核对 Windows 发行资产，区分核心程序、图形客户端和配置文件用途。"
date: "2026-10-08"
updated: "2026-10-08"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 是核心项目，不等于带界面的 Windows 客户端。下载前先确认你需要的是核心、客户端还是配置文件。

## 只从原始项目进入

打开 [XTLS/Xray-core 官方仓库](https://github.com/XTLS/Xray-core)和 Releases，核对所有者、发行标签与资产名称。不要把搜索结果中的第三方整合包当作官方 Windows 下载。

## 看清资产用途

压缩包或可执行文件可能只包含核心程序；图形界面、系统托盘和配置编辑通常由其他客户端提供。先阅读 README 的运行方式，再决定是否需要单独准备客户端和配置。

## 核对系统与架构

按当前 Windows 系统和处理器架构选择资产。下载后保存发行标签与文件校验信息；项目没有明确说明的架构不要仅凭文件名猜测。

## 首次启动先用最小配置

把核心放在独立目录，使用一份可回退的最小配置启动。若需要图形客户端，可参考本站的 [v2rayN Windows 下载](/articles/v2rayn-windows-download/)理解客户端与核心的区别。

## 来源与边界

本文依据 [Xray-core 官方仓库](https://github.com/XTLS/Xray-core)与 Releases 整理，不复制具体版本号或第三方下载链接。
