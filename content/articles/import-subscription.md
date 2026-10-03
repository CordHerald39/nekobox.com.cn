---
title: "NekoBox 配置导入前，先确认订阅格式"
category: "tutorials"
description: "区分 NekoBox 订阅 URL、单节点分享链接、二维码和 sing-box JSON 文件，确认输入类型后进入对应导入步骤。"
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

## 订阅 URL、分享链接和 JSON 文件怎么判断？

| 手里的内容 | 先检查什么 | 下一步 |
| --- | --- | --- |
| 订阅 URL | `https://` 只是网址形式；向提供方确认返回节点订阅，而非登录页或账户页面，并确认支持的格式 | [订阅分组与导入步骤](/articles/nekobox-formats/) |
| 单节点分享链接 | `ss://`、`vmess://`、`vless://`、`trojan://` 等通常描述节点；仍需核对协议与字段兼容性 | [节点字段核对](/articles/nekobox-formats/) |
| 二维码 | 先在本机查看它承载的是订阅 URL 还是单节点分享链接；二维码本身不决定配置类型 | 按识别到的内容进入[导入教程](/articles/nekobox-formats/) |
| sing-box JSON 文件 | `.json` 后缀不足以判断用途；向提供方确认是完整配置、单个出站还是配置片段 | [自定义配置与 GUI 的区别](/articles/nekobox-formats/) |

[官方 Android 配置说明](https://matsuridayo.github.io/nb4a-configuration/)分别说明了分享链接、文件导入和自定义配置；[项目 README](https://github.com/MatsuriDayo/NekoBoxForAndroid)明确订阅只解析节点。`sn://` 是内部分享格式，不能据此假定其他软件或不同版本的备份可直接读取。

确认类型时只需在本机检查，或向提供方询问格式名称；不要公开完整订阅 URL、二维码、UUID、密码或密钥。排错截图也应遮去这些内容。

## 按支持方式导入

查看当前版本文档，使用受支持的导入方式。解析失败时保留错误信息，不把完整订阅地址公开给第三方转换站。

## 验证 VPN 状态

选择配置后按 Android 提示处理 VPN 授权。系统 VPN 已启动仍不代表每个应用都按预期路由，需要单独验证目标应用。

## 参考来源

本文于 2026-10-03 复核官方说明；内容是输入判断指引，未做 Android 设备实测。

- [原始项目仓库](https://github.com/MatsuriDayo/NekoBoxForAndroid)
- [开发者下载文档](https://matsuridayo.github.io/download/)

## 确认格式后进入操作步骤

本文负责判断输入类型；新增分组、字段核对与连接验证见[NekoBox 订阅导入教程](/articles/nekobox-formats/)。更新失败见[订阅更新排查](/articles/nekobox-subscription-update-failed/)。
