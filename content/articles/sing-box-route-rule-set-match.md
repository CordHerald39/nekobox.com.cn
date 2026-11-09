---
title: "sing-box route rule_set：规则集匹配与出站关联"
category: "tutorials"
description: "参考 sing-box 官方 Route Rule 与 Rule Set 文档，检查 rule_set 标签引用、匹配顺序和出站结果。"
date: "2026-11-09"
updated: "2026-11-09"
author: "NekoBox 中文指南编辑部"
draft: false
---

想让一组域名或网段统一进入代理时，sing-box route rule 可以按 `rule_set` 匹配。规则集是配置中的独立对象，路由规则引用的是它的标签；标签缺失、规则类型不符或前面已有宽泛规则，都可能让流量没有按预期分流。

## 核对规则集引用

先检查 rule set 对象是否存在、tag 是否唯一，并确认其 source/format 与实际文件相符。route rule 中引用的标签必须与定义一致；远程规则集还需核对下载地址、格式和本机可访问性。

## 验收分流路径

1. 备份配置，记录一个预期命中规则集的域名和一个不应命中的对照域名。
2. 确认对应 route rule 引用了正确的 rule_set，并指向已定义的出站。
3. 检查规则前后顺序，避免通用域名或网络条件先截获目标流量。
4. 重载后用日志或当前客户端的连接信息分别确认两条连接最终选择的出站；不能只以配置校验通过推断实际命中。

规则集更新失败和规则集匹配失败是两个不同问题：前者检查获取/解析，后者检查标签、条件与出站。可先看 [sing-box 规则集更新失败](/articles/sing-box-rule-set-update-failed/)；若问题在嗅探后的域名判断，参阅 [sing-box route sniff 规则](/articles/sing-box-route-sniff-action/)。

## 官方来源

- [sing-box Route Rule](https://sing-box.sagernet.org/configuration/route/rule/)
- [sing-box Rule Set](https://sing-box.sagernet.org/configuration/rule-set/)

来源核验日期：2026-11-09。
