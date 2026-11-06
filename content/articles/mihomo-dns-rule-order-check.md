---
title: "mihomo DNS 规则顺序：nameserver-policy 命中错误怎么查"
category: "tutorials"
description: "参考 mihomo 官方 DNS 与规则文档，按配置加载、规则匹配和缓存三个阶段定位 DNS 结果异常，不混用代理端口与 DNS 端口."
date: "2026-11-06"
updated: "2026-11-06"
author: "NekoBox 中文指南编辑部"
draft: false
---

mihomo 的 DNS 结果与预期不同时，先记录域名、查询类型和最终命中的服务器。nameserver-policy、fallback 过滤和规则顺序分别解决不同问题；只改一个 nameserver 不能证明规则已经命中。

## 先确认配置边界

先执行配置检查；选择一个测试域名记录 A/AAAA 结果；查看核心日志中的命中服务器；清理受控缓存后重复查询，避免旧结果掩盖规则变化。

## 验证与回滚

1. 备份当前配置并记录核心版本和错误时间。
2. 运行官方配置检查命令，确认字段结构和引用对象。
3. 建立一次新的最小连接，按日志阶段区分解析、监听、握手和路由问题。
4. 一次只改一个变量，验证后保留可回滚副本。

不要把真实订阅、密码、令牌或会话密钥写入公开日志。可继续阅读 [mihomo-dns-ipv6-aaaa-empty-check](/articles/mihomo-dns-ipv6-aaaa-empty-check/) 与 [mihomo-dns-fake-ip-filter](/articles/mihomo-dns-fake-ip-filter/)。

## 官方来源

- [官方文档 1](https://wiki.metacubex.one/config/dns/)
- [官方文档 2](https://wiki.metacubex.one/config/rules/)

来源核验日期：2026-11-06。
