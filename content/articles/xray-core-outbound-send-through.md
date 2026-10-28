---
title: "Xray-core sendThrough：出站绑定地址检查"
category: "tutorials"
description: "依据 Xray-core 官方 outbound 文档检查 sendThrough 的地址绑定、系统网卡和出站连通性。"
date: "2026-10-28"
updated: "2026-10-28"
author: "NekoBox 中文指南编辑部"
draft: false
---

多网卡、容器或本机代理环境中，Xray-core 的出站连接可能需要绑定指定本地地址。官方 outbound 文档中的 sendThrough 用于指定出站使用的本地地址；绑定生效不等于远端握手成功。

## 先确认可用地址

备份配置，记录运行用户、出站标签和系统网卡地址。确认目标地址当前存在且可由运行用户使用，不要把远端节点地址填到 sendThrough。

## 添加单个绑定

在目标 outbound 的对应结构中按当前 schema 放置 sendThrough，示意：

{
  "sendThrough": "192.0.2.10"
}

示例地址仅用于说明格式，实际地址必须来自你的网卡。运行 xray run -test -config 配置文件或当前支持的等价检查命令，确认字段类型通过后再重启。

## 从日志验证路径

用同一目标建立新连接，记录出站标签、本地绑定地址、DNS 结果和 TLS 错误。若配置检查通过但启动失败，检查地址是否已删除、权限是否不足或 IPv4/IPv6 族不匹配。若启动正常但连接失败，再独立检查路由、远端和证书。

恢复时删除新增字段并重载原配置。多网卡路由细节可结合 [Xray-core 路由 network 条件](/articles/xray-core-routing-network-check/)。

## 官方来源

- [Xray-core OutboundObject](https://xtls.github.io/config/outbound.html)

来源核验日期：2026-10-28。

