---
title: "NekoBox 开启 VPN 后访问不了 NAS：局域网绕过分层检查"
category: tutorials
label: "专题指南"
description: "区分 NekoBox 的 VPN 层绕过与 Core 层绕过，用局域网 IP、域名和设备发现分别验证 NAS、路由器及打印机访问。"
date: "2026-10-04"
updated: "2026-10-04"
author: "NekoBox 中文指南编辑部"
draft: false
image: "/images/nekobox-lan-access.svg"
imageAlt: "NekoBox 开启 VPN 后访问不了 NAS：局域网绕过分层检查的检查流程示意，非软件截图"
---

手机打开 NekoBox 后访问不了 NAS，先把“直接访问设备地址”和“自动发现设备”分开。浏览器访问 NAS 的局域网 IP 失败，与打印应用搜索不到设备，可能不是同一类问题。本页针对 NekoBox for Android 1.4.2 的两个局域网绕过层级。

## VPN 层与 Core 层处理的位置不同

VPN 层绕过决定哪些目标网络进入 VPN；Core 层绕过则是在流量已经进入内核后改变处理路径。项目的[VPN 路由构建源码](https://github.com/MatsuriDayo/NekoBoxForAndroid/blob/5768494d8ae3c74a057bb6d46c0f8dc071b0d821/app/src/main/java/io/nekohasekai/sagernet/bg/VpnService.kt)和[内核规则生成源码](https://github.com/MatsuriDayo/NekoBoxForAndroid/blob/5768494d8ae3c74a057bb6d46c0f8dc071b0d821/app/src/main/java/io/nekohasekai/sagernet/fmt/ConfigBuilder.kt)分别对应这两个位置。

![VPN 层与 Core 层局域网检查示意，非软件截图](/images/nekobox-lan-access.svg)

界面上两个选项都包含“绕过”，不代表同时开启就一定有效。开发者文档还提到部分系统的 VPN 热点场景存在不同要求。普通手机连接家庭 Wi-Fi 的验证结果，不能直接推导到热点共享。

## 用一个你管理的设备建立对照

准备 NAS 或路由器的实际局域网地址，确认手机和设备在可以互访的网络中。访客 Wi-Fi、AP 隔离或不同网段可能本来就不允许通信；不要为了排查代理去关闭整个网络的隔离保护。

1. 关闭 VPN 时，用浏览器访问该设备的已知管理地址，记录成功或错误。
2. 打开原来的 NekoBox 配置，访问相同地址，保留时间与错误。
3. 如果只有打开 VPN 后失败，保存原设置后，仅调整一个局域网绕过选项。
4. 重新建立 VPN 连接，再用同一地址访问，记录是否恢复。
5. 最后还原选项，检查结果能否重现。

以上是建议的单项对照，并非实测保证。已经无法直连的设备，应先解决本地网络或设备服务的问题。

## 将三种观察分别记录

| 测试对象 | 关注点 |
| --- | --- |
| 设备的局域网 IP | 是否能建立到设备服务的连接 |
| 设备的本地域名 | 与 IP 结果比较，识别名称解析差异 |
| 应用的自动搜索 | 设备发现过程可能有额外网络条件，不能只靠网页访问判断 |

IP 可访问但域名失败时，再进入[DNS 排查](/articles/nekobox-dns-troubleshooting/)，不要反复调整路由。浏览器能访问但打印应用搜不到设备时，记录应用名称与搜索方式，核对设备和应用的局域网发现要求。

## 回退与热点边界

恢复原选项后重新连接 VPN。若使用 LineageOS 一类系统的 VPN 热点功能，先阅读开发者相应说明，再按热点场景独立验证。本文不提供让其他设备共享代理的通用配置，也不保证组播发现可用。

## 来源与核验状态

2026-10-04 核对[开发者局域网绕过说明](https://matsuridayo.github.io/nb4a-configuration/)、上述 1.4.2 两层路由源码。未进行 NAS、打印机或热点实测。反馈时使用设备代号，隐藏内网拓扑、管理账号和公开地址；保留访问方式、VPN 状态与前后结果即可。

