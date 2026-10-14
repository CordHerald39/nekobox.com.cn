---
title: "mihomo load-balance 怎么选：轮询、哈希与会话保持"
category: "tutorials"
description: "比较 mihomo load-balance 的 round-robin、consistent-hashing 和 sticky-sessions，按业务会话需求配置并检查多条新连接的分配结果。"
date: "2026-10-15"
updated: "2026-10-15"
author: "NekoBox 中文指南编辑部"
draft: false
---

mihomo 的 load-balance 用于把请求分配给一组节点。配置前先决定是否允许同一业务的不同连接使用不同出口。账号会话依赖出口稳定时，直接采用轮询可能不合适；多条请求分配到不同节点，也不表示一条下载连接能叠加所有节点带宽。

## 按连接需求选策略

[官方负载均衡文档](https://wiki.metacubex.one/config/proxy-groups/load-balance/)列出三种策略：

| 策略 | 文档定义 | 观察重点 |
| --- | --- | --- |
| round-robin | 将请求分配给组内不同节点 | 多条新连接的成员分布 |
| consistent-hashing | 相同目标地址分配给同一节点 | 同一目标的连续请求 |
| sticky-sessions | 相同来源与目标分配给同一节点，缓存十分钟 | 同一来源、目标与时间窗口 |

文档特别说明，目标为域名时使用顶级域名匹配。选择时按这份定义理解，不要把每个完整 URL 当成独立哈希对象，也不要把会话缓存理解为永不变化的出口保证。节点不可用或配置变更后仍需重新验收。

## 在配置副本加入一组候选

下面是局部 YAML，成员须为真实存在的节点或符合文档要求的组。它不包含节点参数，也不提供订阅。

```yaml
proxy-groups:
  - name: 均衡测试
    type: load-balance
    proxies:
      - 节点A
      - 节点B
    strategy: consistent-hashing
    url: https://www.gstatic.com/generate_204
    interval: 300
    lazy: false
```

[代理组通用字段](https://wiki.metacubex.one/config/proxy-groups/)规定，健康检查间隔单位是秒；通过 `use` 引入的集合节点不由组内 `url` 检查，需核对集合自己的检查设置。先确认候选可用，再研究分配差异，避免把节点故障误当策略不生效。

## 用多条新连接验证

1. 保存原配置、原选中组和内核版本，选择一个允许测试的业务目标。
2. 合并片段并校验，确认实际运行配置使用预期 `strategy`。
3. 让测试目标进入“均衡测试”，保留其他目标原有规则。
4. 关闭旧测试连接，发起多条新连接，记录来源、目标、时间与成员。
5. 需要比较轮询时，只替换策略字段后重测，其他条件保持一致。

浏览器可能复用连接，不能凭几次刷新就认定轮询失效。先看连接是否新建、请求是否命中该组，再看成员分配。未命中先查[规则顺序](/articles/mihomo-rule-order/)；面板与核心连接异常见[控制接口排查](/articles/mihomo-controller-connect-failed/)。

## 业务异常时恢复原路径

登录态或持续连接发生变化时，恢复原来的单节点或手动组，用同一目标重新建立连接。主备容错和负载分配解决不同需求，固定优先级可阅读[fallback 配置](/articles/mihomo-fallback-auto-switch/)。保留脱敏连接记录，不要用出口数量推算提速比例。

## 官方来源

- [https://wiki.metacubex.one/config/proxy-groups/load-balance/](https://wiki.metacubex.one/config/proxy-groups/load-balance/)
- [https://wiki.metacubex.one/config/proxy-groups/](https://wiki.metacubex.one/config/proxy-groups/)

来源核验日期：2026-10-15。配置说明以本机核心版本支持范围为准。
