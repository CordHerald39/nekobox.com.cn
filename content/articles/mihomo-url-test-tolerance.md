---
title: "mihomo url-test 自动选择：测试间隔、容差与切换检查"
category: "tutorials"
description: "按 mihomo 官方文档配置 url-test 自动选择组，理解 interval、tolerance 和 lazy，用新连接检查实际选路，排查探测正常但业务连接失败。"
date: "2026-10-15"
updated: "2026-10-15"
author: "NekoBox 中文指南编辑部"
draft: false
---

想让 mihomo 根据探测结果选择节点，可以使用 url-test 组。先确定候选节点和检查地址，再将需要自动选择的流量送入这个组。面板出现延迟数字，只能说明一次探测有结果，不能证明所有网站都可访问，也不能据此推断下载速度。

## 先配置一个可观察的测试组

[url-test 官方示例](https://wiki.metacubex.one/config/proxy-groups/url-test/)提供代理列表、检查地址和间隔。下面是局部片段，两个成员名称必须替换为已有配置中的真实节点名；不要覆盖原来的入站、节点和规则。

```yaml
proxy-groups:
  - name: 自动测试
    type: url-test
    proxies:
      - 节点A
      - 节点B
    url: https://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50
    lazy: false
```

这里 300 秒、50 毫秒是示例值。`tolerance` 是切换容差，不是节点的延迟上限，也不是速度阈值。先在默认行为附近验证，再按实际稳定性调整；不要因为两次探测相差几毫秒就认定需要频繁切换。

## 分清候选来源与检查范围

[通用字段文档](https://wiki.metacubex.one/config/proxy-groups/)说明，组内 `url` 检查 `proxies` 中引用的代理，不检查通过 `use` 引入的代理集合。使用集合时，另行确认集合自身的健康检查，不能把所有节点都没测到归因于 url-test。集合问题见[代理提供者更新排查](/articles/mihomo-proxy-provider-update-failed/)。

`interval` 非零时才启用定时检查。`lazy` 默认是 `true`，未选择该组时不测试；上例在观察阶段设为 `false`。检查地址要在自己的网络和候选路径上可达。如果地址本身失效，统一报超时并不等于每个节点都坏了。

## 从探测到业务请求逐步验收

1. 备份可用配置，记录内核版本、组名和两名候选，确认客户端支持所用字段。
2. 把片段合并到配置副本，通过客户端现有校验入口检查，查看最终运行配置。
3. 在已有手动组中选择“自动测试”，或让一个明确的测试目标命中该组；不要同时改整个站点分流。
4. 等待实际完成一次检查，记录候选结果、当前成员和时间。
5. 重新发起目标请求，核对连接记录中的组与成员，再与探测结果对照。

请求没进入该组时，先按[规则顺序指南](/articles/mihomo-rule-order/)查路径。已经进入但业务失败时，分别记录检查地址和业务目标的结果；它们可能有不同访问条件。旧长连接也可能保留既有路径，不适合检验新选择。

## 回退和适用边界

自动选择面向探测结果，不能承诺已有连接无中断。需要按固定主备顺序回退时，参考[fallback 备用组](/articles/mihomo-fallback-auto-switch/)。调整后更不稳定，恢复原手动选择和规则，再比较相同目标的新请求。本文是官方配置说明，没有对节点测速或排名。

## 官方来源

- [https://wiki.metacubex.one/config/proxy-groups/url-test/](https://wiki.metacubex.one/config/proxy-groups/url-test/)
- [https://wiki.metacubex.one/config/proxy-groups/](https://wiki.metacubex.one/config/proxy-groups/)

来源核验日期：2026-10-15。配置说明以本机核心版本支持范围为准。
