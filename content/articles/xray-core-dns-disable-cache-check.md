---
title: "Xray-core DNS disableCache：缓存开关与旧结果排查"
category: "tutorials"
description: "依据 Xray 官方 DNS 文档检查 disableCache，区分核心缓存、上游响应与 hosts 影响。"
date: "2026-10-24"
updated: "2026-10-24"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 的 DNS 查询结果可能受到内置缓存影响。官方 DNS 配置中的 disableCache 用于控制缓存行为。遇到刚改 hosts、服务器或策略后仍得到旧地址时，应先确认是否命中了缓存，再决定是否需要调整查询链路。关闭缓存会改变查询行为，不能当作通用加速开关。

## 区分缓存与上游错误

保存原配置，记录域名、查询类型、DNS server、返回地址和时间。连续得到相同旧结果，可能是核心缓存，也可能是上游服务器仍返回旧记录。先在相同网络条件下用独立 DNS 工具做对照，避免把上游问题误判为 Xray 缓存。

## 检查 disableCache 所在位置

按 Xray 官方 DNS 文档核对 `dns` 对象中的字段和当前核心版本支持范围。示例只展示说明性结构：

```json
{
  "dns": {
    "servers": ["https://dns.example/"],
    "disableCache": true
  }
}
```

示例中的地址是占位值，不是下载或公共服务推荐。不要把订阅凭据写入 DNS URL。字段位置、大小写和布尔值必须与当前版本校验器一致；若版本不识别该字段，应以校验错误为准，不要强行保留。

## 建立可回退的对照

1. 复制配置并运行当前 Xray 的配置测试。
2. 只切换 disableCache，重启或重载后发起全新的 DNS 查询。
3. 连续测试同一域名，再与原配置结果比较。
4. 若地址仍旧，检查 DNS server、hosts 和路由；若变化可重复，再评估是否长期使用。

缓存关闭后查询次数可能增加，移动网络或受限网络下表现不同。连接故障仍需看 [Xray DNS queryStrategy](/articles/xray-core-dns-query-strategy/) 和 [DNS timeoutMs](/articles/xray-core-dns-timeout-ms-check/)。配置校验问题可先参考 [Xray 配置检查](/articles/xray-core-config-test/)。

## 官方来源

- [Xray-core DNS 配置](https://xtls.github.io/config/dns.html)

来源核验日期：2026-10-24。本文没有提供某个 DNS 服务的性能或可用性承诺。
