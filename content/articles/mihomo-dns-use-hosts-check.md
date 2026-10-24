---
title: "mihomo DNS use-hosts 配置：hosts 映射与解析结果排查"
category: "tutorials"
description: "检查 mihomo use-hosts、hosts 映射与 nameserver 的关系，用最小改动区分固定映射、策略和上游解析。"
date: "2026-10-24"
updated: "2026-10-24"
author: "NekoBox 中文指南编辑部"
draft: false
---

mihomo 的 DNS 结果不一定只来自 nameserver。官方 DNS 配置还提供 use-hosts，用来决定是否读取 hosts 映射。遇到某个域名始终返回旧地址、规则命中和代理都正常却访问错误时，应先确认 hosts 是否参与，再判断是不是缓存或上游解析问题。本文只讨论 mihomo 配置，不把操作系统 hosts 的行为套到其他核心。

## 先确认请求对象

备份当前配置，记录核心版本、域名、查询类型和命中的 DNS 规则。对比一个不受 hosts 影响的域名，确认问题发生在地址映射阶段，而不是连接、TLS 或代理出口。若同一域名在浏览器和核心中结果不同，分别保存两侧结果，避免只看浏览器缓存。

## 检查 use-hosts 与 hosts 映射

官方文档将 use-hosts 放在 DNS 配置中。检查生效配置中的值、hosts 字段以及客户端是否在合并配置时覆盖它。可以用下面的片段说明字段位置，保留原有 nameserver 和策略：

```yaml
dns:
  use-hosts: true
  hosts:
    example.test: 192.0.2.10
```

示例地址仅用于说明格式，不代表真实站点解析结果。不要把未知域名、订阅地址或凭据写进公开配置。若 use-hosts 关闭，hosts 条目不会按预期参与；若开启但仍没有命中，检查键名、域名大小写和配置合并结果。

## 按顺序验证并回滚

1. 用当前核心的配置检查命令验证 YAML。
2. 重载后对同一域名发起新查询，记录返回地址和命中的规则。
3. 暂时移除单条 hosts 映射作对照，确认变化来自该字段。
4. 若结果异常，恢复备份并再次检查 DNS。

不要同时修改 fake-ip、nameserver-policy 和代理出口，否则无法判断哪一项改变了结果。若 DNS 已得到预期地址但连接仍失败，继续看 [DNS 分层排查](/articles/mihomo-dns-config-check/) 与 [TUN DNS 劫持检查](/articles/mihomo-tun-dns-hijack-check/)。需要区分节点域名解析时，可参考 [proxy-server-nameserver](/articles/mihomo-dns-proxy-server-nameserver-check/)。

## 官方来源

- [mihomo DNS 配置与 hosts 选项](https://wiki.metacubex.one/config/dns/)

来源核验日期：2026-10-24。本文没有声称某条 hosts 映射在所有设备上都存在。
