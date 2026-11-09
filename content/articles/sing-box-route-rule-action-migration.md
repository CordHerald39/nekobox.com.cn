---
title: "sing-box Route Rule action 迁移：旧规则如何逐项核对"
category: "tutorials"
description: "对照 sing-box Migration、Route Rule 与 Rule Action 文档，检查旧路由配置字段并分步验证新 action。"
date: "2026-11-09"
updated: "2026-11-09"
author: "NekoBox 中文指南编辑部"
draft: false
---

升级 sing-box 后，旧 route rule 仍能解析但匹配结果变化时，应对照官方 Migration 文档核对规则结构及 action。当前 Route Rule 将匹配条件与处理动作分别说明；旧配置字段的位置、默认值或迁移方式应以你目标版本的迁移文档为准，不要用旧示例直接覆盖新 schema。

## 先做配置盘点

保存运行中的 JSON 文件，记录目标版本以及启动日志里的弃用提示。将每条规则拆成“匹配条件”和“匹配后的动作”，标出 domain/IP、端口、rule_set 和 outbound 等引用，检查标签是否仍存在。

## 小步迁移

1. 阅读 Migration 页中对应版本段落，确认哪些字段需要移动、重命名或改变结构。
2. 选一条规则迁移，先运行官方配置检查，再用一条应匹配和一条不应匹配的请求验收。
3. 检查 action 是否与目标一致：例如选择出站、交给 DNS 模块、拒绝或覆盖路由选项属于不同处理。
4. 迁移其余规则时逐条保留旧配置副本；若结果异常，回退最近一条变更并重新定位。

不要因为配置能通过语法检查就跳过连接级验收；也不要假设 action 默认值跨版本不变。具体条件和规则集引用可参阅 [sing-box Route Rule](https://sing-box.sagernet.org/configuration/route/rule/) 与 [sing-box route rule_set](/articles/sing-box-route-rule-set-match/)。

## 官方来源

- [sing-box Migration](https://sing-box.sagernet.org/migration/)
- [sing-box Route Rule](https://sing-box.sagernet.org/configuration/route/rule/)
- [sing-box Route Rule Action](https://sing-box.sagernet.org/configuration/route/rule_action/)

来源核验日期：2026-11-09。
