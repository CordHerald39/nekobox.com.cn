---
title: "mihomo DNS fallback-lazy-query：回退查询时机检查"
category: "tutorials"
description: "依据 mihomo 官方 DNS 文档检查 fallback-lazy-query 的触发时机，区分回退查询、规则命中和上游超时。"
date: "2026-10-28"
updated: "2026-10-28"
author: "NekoBox 中文指南编辑部"
draft: false
---

当主 DNS 与 fallback 同时配置时，用户常把回退查询没有发生理解成上游失效。mihomo 官方 DNS 文档把 fallback-lazy-query 作为回退查询时机相关参数，排查应先记录查询日志和规则命中。

## 先记录当前查询链

备份配置，记录核心版本、测试域名、查询类型、nameserver、fallback 与 fallback-filter。连续查询同一域名两次，分别记下返回地址、命中的 DNS 规则和是否出现 fallback 请求。不要在同一轮同时修改 nameserver、fake-ip 或规则顺序。

## 做一次单变量对照

只切换 fallback-lazy-query 的布尔值，保留其他字段。示例字段位置：

dns:
  fallback-lazy-query: true

重新加载后，用此前能稳定复现的域名发起新请求，观察是否出现 fallback 查询、返回地址是否改变，以及后续连接走了哪个出站。旧连接可能复用缓存，不能作为唯一证据。

## 判断与回滚

1. 运行配置检查，确认字段拼写和布尔类型正确。
2. 重载后连续查询两次，记录主查询、fallback 查询和规则命中。
3. 若返回地址变化但连接仍失败，继续排查规则与出站。
4. 若日志无变化，恢复备份并检查版本，再查看 [mihomo DNS 配置检查](/articles/mihomo-dns-config-check/)。

## 官方来源

- [mihomo DNS 配置](https://wiki.metacubex.one/config/dns/)

来源核验日期：2026-10-28。

