---
title: "mihomo TPROXY 入站配置：透明代理监听与路由标记怎么查"
category: "tutorials"
description: "依据 mihomo 官方 TPROXY 入站文档，核对监听地址、端口、udp 和路由标记，区分配置能解析与系统转发已生效。"
date: "2026-11-02"
updated: "2026-11-02"
author: "NekoBox 中文指南编辑部"
draft: false
---

Linux 上启用透明代理后，应用仍然直连，先区分 mihomo 的 TPROXY 入站是否成功监听，以及系统策略路由是否把流量送入该入口。端口能打开不等于内核已经接管连接。

## 先确认入口字段

备份运行配置，记录实际监听地址、端口和客户端网卡。官方文档把 TPROXY 作为入站类型，局部配置应放在 `listeners` 或对应入站对象中，不能把它和 HTTP、SOCKS 入站混用。保留已有认证、端口和 DNS 设置。

```yaml
port: 7893
tproxy: true
```

上面只用于说明检查方向，端口和字段位置必须以当前 mihomo 版本文档及生成后的配置为准。

## 再查系统转发链路

1. 运行配置检查并重载，确认日志没有 bind 或权限错误。
2. 用只读命令确认目标端口和 UDP/TCP 状态。
3. 核对 Linux policy routing、iptables/nftables 规则是否指向相同端口。
4. 用一个新连接区分“未进入入站”和“进入后出站失败”。

不要为了验证 TPROXY 同时清空防火墙和全部路由规则。若回退，恢复原规则文件并记录变更范围。

## 官方来源

- [官方文档 1](https://wiki.metacubex.one/config/inbound/tproxy/)

来源核验日期：2026-11-02。
