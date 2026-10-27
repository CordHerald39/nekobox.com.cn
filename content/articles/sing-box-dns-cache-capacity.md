---
title: "sing-box DNS cache_capacity：缓存容量设置与命中观察"
category: "tutorials"
description: "依据 sing-box 官方 DNS 文档检查 cache_capacity，理解 1024 下限、缓存冲突项和单变量验证方法。"
date: "2026-10-26"
updated: "2026-10-26"
author: "NekoBox 中文指南编辑部"
draft: false
---

sing-box 的 `cache_capacity` 用来设置 DNS LRU 缓存容量。官方 DNS 文档标注该字段自 sing-box 1.11.0 起提供，并说明小于 1024 的值会被忽略。它只影响核心 DNS 缓存条目数量，不会替你选择 DNS 服务器，也不能直接证明解析更快。调参前要固定网络、查询域名和规则条件。

## 记录基线并确认版本

保存当前配置和运行日志，记录 sing-box 版本、DNS server 标签、`disable_cache`、`disable_expire`、`optimistic`，并检查实际生效 JSON。若版本早于文档注明的 1.11.0，先以当前版本校验器结果为准。

## 设置容量并避免冲突

字段位于顶层 `dns` 对象，以下片段应合并到现有配置：

```json
{
  "dns": {
    "cache_capacity": 4096
  }
}
```

示例的 4096 只是满足文档下限的演示值。`disable_cache` 会关闭 DNS 缓存，`disable_expire` 会关闭缓存过期；若它们生效，容量设置不会产生预期效果。`independent_cache` 已标记为弃用，不能替代容量参数。

## 观察命中与回滚

1. 只改 `cache_capacity`，先运行当前核心的配置检查。
2. 重载后按固定顺序查询同一批域名，分别记录首次查询、重复查询、过期后的结果和错误。
3. 观察日志中的缓存行为、服务器标签和返回地址；不要用浏览器页面加载时间单独判断命中。
4. 如果内存增长、结果异常或校验失败，恢复原值或删除该字段，再重新加载。

查询结果变化也可能来自上游 TTL 或规则。需要区分服务器缓存时，可参考 [sing-box independent_cache 检查](/articles/sing-box-dns-independent-cache-check/)；排查服务器地址和策略时看 [sing-box DNS 服务器配置迁移](/articles/sing-box-dns-server-migration/)。

## 官方来源

- [sing-box DNS 配置](https://sing-box.sagernet.org/configuration/dns/)

来源核验日期：2026-10-26。官方文档标注 `cache_capacity` 自 1.11.0 起可用，且小于 1024 的值会被忽略；本文未给出性能承诺。
