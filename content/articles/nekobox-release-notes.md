---
title: "NekoBox 版本更新记录：1.4.2 与 APK 核验"
category: tutorials
description: "记录 NekoBox 1.4.2 正式发行日期、四种 APK、sing-box 核心与订阅覆写变更，提供开发者原始发行链接。"
date: "2026-10-03"
updated: "2026-10-03"
author: "NekoBox 中文指南编辑部"
draft: false
image: "/images/nekobox-release-notes.svg"
imageAlt: "NekoBox 版本更新记录：1.4.2 与 APK 核验的四步判断流程示意图"
---
<figure><img src="/images/nekobox-release-notes.svg" alt="NekoBox 版本更新记录：1.4.2 与 APK 核验的四步判断流程示意图" width="1200" height="630"><figcaption>原创流程示意图：用于解释判断顺序，非软件界面截图。</figcaption></figure>


## 当前正式发行

2026 年 10 月 3 日通过开发者 GitHub Releases API 核对，最新正式标签为 **1.4.2**，发布时间为 **2026 年 2 月 9 日**。这里记录的是核对当日的发行状态，不用本站编辑日期冒充软件发布日期。

## 1.4.2 的主要变更

开发者发行说明列出核心升级至 sing-box 1.12.19-neko-1、订阅更新时的配置覆写重构，以及直连订阅请求优化。更新覆写保留本地自定义 JSON，其他字段遵循订阅。遇到更新后参数变化时，应比较订阅与本地覆写，参阅[订阅更新排查](/articles/nekobox-subscription-update-failed/)。

## 安装与升级路径

正式附件共有 arm64-v8a、armeabi-v7a、x86、x86_64 四种 APK；准确文件名、字节数与 SHA256 见[Android 下载页](/software/nekobox-android/)。升级前导出已有配置，保留备份，阅读发行说明。旧版回退前确认备份兼容性，不在没有备份时卸载。

开发者说明此项目较少维护，不接受功能请求。选择软件时同时考虑自己的配置类型和维护需求；桌面 NekoRay 与 Android 项目分开讨论，不把历史桌面版本当作该 APK 的电脑版。

## 更新记录来源

- [1.4.2 原始发行说明](https://github.com/MatsuriDayo/NekoBoxForAndroid/releases/tag/1.4.2)
- [全部正式与测试发行](https://github.com/MatsuriDayo/NekoBoxForAndroid/releases)
- [原始项目 README](https://github.com/MatsuriDayo/NekoBoxForAndroid)
