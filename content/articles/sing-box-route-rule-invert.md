---
title: "sing-box route rule invert：反向条件排除怎么验收"
category: "tutorials"
description: "依据 sing-box Route Rule 文档核对 invert 的适用范围、组合条件与命中结果，避免把排除规则放错位置。"
date: "2026-11-09"
updated: "2026-11-09"
author: "NekoBox 中文指南编辑部"
draft: false
---

一条 route rule 的条件方向需要反转时，可检查 sing-box Route Rule 的 `invert`。它改变该规则条件的判断方向，并不自动创建一个“绕过代理”的出站；实际流量仍由匹配后的 action 和后续路由规则决定。

## 先写清预期集合

列出应命中的请求和应排除的请求，至少各选一条可重复的测试连接。若规则含多个字段或逻辑规则，先确认这些条件的组合方式，再决定反转整个条件是否符合预期。

## 配置顺序与测试

1. 将 `invert` 放在对应规则上，不要误加到逻辑规则的其他层级。
2. 明确该规则匹配后执行的 action；需要直连时应指向已定义的 direct 出站。
3. 检查它前面的规则是否已经命中，以及目标是否会被更早的宽泛规则截走。
4. 对照正向条件、反向条件两组请求查看连接日志。若结果相反，先去掉 `invert` 单独验证基础条件，再恢复并复测。

反向条件适合表达一个明确的例外集合，不适合用来掩盖含义不清的宽泛规则。若目标是组合多个条件，可参阅 [sing-box Route Rule](https://sing-box.sagernet.org/configuration/route/rule/) 的 logical rule 说明；规则集标签问题见 [sing-box route rule_set](/articles/sing-box-route-rule-set-match/)。

## 官方来源

- [sing-box Route Rule](https://sing-box.sagernet.org/configuration/route/rule/)

来源核验日期：2026-11-09。
