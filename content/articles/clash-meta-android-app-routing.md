---
title: "Clash Meta for Android 分应用代理怎么配置"
category: "tutorials"
description: "按官方项目说明检查 Clash Meta for Android 的应用路由、VPN 权限和规则命中，定位只有部分应用走代理的问题。"
date: "2026-10-25"
updated: "2026-10-25"
author: "NekoBox 中文指南编辑部"
draft: false
---

Clash Meta for Android 的分应用代理同时受 Android VPN 权限、应用选择和规则影响。遇到浏览器正常、某个应用直连，先记录应用是否被加入代理列表，再检查配置规则，不要直接反复重装。

## 先确认系统接管

备份当前配置，记录 Android 版本、应用版本、VPN 是否已授权以及当前模式。先用一个确定会命中的域名测试，再测试目标应用，避免把应用自身联网限制误判成代理故障。

## 检查应用路由范围

在应用的 VPN 或分应用设置中确认目标应用已被选择，并确认当前配置确实由 Clash Meta for Android 使用。示例只用于说明排查顺序，不代表某个固定界面名称。若开启了仅代理选中应用，未选中的应用会保持直连；若开启排除列表，目标应用可能被明确排除。

## 用最小变化复现

1. 只保留一个目标应用，重新建立 VPN。
2. 访问一个已知会命中代理规则的地址，记录日志中的应用和域名。
3. 临时切换规则模式与全局模式做对照。
4. 恢复原设置，确认问题来自应用路由还是规则。

若 VPN 未建立，先看 [Android VPN 权限](/articles/clash-meta-android-vpn-permission/)；若配置导入有误，参考 [配置链接导入](/articles/clash-meta-android-profile-link/)。

## 官方来源

- [Clash Meta for Android 官方仓库](https://github.com/MetaCubeX/ClashMetaForAndroid)

来源核验日期：2026-10-25。本文不声称所有 Android 版本的系统设置名称完全相同。
