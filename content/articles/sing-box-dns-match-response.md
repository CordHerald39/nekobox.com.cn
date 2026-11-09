---
title: "sing-box DNS match_response：按上游响应条件匹配"
category: "tutorials"
description: "参照 sing-box DNS Rule 文档说明 evaluate 与 match_response 的前置关系，并给出分阶段验收步骤。"
date: "2026-11-09"
updated: "2026-11-09"
author: "NekoBox 中文指南编辑部"
draft: false
---

需要根据 DNS 响应码或返回记录继续处理时，sing-box DNS Rule 提供 `match_response` 相关匹配字段。它不是对任意上游响应的全局监听：官方文档要求先由 `evaluate` action 填充待匹配的响应，再由后续规则检查响应字段。

## 区分请求匹配与响应匹配

普通 DNS 条件（如域名和 query type）检查的是查询请求；响应条件检查的是已经取得的答案。若没有前置 evaluate，响应匹配缺少评估对象，因此应先确认规则链中的 action 顺序。

## 分阶段排查

1. 先保留原 DNS 配置，并确认 sing-box 版本支持所用字段。
2. 在官方文档允许的场景配置 `evaluate`，再设置 `match_response` 和需要检查的响应字段。
3. 用可控域名分别触发预期和非预期响应，确认 evaluate 确实先执行，且后续匹配走到正确分支。
4. 同时记录响应码与答案变化；若只测试一个域名或一次查询，不要推断其余上游都会相同。

该能力与 DNS Rule Action 中直接选择服务器、改写结果或返回预定义结果的用途不同。先明确要判断的是“请求条件”还是“响应条件”，再选择规则。基础字段说明见 [sing-box DNS Rule](https://sing-box.sagernet.org/configuration/dns/rule/)，常见缓存设置可对照 [sing-box DNS cache_capacity](/articles/sing-box-dns-cache-capacity/)。

## 官方来源

- [sing-box DNS Rule](https://sing-box.sagernet.org/configuration/dns/rule/)
- [sing-box DNS Rule Action](https://sing-box.sagernet.org/configuration/dns/rule_action/)

来源核验日期：2026-11-09。
