---
title: "sing-box client_subnet：限定 DNS 查询的 ECS 配置与验证"
category: "tutorials"
description: "依据 sing-box 官方 DNS 规则动作文档说明 client_subnet 的前缀格式、覆盖关系与移除选项，限定域名完成 ECS 查询对照，避免把返回地址变化误判为代理出口变化。"
date: "2026-10-22"
updated: "2026-10-22"
author: "NekoBox 中文指南编辑部"
draft: false
---

sing-box 的 client_subnet 会给 DNS 查询添加指定地址前缀的 EDNS Client Subnet 信息。需要检查解析结果是否受 ECS 影响时，可以在一条限定范围的 DNS 规则上做对照；它不会把连接出口改成该前缀，也不能保证解析服务器一定返回某个地区的地址。

## 前缀填写与覆盖关系

官方 DNS Rule Action 文档说明，`client_subnet` 添加带指定 IP 前缀的 `edns0-subnet` OPT 额外记录。若只填写一个 IP 地址，IPv4 自动补 `/32`，IPv6 自动补 `/128`。填写前要确认希望传递的范围，不要把完整地址与网段当成相同粒度。

DNS 规则动作中的该字段会覆盖全局 `dns.client_subnet`。因此排查时应同时看全局与命中规则，只改全局设置可能被规则里的值覆盖。字段放错到连接路由的 `route.rules` 中，也不能按本文解释为 DNS ECS 设置。

下面只展示规则动作内的 JSON 属性。地址来自文档示例用途的保留网段，仅用于说明前缀格式，不是对实际网络的配置推荐；保留现有规则匹配条件、`action` 和有效的 `server` 标签。

```json
{
  "client_subnet": "192.0.2.0/24"
}
```

实际使用时应换成自己明确选择、允许向解析服务传递的前缀。不要把不清楚归属的真实用户完整地址直接写入公开配置。

## 把试验限制在一个解析规则中

1. 备份实际加载的配置，记录核心版本、全局 `dns.client_subnet` 和当前规则中的值。
2. 选择一条已有、限定目标域名的 DNS `route` 规则，确认其 `server` 标签有效，暂不更换上游。
3. 保存未修改时同一域名、同一查询类型的响应和时间，注明缓存情况。
4. 在副本中仅增加或修改 `client_subnet`，完成当前核心的配置检查后重载。
5. 重复查询相同目标，再用未命中该规则的目标作对照，核对响应地址与规则范围。

相同地址并不能证明 ECS 没有附加，上游可能忽略 ECS，或不同前缀仍得到同一答案；不同地址也可能来自缓存与上游调度。需要确认字段是否发出时，应在有权限的测试环境检查对应 DNS 请求，不能仅靠网页显示的出口位置推断。

## 移除选项要先检查版本

当前官方文档另列 `remove_client_subnet`，标记自 sing-box 1.14.0 起提供。它移除查询里的 ECS 记录，并抑制全局 `dns.client_subnet`，与 `client_subnet` 冲突。该版本标记是字段兼容说明，不代表本文声称它是当前最新发行版。

如果实际核心不支持该选项，不要直接复制；也不要在同一动作里同时填写移除与指定前缀。需要回退本次试验时，先恢复备份中原有的规则字段，再核对全局设置仍然是什么，避免误以为删除规则属性就一定没有 ECS。

## 验收以解析记录为准

保留修改前后同类查询的结果、规则命中与缓存条件，再单独验证应用新连接。ECS 影响的是 DNS 查询附带的信息，不能代替代理节点选择，也没有统一的速度或地区分配保证。

规则动作边界可参考 [rewrite_ttl 配置检查](/articles/sing-box-dns-rewrite-ttl-check/)；服务器结构调整见 [sing-box DNS 配置迁移](/articles/sing-box-dns-server-migration/)。软件来源见 [sing-box 独立页面](/software/sing-box-android/)。

## 官方来源

- [sing-box DNS Rule Action：client_subnet 与 remove_client_subnet](https://sing-box.sagernet.org/configuration/dns/rule_action/)

来源核验日期：2026-10-22。本文没有提供特定解析服务的地区效果或性能实测结论。
