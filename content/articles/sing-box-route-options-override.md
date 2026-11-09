---
title: "sing-box route-options：覆盖连接目标地址和端口"
category: "tutorials"
description: "基于 sing-box Route Rule Action 文档，解释 route-options 的目标地址/端口覆盖边界与验证步骤。"
date: "2026-11-09"
updated: "2026-11-09"
author: "NekoBox 中文指南编辑部"
draft: false
---

连接需要在路由阶段改写目标地址或端口时，sing-box 的 `route-options` action 提供相应选项。它用于设置路由选项，不等于把流量改送到另一个代理节点；若覆盖结果与预期不符，应分别检查规则是否命中、目标字段是否正确以及选出的出站行为。

## 确认是否需要覆盖

先记录连接原目标、预期目标和触发该规则的条件。若问题只是选错出站，应该检查 route action/outbound，而不是重写地址；若目标本身需要覆盖，再确认地址和端口是否来自可信配置。

## 逐项验收

1. 阅读当前版本官方 route-options 字段说明，确认 `override_address` 与 `override_port` 的配置位置。
2. 让规则只匹配一个测试目标，并先设置一个覆盖字段，减少变量。
3. 检查 sing-box 日志与接收端观察到的实际连接目的地，不以 DNS 查询结果代替连接验证。
4. 再测试端口覆盖；必要时恢复原目标，并确认其他匹配请求未被该规则改变。

官方文档说明 route-options 还包含与拨号相关的选项，这些选项有各自适用条件。不要将某一字段的成功配置推广成所有出站都支持。其他路由分流问题可参阅 [sing-box route final](/articles/sing-box-route-final-action/) 和 [sing-box route sniff 规则](/articles/sing-box-route-sniff-action/)。

## 官方来源

- [sing-box Route Rule Action](https://sing-box.sagernet.org/configuration/route/rule_action/)

来源核验日期：2026-11-09。
