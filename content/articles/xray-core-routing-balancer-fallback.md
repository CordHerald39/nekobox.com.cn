---
title: "Xray-core balancer 回退排查：路由标签与备用出口如何核对"
category: "tutorials"
description: "依据 Xray-core 官方路由文档，检查 balancer、selector 和备用 outbound 标签，定位路由命中后无法出站的问题。"
date: "2026-10-29"
updated: "2026-10-29"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 路由命中后还要选择一个可用的 outbound。balancer、selector 和路由规则分别承担不同职责，出现“规则命中但没有连接”时，应先确认标签和选择器输入，再讨论节点本身。

## 先固定一条可复现请求

记录配置文件、路由规则顺序、目标域名和当前日志级别。复制一份配置副本，隐藏服务器地址、账号和订阅信息。一次只针对一个目标测试，避免同时更换域名和出口。

## 核对 balancer 与 outbound 标签

在 [Xray-core 路由文档](https://xtls.github.io/config/routing.html)中确认 routing、balancers 和 outbound 标签的关系。规则引用的 tag 必须在同一份配置中存在；selector 或 balancer 的成员列表为空、拼写不一致，都会让路由结果无法落到预期出口。

可用最小化配置做结构检查：

```json
{
  "routing": {
    "rules": [
      { "domain": ["example.com"], "balancerTag": "main" }
    ],
    "balancers": [
      { "tag": "main", "selector": ["proxy-"] }
    ]
  }
}
```

上例只用于说明字段关系，实际 outbound、tag 和规则应以官方文档及自己的配置为准。

## 分层验证与回退

1. 先用固定 outbound tag 验证核心可以出站。
2. 再恢复 balancer，确认 selector 能匹配到成员。
3. 最后恢复完整域名、端口和网络规则，记录每层的日志结果。
4. 若备用出口仍未命中，回滚副本并检查标签拼写，而不是盲目增加节点。

已有 balancer 选择问题可参考 [Xray-core balancer selector](/articles/xray-core-balancer-selector-prefix/)；路由顺序可参考 [Xray-core 路由规则](/articles/xray-core-routing-rules/)。

## 官方来源

- [Xray-core Routing 配置](https://xtls.github.io/config/routing.html)

来源核验日期：2026-10-29。
