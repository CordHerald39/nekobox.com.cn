---
title: "mihomo include-all-providers 配置：为什么代理组出现其他订阅节点"
category: "tutorials"
description: "根据 mihomo 代理组官方文档，区分 use、include-all-providers、include-all-proxies 与 include-all，检查代理组意外引入其他订阅节点的原因。"
date: "2026-10-31"
updated: "2026-10-31"
author: "NekoBox 中文指南编辑部"
draft: false
---

代理组的 `use` 只写了一个 provider，列表里却出现其他订阅的节点，可以先查同一组有没有开启 `include-all-providers`。官方文档说明，该字段引入所有代理集合，并使手动引入代理集合的设置失效。筛选表达式只能过滤输入，不能替代对导入范围的核对。

## 区分四种节点来源

`use` 明确引用代理集合；`proxies` 可以引用单个出站或其他代理组。`include-all-providers` 引入所有代理集合，`include-all-proxies` 引入所有出站代理，`include-all` 同时引入出站代理与代理集合。官方说明这些全量引入选项不包含其他代理组，后者需要在 `proxies` 中明确引用。

先备份配置，列出预期组名、应该引用的 provider 名称和实际出现的节点。客户端可能把订阅与扩展配置合并，应检查最终运行配置，避免只在订阅原文中寻找开关。

## 需要限定订阅时显式使用 use

假定已有名为 `office` 的 provider，下面只展示一个代理组对象。应放进原有 `proxy-groups` 数组，并修改已有同名组；它不会创建 provider，也不是完整配置：

```yaml
name: office-only
type: select
use:
  - office
include-all-providers: false
include-all-proxies: false
include-all: false
```

如果已有 `proxies`，也要检查其中是否额外引用了不需要的出站或组。不要为了减少节点直接删除其他订阅：其他代理组可能仍在使用它们。

## 筛选与健康检查另行核对

`filter` 对引入的代理集合和全量引入的出站生效；`exclude-filter` 用于排除名称符合条件的节点。先确认导入来源，再收紧筛选，避免用一个宽泛正则掩盖错误的来源范围。

官方还说明，组里的 `url` 健康检查只检查 `proxies` 中的代理，不检查通过 `use` 引入的 provider 节点。节点已出现在组中与它已通过健康检查，需要分别验收。

1. 通过配置检查并重新加载，记录组内节点与来源。
2. 在已知 provider 增加或移除一个测试节点后更新，确认只影响预期组。
3. 选择一个已知节点新建请求，核对实际出口；节点数量正确不代表连接成功。

需要查名称筛选时参看 [proxy-group filter](/articles/mihomo-proxy-group-filter/)；provider 自身没有节点或更新失败时参看 [代理集合更新排查](/articles/mihomo-proxy-provider-update-failed/)。结果异常就恢复组对象备份，保留其他组和订阅。

## 官方来源

- [官方文档 1](https://wiki.metacubex.one/config/proxy-groups/)

来源核验日期：2026-10-31。
