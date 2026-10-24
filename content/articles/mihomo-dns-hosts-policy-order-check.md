---
title: "mihomo DNS hosts 与 nameserver-policy：顺序排查"
category: "tutorials"
description: "拆分 mihomo hosts、nameserver-policy 和缓存来源，定位同一域名返回不同地址的问题。"
date: "2026-10-24"
updated: "2026-10-24"
author: "NekoBox 中文指南编辑部"
draft: false
---

mihomo 同时配置 hosts 和 nameserver-policy 时，排查重点是“哪一层先提供结果”。同一域名在不同设备上地址不同，可能来自 hosts 映射、精确域名策略、通配符策略或上游缓存。本文把这些来源拆开检查，避免直接复制整段 DNS 示例覆盖现有配置。

## 建立可比较的记录

先备份配置，记录域名、查询类型、hosts 条目、nameserver-policy 键和实际 nameserver。对同一域名在开启与关闭 hosts 的配置副本中分别查询，保存返回地址及时间。不要把浏览器缓存、代理节点缓存与核心 DNS 结果混为一谈。

## 检查精确键与通配符

根据 mihomo 官方 DNS 文档，策略可以按域名匹配。保留已有列表，仅增加一条可回滚的测试项：

```yaml
dns:
  use-hosts: true
  nameserver-policy:
    '+.example.test': [8.8.8.8]
```

地址仅用于说明格式，不能视为当前网络推荐。精确域名与通配符的优先关系应以当前文档和核心实际输出为准；不要因为名称相似就认定某个键覆盖另一个键。若 hosts 已给出固定地址，策略是否继续参与要通过对照查询验证。

## 一次只改一个层级

1. 运行配置检查并确认合并后的 DNS 结构。
2. 先保留 hosts，只观察一个域名的结果。
3. 再临时移除该 hosts 项，重复查询以确认策略路径。
4. 最后恢复原值或留下明确记录，并清理测试条目。

若地址变化符合预期但连接仍失败，继续看 [DNS respect-rules](/articles/mihomo-dns-respect-rules-bootstrap/)；若节点域名解析失败，查看 [proxy-server-nameserver](/articles/mihomo-dns-proxy-server-nameserver-check/)。想确认缓存影响时，参考 [DNS cache-algorithm](/articles/mihomo-dns-cache-algorithm-check/)。

## 官方来源

- [mihomo DNS 配置](https://wiki.metacubex.one/config/dns/)

来源核验日期：2026-10-24。本文只整理配置排查步骤，没有宣称某个公共 DNS 一定可用。
