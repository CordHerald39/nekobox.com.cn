---
title: "mihomo DNS use-system-hosts：系统 hosts 是否参与解析"
category: "tutorials"
description: "依据 mihomo 官方 DNS 文档检查 use-system-hosts，区分系统 hosts、配置 hosts 与上游 DNS，提供可回退的单变量排查步骤。"
date: "2026-10-26"
updated: "2026-10-26"
author: "NekoBox 中文指南编辑部"
draft: false
---

当某个域名在系统命令里能解析、在 mihomo 中却得到不同地址时，问题可能出在系统 hosts 是否被核心读取。mihomo 官方 DNS 文档把 `use-system-hosts` 与 `use-hosts` 分开：前者控制系统 hosts，后者控制配置文件中的 hosts。不要把开关状态直接当成连接成功的证明，仍要观察实际返回地址和后续出站。

## 先记录三层结果

修改前备份当前生效配置，记录核心版本、测试域名、查询类型和返回地址。用系统解析工具查询同一域名，再从 mihomo 日志记录核心返回值。如果两侧一致，继续检查代理规则；若只在系统查询中出现固定地址，才重点看系统 hosts。

## 检查 use-system-hosts

官方文档说明 `use-system-hosts` 默认值为 `true`，用于决定是否查询系统 hosts。以下只展示字段位置，保留已有的 nameserver、策略和其他 DNS 设置：

```yaml
dns:
  use-system-hosts: true
```

将它临时设为 `false` 可以做对照，但不要同时编辑系统 hosts 或配置 hosts。重载配置后，用同一域名发起全新查询，记录地址是否从固定映射变为上游结果。若仍无变化，检查系统 hosts 文件路径、权限和域名拼写。

## 观察、判断与回滚

1. 运行核心自带的配置检查，确认布尔值和缩进有效。
2. 重载后连续查询两次，记录返回地址、DNS 规则和出站节点。
3. 临时切换 `use-system-hosts`，只改这一项，再重复相同查询；异常时恢复备份并重新加载。

系统 hosts 只影响解析入口，不会改变 TLS 证书或路由规则。解析地址正确但连接失败时，继续看 [mihomo DNS 配置检查](/articles/mihomo-dns-config-check/)；TUN 接管异常可参考 [mihomo TUN DNS 劫持检查](/articles/mihomo-tun-dns-hijack-check/)。

## 官方来源

- [mihomo DNS 配置](https://wiki.metacubex.one/config/dns/)

来源核验日期：2026-10-26。文档列出 `use-system-hosts` 默认值为 `true`；具体系统 hosts 路径和客户端隔离行为取决于运行环境。
