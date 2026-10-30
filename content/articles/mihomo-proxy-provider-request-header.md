---
title: "mihomo proxy-provider header：订阅请求头与鉴权错误怎么查"
category: "tutorials"
description: "参考 mihomo 官方 proxy-providers 文档，核对 header 的列表写法、User-Agent 与鉴权要求，区分 HTTP 下载失败和下载后格式错误。"
date: "2026-10-30"
updated: "2026-10-30"
author: "NekoBox 中文指南编辑部"
draft: false
---

同一个订阅地址在浏览器里能打开，mihomo 的 proxy-provider 却下载失败，可能是两次请求携带的请求头或鉴权条件不同。`header` 可以为提供者的 HTTP 请求设置自定义头，但不能替代失效的订阅权限，也不能修复下载内容不是代理配置的问题。

## 先保留可以比较的现场

备份配置，记录 provider 名称、失败时间、HTTP 状态以及内核日志中的错误类型。分享日志时隐藏完整订阅 URL、查询参数、Cookie 和鉴权值。不要把浏览器所有请求头直接复制进配置，其中可能包含账户凭据和与此次请求无关的字段。

核对服务提供方是否明确要求特定 User-Agent、Authorization 或其他头。若对方没有文档要求，先保留默认行为；不要凭猜测添加头来尝试绕过访问限制。

## 按列表结构检查 header

官方示例把请求头放在对应的 `proxy-providers` 条目下，头名称对应字符串列表。假如服务方要求请求的 User-Agent 为 `mihomo`，可在该 provider 中合并下面的字段：

```yaml
header:
  User-Agent:
    - mihomo
```

这是 provider 内部的局部片段，不是完整配置；只有对方确实要求这个值时才使用。保留原有 `type`、`url`、`path` 和其他设置，不要放到顶层 `dns` 或 `proxy-groups` 中。若已有 `header`，修改原块，避免出现重复 YAML 键。

Authorization 同样应按官方文档的列表结构填写，但认证方案和值必须来自服务提供方。本文不提供可直接复制的令牌，也不建议把凭据放入公开配置仓库。401 或 403 应先确认账户、订阅有效期与鉴权要求，反复改 User-Agent 并不能证明权限已恢复。

## 一次更新分成两步验收

1. 仅修改一个请求头，通过配置检查后触发一次 provider 更新，记录 HTTP 状态与更新时间。
2. 如果 HTTP 已成功，继续核对响应内容是否是该 provider 支持的代理集合；登录页、错误 JSON 或整份客户端配置仍可能无法被解析。
3. 再检查 provider 中节点数量和名称是否符合预期，最后用一个节点做实际连接验证。健康检查与下载请求属于不同环节，不能互相代替。
4. 若状态或内容没有改善，恢复备份，不叠加未经确认的 Cookie、Referer 或多个认证头。

如果 HTTP 200 后仍报格式错误，继续看 [mihomo 代理集合更新失败](/articles/mihomo-proxy-provider-update-failed/)；下载正常但节点不可用时，参看 [provider 健康检查](/articles/mihomo-proxy-provider-health-check/)。

## 官方来源

- [mihomo proxy-providers：header 与官方结构示例](https://wiki.metacubex.one/config/proxy-providers/)

来源核验日期：2026-10-30。
