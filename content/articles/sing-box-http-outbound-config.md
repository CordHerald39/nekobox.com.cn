---
title: "sing-box HTTP 出站配置：上游代理地址、认证与 TLS 排查"
category: "tutorials"
description: "按 sing-box 官方 HTTP CONNECT 出站说明接入已有上游代理，核对 server、server_port、Basic 认证与 TLS，区分入站监听和上游连接。"
date: "2026-10-12"
updated: "2026-10-12"
author: "NekoBox 中文指南编辑部"
draft: false
---

拿到一个已有 HTTP 代理地址，想让 sing-box 把请求交给它，应配置 HTTP 出站。出站连接上游服务，入站则供本机应用连接；两者的地址和端口含义不同。本文仅处理已经存在、允许你使用的上游 HTTP CONNECT 代理，不提供公共代理列表。

## 核对上游给出的连接资料

先确认四项：服务地址、端口、是否要求账户密码，以及连接代理服务本身是否使用 TLS。目标网页是 HTTPS，不代表代理入口本身也使用 TLS；这些参数应由上游管理员或可核验的服务文档提供。

[sing-box HTTP 出站文档](https://sing-box.sagernet.org/configuration/outbound/http/)将它定义为 HTTP CONNECT 代理客户端，`server` 和 `server_port` 必填。下例为 `outbounds` 数组中的一项，地址、端口和账户都是示例，必须替换后再使用。

```json
{
  "type": "http",
  "tag": "upstream-http",
  "server": "proxy.example.com",
  "server_port": 8080,
  "username": "proxyuser",
  "password": "replace-with-your-password"
}
```

`server` 填服务器地址，不是带完整路径的订阅 URL。`username` 和 `password` 对应 Basic 认证；上游不要求认证时，可以不设置这两项。不要把订阅令牌误填成代理密码。

## TLS 应配置在正确的一段连接上

上游明确提供 TLS 代理入口时，再在这项出站中加入其要求的 TLS 配置。`server_port` 也必须对应上游的实际 TLS 入口，不能因为示例写了 8080 就保留它。下面片段表示启用 TLS，并使用上游给出的证书域名；应与实际证书和入口对应。

```json
{
  "tls": {
    "enabled": true,
    "server_name": "proxy.example.com",
    "insecure": false
  }
}
```

[官方 TLS 字段说明](https://sing-box.sagernet.org/configuration/shared/tls/)指出，`server_name` 用于核验证书主机名，并通常用于握手；`insecure` 会接受任意服务端证书。遇到证书错误时，先核对域名、证书与服务入口，不将关闭验证作为正常配置步骤。

当前 HTTP 文档也包含带版本条件的高级字段。本文没有加入 HTTP 版本、请求路径或额外请求头；已有配置需要这些字段时，须对照安装的核心版本核验，不能直接复制最新文档的全部示例。

## 让测试流量真正进入这个出站

1. 保存配置副本，将 HTTP 出站加入已有数组，保留原有可回退出站。
2. 在自己的测试路由或选择组中引用 `upstream-http`，确认只有预期测试请求进入它。
3. 按[官方配置说明](https://sing-box.sagernet.org/configuration/)执行 `sing-box check -c config-test.json`，通过后加载副本。
4. 从已经正常工作的本机入站发起短请求，查看实际出站是否为 `upstream-http`。
5. 请求失败时记录时间和错误位置，确认是连不上代理入口、认证失败、TLS 失败，还是上游无法连接目标。

只有上游出站而没有应用入口时，可先阅读[SOCKS 入站配置](/articles/sing-box-socks-inbound-config/)。不要把上游代理地址填进本机监听字段。

## 用两次对照请求完成验收

选择一个上游允许访问的目标，先用原有出站建立基准，再切换测试路径到 HTTP 出站。两个请求分别记录目标、实际出站与响应；若 HTTP 出站失败而基准成功，应集中检查上游配置和访问范围。核心日志显示正确出站且得到目标的预期响应，才算这条路径可用。

更新配置前参考[配置迁移与备份](/articles/sing-box-config-migration/)。保留原有出站可以让故障定位期间恢复工作，不需要重建整份配置。

## 官方来源

- [sing-box HTTP CONNECT 出站](https://sing-box.sagernet.org/configuration/outbound/http/)
- [sing-box TLS 字段](https://sing-box.sagernet.org/configuration/shared/tls/)
- [sing-box 配置结构与检查](https://sing-box.sagernet.org/configuration/)

来源核验日期：2026-10-12。示例不代表可连接的代理服务。
