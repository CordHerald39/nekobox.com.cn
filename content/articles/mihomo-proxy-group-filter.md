---
title: "mihomo proxy-group filter 配置：节点筛选与代理组排错"
category: "tutorials"
description: "参考 mihomo 官方 proxy-groups 文档，检查 filter、provider 引用和代理组节点列表为何为空。"
date: "2026-10-29"
updated: "2026-10-29"
author: "NekoBox 中文指南编辑部"
draft: false
---

代理提供者中有节点，不代表代理组一定会显示这些节点。mihomo 的代理组可以按名称筛选或引用 provider，排错应先确认输入列表，再检查筛选条件和规则命中。

## 记录代理组的三层输入

备份配置，记录代理组类型、引用的 use 列表、filter 文本和当前节点名称。节点名称可能来自不同订阅，先用实际名称做小范围测试，不要一次修改多个 provider。

## 检查 filter 与 provider

打开 [mihomo proxy-groups 文档](https://wiki.metacubex.one/config/proxy-groups/)，核对字段拼写、正则或文本筛选语义，以及代理组是否确实引用了目标 provider。过滤条件过窄时列表会为空；条件过宽则可能把不想测试的节点一起加入。

示例仅说明排查位置：

```yaml
proxy-groups:
  - name: 自动选择
    type: select
    use:
      - office
    filter: "香港|日本"
```

## 用对照节点确认结果

1. 暂时保留一个名称明确的节点，确认 provider 文件确实包含它。
2. 只改 filter，重新加载并记录代理组列表变化。
3. 选择一个节点发起相同请求，区分筛选问题和连接问题。
4. 验证完成后恢复精确筛选，避免把所有订阅节点暴露在常用组。

如果 provider 本身没有更新，先看 [mihomo proxy-provider 健康检查](/articles/mihomo-proxy-provider-health-check/)；如果列表有节点但规则走错，继续看 [mihomo 规则顺序](/articles/mihomo-rule-order/)。

## 官方来源

- [mihomo proxy-groups 配置](https://wiki.metacubex.one/config/proxy-groups/)

来源核验日期：2026-10-29。
