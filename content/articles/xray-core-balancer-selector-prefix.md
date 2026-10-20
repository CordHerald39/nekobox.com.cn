---
title: "Xray-core balancer selector：前缀匹配与规则引用怎么查"
category: "tutorials"
description: "根据 Xray 官方路由文档说明 selector 的出站标签前缀匹配、balancerTag 引用和策略依赖，定位候选错误及均衡器未被使用的问题。"
date: "2026-10-20"
updated: "2026-10-20"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 的 balancer selector 按出站 tag 的前缀选择候选，不是对节点名称做模糊搜索。配置了均衡器却没有按预期分配连接时，应先列出实际匹配到的 tag，再核对路由规则是否引用它。

## 先列清楚候选集合

官方示例中，selector 为 ["a"] 时会匹配 tag 为 a 与 ab 的出站，不会匹配 ba。过短的前缀可能把不希望参加均衡的出站也纳入；前缀拼写或大小写不一致，则可能找不到预期候选。检查时以实际配置里的 tag 为准。

均衡器的 tag 由规则中的 balancerTag 引用。官方文档说明，balancerTag 与 outboundTag 应二选一；两者同时出现时 outboundTag 生效。因此，写了 selector 并不等于流量已经经过均衡器。

## 按配置到请求逐层验收

1. 备份配置，列出 outbounds 的全部 tag，并标出应参加均衡的节点。
2. 对照 selector 的每一个前缀，手动核对候选范围，排除无关出站。
3. 找到应该命中的路由规则，检查 balancerTag 与均衡器 tag 完全一致。
4. 确认规则没有同时指定 outboundTag，也没有被更靠前的规则截获。
5. 做配置校验后发起新的测试连接，从日志核对实际路由结果。

## 策略有额外依赖

当前官方文档列出 random、roundRobin、leastPing、leastLoad。leastPing 与 leastLoad 必须配合观测站使用，未被观测覆盖的节点会被排除。不要只改策略名字，就把“延迟最小”当作已经实现。

均衡分配也不表示一个下载连接会叠加多个节点带宽。测试时需要观察新连接及候选状态，不能仅刷新一个仍复用连接的网页。若切换后失败，先恢复原策略，再检查观测数据和 fallbackTag 的安排。

基础规则见 [Xray-core 路由规则](/articles/xray-core-routing-rules/)，启动前可按 [Xray-core 配置校验](/articles/xray-core-config-test/) 检查结构。

## 官方来源

[官方配置文档](https://xtls.github.io/config/routing.html)

来源核验日期：2026-10-20。
