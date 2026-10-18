---
title: "sing-box route final：默认出站与规则未命中排查"
category: "tutorials"
description: "依据 sing-box 官方 route 文档设置 final 默认出站，定位规则未命中、解析器选择和连接失败。"
date: "2026-10-18"
updated: "2026-10-18"
author: "NekoBox 中文指南编辑部"
draft: false
---

route.final 用于指定没有匹配到其他规则时的默认出站。它不能替代规则顺序，也不会自动修复 DNS 或节点问题。

## 实操步骤

1. 列出所有 outbound 标签，确认目标标签确实存在。
2. 在副本中设置 route.final，运行 sing-box check 检查 JSON 和引用。
3. 用一个明确命中规则的域名和一个故意不命中的域名分别发起请求。
4. 查看日志确认后者走 final，若连接失败再单独检查该出站的拨号和 TLS。

如果 final 标签拼写错误，配置可能在启动阶段失败。修改前保留上一份可启动配置。

继续阅读：[Xray-core 路由规则](/articles/xray-core-routing-rules/) · [sing-box SOCKS 出站配置](/articles/sing-box-socks-outbound-config/)

官方来源：[sing-box route](https://sing-box.sagernet.org/configuration/route/)

来源核验日期：2026-10-18。
