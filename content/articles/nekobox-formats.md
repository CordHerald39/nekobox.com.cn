---
title: "NekoBox 订阅导入教程：Clash Meta、sing-box JSON 与分享链接"
category: "tutorials"
label: "实用指南"
description: "区分 NekoBox for Android 的节点导入与完整自定义配置，解释格式选择、更新验证和迁移失败原因。"
date: "2026-09-19"
updated: "2026-10-03"
author: "NekoBox 中文指南编辑部"
draft: false
image: "/images/nekobox-formats.svg"
imageAlt: "NekoBox 订阅导入教程：Clash Meta、sing-box JSON 与分享链接的四步判断流程示意图"
---
<figure><img src="/images/nekobox-formats.svg" alt="NekoBox 订阅导入教程：Clash Meta、sing-box JSON 与分享链接的四步判断流程示意图" width="1200" height="630"><figcaption>原创流程示意图：用于解释判断顺序，非软件界面截图。</figcaption></figure>


> 核验日期：2026-09-19。已核对 Android 官方说明与发行资产；Android 设备尚未实测。

## 适用软件与版本基线

本文对象是 MatsuriDayo/NekoBoxForAndroid，不是桌面 NekoRay，也不是名称近似的第三方应用。2026-09-19 核对到的正式发行标签为 1.4.2，提供 arm64-v8a、armeabi-v7a、x86、x86_64 APK。不同 ABI 不能仅按文件大小选择，须对应设备架构。

## 第一步：先判断手里的内容

| 内容 | 本文建议的处理方式 |
| --- | --- |
| 服务方的 Clash Meta 订阅 | 按官方文档支持的订阅格式导入 |
| 单个标准节点分享链接 | 导入后核对节点字段，不等同于整套分流配置 |
| sing-box 完整 JSON 文件 | 先确认是否确实需要自定义配置，避免误当普通节点集合 |
| sn:// 链接 | 属于 NekoBox 内部分享格式，不保证跨版本兼容 |
| 登录页或支付链接 | 不是订阅，不应尝试改后缀导入 |

“基于 sing-box”不表示可以随意粘贴任意版本的完整配置。官方文档区分了可解析的节点格式与完整自定义配置；完整配置下，GUI 路由等功能可能不再按普通方式生效。先明确你要的是一组节点还是完整接管核心配置。

## 第二步：导入到单独测试分组

保留已有分组，在订阅 / 分组入口新增一个测试条目，名称包含来源和日期。使用对应版本提供的链接导入或文件导入方式，执行更新后检查是否出现预期节点。界面名称可能变化，先确认对象类型，不按相似图标盲点。

挑选一个节点核对协议、服务器、端口及所需传输参数。只比较名称是不够的：两个名称相同的条目可能使用不同端口或 TLS 设置。不要通过关闭证书校验来掩盖导入后的字段错误。

## 第三步：区分“导入完成”和“连接完成”

先选择节点，再启动代理并检查 Android VPN 授权。使用一个固定应用发起请求，记录错误时间和日志。节点列表有内容而访问失败时，应继续检查网络接管与路由，不必立即重新导入全部订阅。

如果从其他客户端迁移，先比较一个节点，不一次迁入全部自定义 DNS 和路由。验证通过后再逐项恢复。这样可以明确是订阅解析、节点参数还是后续策略造成差异。

## 常见失败分支

- 原订阅能下载但导入为空：核对官方格式列表，检查旧格式或非标准转换输出。
- 链接导入后字段缺失：回到服务方原始参数比较，而不是自行补一个看起来合理的 SNI。
- 新版备份无法被旧版读取：先保留原数据，用对应版本恢复；不能认定备份文件已损坏。
- 使用完整自定义 JSON 后 GUI 路由不生效：首先检查是否属于该配置模式的功能边界。

## 来源与核验记录

[官方 Android 配置说明](https://matsuridayo.github.io/nb4a-configuration/)直接支持格式、内部分享链接和自定义配置的边界；[1.4.2 发行页](https://github.com/MatsuriDayo/NekoBoxForAndroid/releases/tag/1.4.2)支持上述真实附件信息。核验日期为 2026-09-19，本站实际核对了发行清单，未在 Android 设备上安装、导入或建立 VPN。以上不是手机实测记录；补测需记录设备、Android 版本、APK、导入数量与脱敏日志。

## 导入后的下一步

还没分清输入类型时，先读[格式判断](/articles/import-subscription/)。需要限定应用范围，阅读[分应用路由](/articles/nekobox-app-routing/)。发生异常时，按[订阅更新](/articles/nekobox-subscription-update-failed/)、[DNS 解析](/articles/nekobox-dns-troubleshooting/)或[后台断连](/articles/nekobox-background-disconnect/)的症状进入排查。
