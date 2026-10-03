---
title: "NekoBox 某个应用无法联网：分应用与 VPN 检查"
category: "tutorials"
description: "按 NekoBox 已连接但无法上网、延迟正常不能用、单个 App 失败、订阅更新失败或锁屏断连，选择对应排查入口。"
date: "2026-09-19"
updated: "2026-10-03"
author: "NekoBox 中文指南编辑部"
draft: false
image: "/images/troubleshooting.svg"
imageAlt: "NekoBox 某个应用无法联网：分应用与 VPN 检查的四步判断流程示意图"
---
<figure><img src="/images/troubleshooting.svg" alt="NekoBox 某个应用无法联网：分应用与 VPN 检查的四步判断流程示意图" width="1200" height="630"><figcaption>原创流程示意图：用于解释判断顺序，非软件界面截图。</figcaption></figure>


## 确定影响范围

分别测试浏览器和目标应用。如果只有一个应用异常，重点查看应用路由和该应用自身的网络行为。

## NekoBox 已连接但无法上网：先选症状

“已连接”提示只能作为一项状态记录，不能代替目标应用的实际请求。保持节点和网络不变，先用浏览器及目标 App 请求同一个确定的目标，再记录失败阶段。

| 症状 | 首先区分 | 对应排查 |
| --- | --- | --- |
| 已连接但无法上网，多个应用都失败 | 系统 VPN 是否由 NekoBox 接管；日志报解析错误还是连接错误 | [VPN 与应用接管检查](/articles/nekobox-app-routing/)；有解析错误再看[DNS 排查](/articles/nekobox-dns-troubleshooting/) |
| 延迟正常不能用 | 测试类型与实际访问不同，延迟结果不能证明目标域名和应用路由可用 | [DNS 与请求路径对照](/articles/nekobox-dns-troubleshooting/) |
| 只有某个 App 失败 | 同一网络下浏览器能用，目标 App 是否在预期接管列表、命中哪条规则 | [分应用代理与路由验证](/articles/nekobox-app-routing/) |
| 订阅更新失败 | 请求没取到内容、格式解析失败，还是更新后节点改变 | [订阅更新失败专页](/articles/nekobox-subscription-update-failed/)；类型不明先看[输入判断](/articles/import-subscription/) |
| 锁屏断连或切换网络后失效 | VPN 状态消失、进程停止，还是仍连接但请求失败 | [后台断连专页](/articles/nekobox-background-disconnect/) |

这些入口用来缩小范围，不保证一种设置能修复所有故障。更新失败不必先改 DNS，单个应用失败也不必重装全部配置。

## 为什么延迟正常，应用仍然不能用？

[官方路由与 DNS 说明](https://matsuridayo.github.io/nb4a-route/)指出，Ping / URL Test 使用系统 DNS 解析节点域名；这与目标应用访问目标域名的路径未必相同。应把测试类型、目标请求、VPN 状态和同一时刻日志放在一起判断，不仅看一个延迟数字。

## 检查接管范围

阅读当前配置的应用规则，确认目标应用是否包含在预期的代理或绕过列表中。不要同时修改节点、DNS 和全部路由。

[官方 Android 配置说明](https://matsuridayo.github.io/nb4a-configuration/)区分了应用是否由 VPN 接管，以及接管后流量如何路由。若日志报 TLS 或证书错误，先核对服务方给出的参数与 SNI；不要把关闭证书验证当作通用修复。

## 记录可复现条件

记录 Android 版本、客户端版本、网络类型与错误时间。提供日志前删去账号、订阅与节点凭据。

## 参考来源

本文于 2026-10-03 复核官方配置、路由与 FAQ 文档，整理症状入口；未在 Android 设备上实测上述故障或声称修复成功。[官方 FAQ](https://matsuridayo.github.io/nb4a-faq/)提供问题复现和日志反馈说明。

- [原始项目仓库](https://github.com/MatsuriDayo/NekoBoxForAndroid)
- [开发者下载文档](https://matsuridayo.github.io/download/)
