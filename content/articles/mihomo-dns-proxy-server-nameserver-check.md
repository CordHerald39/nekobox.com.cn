---
title: "mihomo proxy-server-nameserver：节点域名解析失败怎么查"
category: "tutorials"
description: "依据 mihomo 官方 DNS 文档区分节点域名解析、DNS 服务器引导解析和网站解析，检查 proxy-server-nameserver、配套策略与循环依赖，并给出小范围验证步骤。"
date: "2026-10-22"
updated: "2026-10-22"
author: "NekoBox 中文指南编辑部"
draft: false
---

节点地址填写域名时，mihomo 要先解析这个域名才能建立代理连接。proxy-server-nameserver 就是专门为节点域名指定解析服务器的字段。出现节点域名解析错误时，应先检查这一层；能解析某个网站，不足以证明节点域名也走了可用的解析路径。

## 先分清三个解析对象

官方 DNS 文档说明，`proxy-server-nameserver` 只用于解析代理节点的域名。未填写时，节点域名遵循 `nameserver-policy`、`nameserver` 和 `fallback` 的配置。因此，留空并不代表节点完全不解析，也不代表一定使用操作系统 DNS。

`default-nameserver` 用于解析 DNS 服务器自身的域名；普通访问目标则要检查其实际 DNS 策略。这三个名字看起来接近，但各自处理的对象不同。排查时在记录里明确写出“节点域名”“解析服务器域名”“网站域名”，能减少换错设置的情况。

本文针对使用 mihomo 的配置。其他核心即使接受类似订阅，也不能直接套用这些 YAML 字段。

## 修改前确认请求卡在哪一步

1. 备份当前生效配置，记录核心版本、节点名称和节点的 `server` 类型；公开记录时遮盖订阅与认证信息。
2. 确认报错对应节点域名，而不是目标网站或加密 DNS 服务器的域名。
3. 查看运行时合并后的 `dns`，记录是否已有 `proxy-server-nameserver`，以及客户端是否会在重载时覆写它。
4. 核对该解析服务器的网络路径，确认不需要先通过尚未建立的同一代理连接才能访问。

如果节点地址本来就是 IP，本字段不是解释所有连接失败的起点。此时应继续核对连接超时、端口、协议与认证日志，不能把所有节点故障都归为 DNS。

## 与规则路由一起使用时的检查

官方文档要求启用 `respect-rules` 时配置 `proxy-server-nameserver`。DNS 连接遵守路由后，如果节点域名的解析又依赖该节点本身，就可能形成循环依赖。正确的检查方向是为启动代理所必需的解析留下可用路径，而不是反复更换普通网站的 DNS。

需要配置时，将已确认可用的解析服务器合并到现有 `dns.proxy-server-nameserver` 列表。不要复制整段官方示例覆盖自己的 DNS，也不要把未知第三方地址当成必然可用的修复方案。

配套的 `proxy-server-nameserver-policy` 格式与 `nameserver-policy` 相同，但仅在 `proxy-server-nameserver` 非空时生效。若只写策略而基础列表为空，应先修正这个条件；新增精确策略时，保留其他节点原有的解析路径。

## 用同一节点完成验证

保存副本并通过当前核心的配置校验，再重载配置。先用同一节点建立一条新连接，记录节点域名是否解析、得到的地址以及代理连接是否建立。随后用一个不受新增策略影响的节点作对照，避免把全局配置变化当成单节点修复。

解析成功后仍连不上，需要继续看连接阶段。客户端显示旧测速结果或旧连接仍然可用，都不能代替新连接验收。若修改无效或影响其他节点，恢复备份中的列表和策略，校验后重新加载，保留前后日志。

相关检查可继续看 [DNS respect-rules 引导解析](/articles/mihomo-dns-respect-rules-bootstrap/) 与 [DNS 配置分层排查](/articles/mihomo-dns-config-check/)。核心来源见 [mihomo 独立入口](/software/mihomo/)。

## 官方来源

- [mihomo DNS 配置：节点解析与配套策略](https://wiki.metacubex.one/config/dns/)

来源核验日期：2026-10-22。文中未承诺某个公共 DNS 在所有网络可用。
