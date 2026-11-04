---
title: "mihomo TUN stack 配置：system、gvisor 和 mixed 怎么核对"
category: "tutorials"
description: "依据 mihomo 官方 TUN 入站文档，区分 stack 模式、自动路由和系统网卡接管，按连接阶段定位 TUN 启动后仍然直连的问题。"
date: "2026-11-04"
updated: "2026-11-04"
author: "NekoBox 中文指南编辑部"
draft: false
---

TUN 已经创建但应用仍然直连时，先确认入站使用的 `stack` 模式，再检查自动路由、接口地址和系统权限。端口能监听只说明进程启动，不代表流量已经进入 TUN。

## 先看运行配置中的 stack

保存当前配置，查看生成后的 TUN 入站对象。`system`、`gvisor` 和 `mixed` 的可用性取决于核心、系统和当前客户端，不要只根据界面下拉框判断。局部示例：

```yaml
tun:
  enable: true
  stack: system
  auto-route: true
```

示例用于说明核对字段，地址、DNS 和路由设置应保留现有值。切换 stack 不会自动修复防火墙或系统路由。

## 按流量路径排查

1. 运行核心配置检查，确认 TUN 入站可以创建。
2. 查看系统是否出现对应虚拟网卡，并记录其地址和路由。
3. 用一个新连接检查是否进入 TUN，再区分 DNS、路由和出站错误。
4. 只切换 stack 做对比，失败时恢复原值并保留日志。

不要同时改 DNS、MTU 和防火墙规则，否则无法判断是哪一层变化。可继续参考 [TUN 自动路由](/articles/mihomo-tun-auto-route-check/) 与 [排除地址](/articles/mihomo-tun-route-exclude-address/)。

## 官方来源

- [官方文档 1](https://wiki.metacubex.one/config/inbound/tun/)

来源核验日期：2026-11-04。
