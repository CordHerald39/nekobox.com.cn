---
title: "mihomo fake-ip 切换 redir-host：DNS 模式迁移与回退检查"
category: "tutorials"
description: "依据 mihomo DNS 官方文档，整理 enhanced-mode 从 fake-ip 切换 redir-host 前的备份、旧缓存识别、重新建连和规则复核步骤。"
date: "2026-10-30"
updated: "2026-10-30"
author: "NekoBox 中文指南编辑部"
draft: false
---

把 mihomo 的 DNS `enhanced-mode` 从 `fake-ip` 改成 `redir-host` 后，旧的解析结果和已有连接可能仍留在应用中。迁移时应先保留原配置，再核对实际 DNS 请求经过哪里，最后用新连接验证；只改一个字段后马上刷新网页，结果可能不足以说明模式已经切换。

## 什么时候需要比较两种模式

官方 DNS 文档将 `fake-ip` 和 `redir-host` 列为 `enhanced-mode` 的可选值。切换适合用来定位特定应用与 Fake-IP 的兼容问题，但不能据此认定某一种模式对所有网络更快或更安全。

先记录当前模式、`fake-ip-range`、DNS 监听地址、上游服务器与相关规则。若只有少数域名有问题，可以先评估 [fake-ip-filter 定向排除](/articles/mihomo-dns-fake-ip-filter/)，避免为了一个应用切换所有请求的处理方式。

## 只改 DNS 模式，保留其他变量

在原有 `dns` 配置中修改这一项，保留已有的 `enable`、监听、上游和策略配置。下面只是待合并的片段，不能单独作为完整配置运行。

```yaml
dns:
  enhanced-mode: redir-host
```

不要把 Fake-IP 范围随意改为真实局域网网段。该范围属于 Fake-IP 配置；本次排查只切换模式，避免同时改规则、DNS 上游与 TUN 路由后失去对照条件。也不要仅凭文件里写着新值就认定客户端已加载：有覆盖或扩展配置的客户端，还应检查最终运行配置。

## 排除旧缓存与绕过 DNS 的影响

1. 先通过客户端检查配置并重载，记录成功或错误信息。
2. 关闭测试应用的旧连接并重新启动应用；如果应用提供 DNS 缓存清理功能，按其说明处理。
3. 确认测试请求确实使用 mihomo DNS。浏览器的加密 DNS、系统其他 VPN 或应用内置解析器，都可能让测试绕过这里的配置。
4. 对同一域名重新发起请求，核对解析结果、规则命中与最终连接。若仍出现旧 Fake-IP 范围地址，先查缓存和请求路径，不能直接断定新模式不工作。

DNS 返回结果变化与代理规则命中是两件事。即使解析正常，也要检查请求是否走到预期出口；规则中的域名/IP 条件可能在不同处理路径下产生不同结果。

## 回退时也重新建立连接

若目标应用仍失败，恢复原配置中的 `enhanced-mode` 及配套设置，再重载并建立新连接。不要为了恢复旧状态删除整个配置目录或订阅缓存。保留两次测试的域名、时间、模式和错误类型，便于后续定位。

上游解析路径可对照 [mihomo DNS nameserver-policy](/articles/mihomo-dns-nameserver-policy/)；需要复核分流顺序时，参看 [mihomo 规则顺序](/articles/mihomo-rule-order/)。

## 官方来源

- [mihomo DNS 配置：enhanced-mode 与 Fake-IP 字段](https://wiki.metacubex.one/config/dns/)

来源核验日期：2026-10-30。
