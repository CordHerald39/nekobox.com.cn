---
title: "sing-box DNS 旧地址过滤迁移：Legacy 字段弃用后怎么检查"
category: "tutorials"
description: "对照 sing-box 官方 DNS Rule 与 Migration 文档，识别旧地址过滤字段的弃用状态并规划可回退迁移。"
date: "2026-11-09"
updated: "2026-11-09"
author: "NekoBox 中文指南编辑部"
draft: false
---

升级 sing-box 后，DNS 配置仍能读取但出现旧字段提示时，先核对配置用到的 Legacy Address Filter Fields。当前官方 DNS Rule 文档标记这些字段已弃用，并说明其与较新的 query type、`match_response` 规则组合存在兼容限制；应按目标版本的 Migration 文档逐项迁移，不要直接删除过滤条件。

## 先盘点旧字段和目标版本

保存当前 JSON 配置，记录核心版本与启动日志中的字段提示。对照官方文档列出的弃用字段，确认自己实际使用了哪些地址过滤项；同名字段或其他位置的配置不要仅凭名称相似就批量替换。

## 分步迁移

1. 阅读目标 sing-box 版本对应的 Migration 说明，核对旧字段的替代方式与移除版本提示。
2. 选一条规则，将地址过滤逻辑迁到官方建议的结构；若目标是检查响应记录，确认 evaluate 与 match_response 的先后关系。
3. 用配置验证工具检查 JSON 结构，再分别测试应匹配和不应匹配的域名/地址。
4. 确认 DNS 查询结果符合预期后再迁移其余规则，并保留可恢复的旧配置副本。

不要将文档中的弃用标记误读为“当前版本已经删除”，也不要仅凭配置解析成功就判定语义未变。版本边界应以你正在使用的官方发布文档为准。有关 DNS 服务字段本身的变化，另见 [sing-box DNS 服务器配置迁移](/articles/sing-box-dns-server-migration/)。

## 官方来源

- [sing-box DNS Rule](https://sing-box.sagernet.org/configuration/dns/rule/)
- [sing-box Migration](https://sing-box.sagernet.org/migration/)

来源核验日期：2026-11-09。
