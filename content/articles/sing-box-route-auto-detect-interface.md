---
title: "sing-box auto_detect_interface：路由回环与默认出站检查"
category: "tutorials"
description: "依据 sing-box 官方 route 文档检查 auto_detect_interface，避免透明代理场景中的回环、错误网卡和默认出站问题。"
date: "2026-10-19"
updated: "2026-10-19"
author: "NekoBox 中文指南编辑部"
draft: false
---

透明代理或 TUN 场景中，核心需要知道应使用哪张网卡拨号。auto_detect_interface 可以帮助选择默认接口，但启用后仍要验证路由和出站结果。

## 安全地做一次验证

1. 复制完整配置并记录现有 route 与 outbound。
2. 按当前 sing-box 版本文档加入 auto_detect_interface，先运行配置检查。
3. 启动测试配置，确认没有默认接口和权限错误。
4. 对直连域名和代理域名各发起一次新请求，检查实际出站标签。

若请求回到本机监听端口，先暂时恢复备份并检查 route.final、入站监听和排除规则。不要同时修改多个出站或系统路由，否则无法判断是哪一项造成回环。

可结合 [sing-box route final](/articles/sing-box-route-final-action/) 和 [sing-box TUN 入站配置](/articles/sing-box-tun-inbound-config/) 排查。

## 官方来源

[sing-box route 配置](https://sing-box.sagernet.org/configuration/route/)

来源核验日期：2026-10-19。
