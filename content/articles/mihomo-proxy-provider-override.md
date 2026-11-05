---
title: "mihomo proxy-provider override：节点重名与本地覆写怎么核对"
category: "tutorials"
description: "参考 mihomo 官方代理提供者文档，说明 override 前后缀、节点名替换与覆写顺序，检查订阅更新后的节点和代理组引用，不改远端订阅。"
date: "2026-11-05"
updated: "2026-11-05"
author: "NekoBox 中文指南编辑部"
draft: false
---

同时加载多个代理提供者时，节点重名可能让代理组选择难以辨认。mihomo 的 provider `override` 可以覆写加载后的节点内容，包含添加固定前后缀和替换节点名称。它作用于本机处理结果，不能证明远端订阅已经修改，也不会修复订阅下载失败。

## 先保留更新前后的对照

备份配置与现有 provider 缓存，记录提供者名称、节点数量和一个测试节点。带令牌的订阅地址不要出现在公开日志或截图里。确认该 provider 已经正常下载、解析；若 HTTP 请求失败，应先按 [代理集合更新失败](/articles/mihomo-proxy-provider-update-failed/) 处理。

这里的覆写和代理组 `filter` 是不同环节：override 改节点内容，filter 决定哪些成员进入代理组。给节点加前缀后，已有按名称筛选或手工引用也需要重新核对，不能只看订阅显示“更新成功”。

## 从一个固定前缀开始

以下片段放在现有 `proxy-providers` 中的某一项内部，不作为完整配置运行。保留该项的 `type`、`url`、`path` 等原字段：

```yaml
override:
  additional-prefix: "office | "
```

官方定义 `additional-prefix` 为固定前缀，`additional-suffix` 为固定后缀；`proxy-name` 用 `pattern` 与 `target` 替换节点名称，并支持正则。首次排查只加一个前缀，先确认作用范围，再考虑名称替换，避免正则同时改到无关节点。

官方页面还列出 UDP、出站接口等可覆写的通用字段，但字段出现不意味着每种节点协议都接受它。若已有 `override-expr`，要检查其执行顺序：官方说明数组按顺序处理，且在固定字段覆写之后生效。后面的表达式可能再次修改同一值。

## 更新一次，验证三个结果

1. 通过配置检查后只更新这一项 provider，记录更新时间、解析错误和节点数量。
2. 查看加载后的节点名称，确认只有目标 provider 加上前缀，原缓存或另一提供者没有被误改。
3. 查看代理组成员是否仍符合筛选条件，重新选择一个节点建立新连接，记录最终成员与响应。

节点名符合预期、代理组能引用正确成员、实际连接仍可用，才算本次覆写完成。若只改名就让组为空，恢复前缀并检查 [代理组筛选](/articles/mihomo-proxy-group-filter/)；若节点能显示但请求失败，继续看 [provider 健康检查](/articles/mihomo-proxy-provider-health-check/)，不要反复重写订阅地址。

本文依据官方字段说明给出检查流程，没有替真实订阅执行更新或客户端联网测试。

## 官方来源

- [官方来源 1](https://wiki.metacubex.one/config/proxy-providers/)

来源核验日期：2026-11-05。
