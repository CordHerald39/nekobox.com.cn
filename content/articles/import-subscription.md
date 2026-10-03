---
title: "NekoBox 配置导入前，先确认订阅格式"
category: "tutorials"
description: "先判断 NekoBox 订阅返回的是节点列表、分享链接还是完整配置，再选择对应导入方式；操作步骤另见导入教程。"
date: "2026-09-19"
updated: "2026-10-03"
author: "NekoBox 中文指南编辑部"
draft: false
image: "/images/import-subscription.svg"
imageAlt: "NekoBox 配置导入前，先确认订阅格式的四步判断流程示意图"
---
<figure><img src="/images/import-subscription.svg" alt="NekoBox 配置导入前，先确认订阅格式的四步判断流程示意图" width="1200" height="630"><figcaption>原创流程示意图：用于解释判断顺序，非软件界面截图。</figcaption></figure>


## 确认输入是什么

链接可能返回节点列表、客户端专用配置或网页。先向提供方确认适配 NekoBox 的格式，不要仅根据链接后缀判断。

## 按支持方式导入

查看当前版本文档，使用受支持的导入方式。解析失败时保留错误信息，不把完整订阅地址公开给第三方转换站。

## 验证 VPN 状态

选择配置后按 Android 提示处理 VPN 授权。系统 VPN 已启动仍不代表每个应用都按预期路由，需要单独验证目标应用。

## 参考来源

- [原始项目仓库](https://github.com/MatsuriDayo/NekoBoxForAndroid)
- [开发者下载文档](https://matsuridayo.github.io/download/)

## 确认格式后进入操作步骤

本文负责判断输入类型；新增分组、字段核对与连接验证见[NekoBox 订阅导入教程](/articles/nekobox-formats/)。更新失败见[订阅更新排查](/articles/nekobox-subscription-update-failed/)。
