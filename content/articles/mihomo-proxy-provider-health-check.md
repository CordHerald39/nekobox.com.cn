---
title: "mihomo proxy-provider 健康检查：更新后如何确认节点可用"
category: "tutorials"
description: "依据 mihomo 官方 proxy-providers 文档，整理订阅更新、health-check 结果和节点可用性复核步骤。"
date: "2026-10-29"
updated: "2026-10-29"
author: "NekoBox 中文指南编辑部"
draft: false
---

订阅更新成功只说明文件已写入，不能证明代理节点可以建立连接。mihomo 的 proxy-providers 文档提供了提供者与健康检查相关字段，排查时应把更新、检查和实际请求分开记录。

## 先备份并隐藏订阅地址

复制当前配置和提供者缓存，记录内核版本、提供者名称、最近一次更新时间。公开日志只保留域名或脱敏后的路径，不要把带令牌的完整订阅 URL 发到工单或文章中。

## 分开验证更新与检查

先手动更新提供者，确认返回状态和文件修改时间；再观察 health-check 的启用状态、测试地址、间隔和最近结果。文档字段属于配置的一部分，图形客户端可能还有自己的开关，不能只看界面上的“更新成功”。

示例只展示结构，地址和间隔必须按当前官方文档及自己的测试条件填写：

```yaml
proxy-providers:
  office:
    url: https://example.invalid/subscription
    health-check:
      enable: true
      url: https://example.invalid/health
      interval: 10m
```

## 用单个节点做最小复测

1. 保留一个已知可用的旧节点作为对照。
2. 更新后只选择一个新节点发起请求，记录 DNS、连接和 HTTP 结果。
3. 若检查失败，区分测试地址不可达、节点握手失败和规则未命中。
4. 先恢复备份，再单独调整检查地址或间隔。

若提供者已更新但代理组仍没有新节点，可继续看 [mihomo proxy-group lazy 配置](/articles/mihomo-proxy-group-lazy/)；若所有域名都失败，先回到 [mihomo DNS 配置检查](/articles/mihomo-dns-config-check/)。

## 官方来源

- [mihomo proxy-providers 配置](https://wiki.metacubex.one/config/proxy-providers/)

来源核验日期：2026-10-29。
