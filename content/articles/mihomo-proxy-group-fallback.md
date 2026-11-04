---
title: "mihomo fallback 代理组：故障转移顺序和健康检查怎么核对"
category: "tutorials"
description: "依据 mihomo 官方代理组文档，说明 fallback 组的成员、测速 URL 与路由引用关系，避免把故障转移组误当作负载均衡或 url-test。"
date: "2026-11-04"
updated: "2026-11-04"
author: "NekoBox 中文指南编辑部"
draft: false
---

需要主节点失败后切换到备用节点时，可以检查 `fallback` 代理组。它的选择逻辑、健康检查和路由引用都要分别核对；把它当成负载均衡组会让故障切换结果难以解释。

## 先确认组类型和成员

保留现有节点与代理组，查看运行配置中的成员顺序、测试 URL 和间隔。局部结构示意：

```yaml
proxy-groups:
  - name: Auto-Fallback
    type: fallback
    proxies: [Primary, Backup]
    url: https://www.example.com/generate_204
```

示例 URL 只展示字段位置，不代表任何网络质量结论。组成员必须是当前配置中存在的节点或代理组。

## 验证实际切换

1. 运行配置检查，确认代理组标签和路由引用一致。
2. 查看健康检查请求是否能到达测试 URL。
3. 在可控条件下让首选成员不可用，观察新连接是否切换到备用成员。
4. 恢复首选成员并核对连接记录，区分组切换与 DNS、认证故障。

不要为了追求更快切换把检查间隔设得过小。可继续查看 [代理组筛选](/articles/mihomo-proxy-group-filter/) 与 [URL 测试容差](/articles/mihomo-url-test-tolerance/)。

## 官方来源

- [官方文档 1](https://wiki.metacubex.one/config/proxy-groups/)

来源核验日期：2026-11-04。
