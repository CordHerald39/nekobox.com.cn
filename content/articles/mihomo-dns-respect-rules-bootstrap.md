---
title: "mihomo DNS respect-rules：节点域名解析循环怎么避免"
category: "tutorials"
description: "依据官方文档核对 respect-rules 与 proxy-server-nameserver 的配合，区分 DNS 连接路由和域名分流，并保留失败后的回退步骤。"
date: "2026-10-20"
updated: "2026-10-20"
author: "NekoBox 中文指南编辑部"
draft: false
---

启用 respect-rules 后，mihomo 的 DNS 连接会遵守路由规则。它与按查询域名选择解析器的 nameserver-policy 作用不同。官方文档要求配合 proxy-server-nameserver，并强烈不建议与 prefer-h3 一起使用。

## 为什么要单独检查节点域名

如果 DNS 请求被规则送入代理，而代理节点本身又使用域名，启动代理前就需要先解析节点地址。若这一步又依赖同一代理，可能形成相互等待。proxy-server-nameserver 用于解析代理节点域名，需确保它的连接路径能先建立。

不要把 default-nameserver、proxy-server-nameserver 与普通 nameserver 视为同一个配置项。官方文档分别说明了 DNS 服务器域名、代理节点域名和普通查询的解析用途。

## 按依赖顺序检查

1. 导出当前有效配置，记录 respect-rules、prefer-h3 与各 DNS 服务器的值。
2. 在关闭 respect-rules 的原配置下，确认节点地址能解析、普通请求能连接。
3. 按自己的网络条件设置可用的 proxy-server-nameserver，先验证节点域名解析。
4. 检查相关 DNS 连接会命中哪条规则、走哪个出站，再单独开启 respect-rules。
5. 重新启动测试连接，分别观察节点域名和普通域名的查询日志。

不要直接复制别人的解析器地址后宣称已修复；服务器在当前网络能否访问、TLS 与规则是否正常，都需要实际验证。本页不提供适用于所有网络的一整份 DNS 配置。

## 开启后全部超时怎么办

先恢复备份，确认原解析链恢复，再检查新路径里的第一个失败环节。若日志连节点 IP 都无法取得，优先处理节点域名解析；若已连接出站但 DNS 请求超时，再检查解析服务器与对应路由。

按域名分流另见 [nameserver-policy](/articles/mihomo-dns-nameserver-policy/)，HTTP/3 相关选项另见 [prefer-h3](/articles/mihomo-dns-prefer-h3-check/)。

## 官方来源

[官方配置文档](https://wiki.metacubex.one/config/dns/)

来源核验日期：2026-10-20。
