---
title: "sing-box SOCKS 出站配置：上游地址、认证与 TCP 路径验收"
category: "tutorials"
description: "依据 sing-box 官方 SOCKS 出站说明接入已有上游代理，核对 server、server_port、协议版本与账户，用单一 TCP 请求检查实际出站并保留回退配置。"
date: "2026-10-14"
updated: "2026-10-14"
author: "NekoBox 中文指南编辑部"
draft: false
---

已有一个允许你使用的 SOCKS 代理，想让 sing-box 将请求交给它，需要配置 SOCKS 出站。这里的地址和端口属于上游代理服务；本机应用连接的入口仍由入站配置提供。先确认上游服务资料，再改测试流量的出站。

## 准备上游连接信息

向服务管理员核对地址、端口、SOCKS 版本、账户认证以及是否支持 UDP。订阅 URL 通常包含配置获取路径，不能直接当作 SOCKS 服务地址。

[官方 SOCKS 出站文档](https://sing-box.sagernet.org/configuration/outbound/socks/)说明，它是 SOCKS4、SOCKS4a 或 SOCKS5 客户端，`server`、`server_port` 必填，协议默认使用 SOCKS5。以下是 `outbounds` 数组的一项，服务器域名与账户均为占位示例，替换后再测试。

```json
{
  "type": "socks",
  "tag": "upstream-socks",
  "server": "proxy.example.com",
  "server_port": 1080,
  "version": "5",
  "username": "proxyuser",
  "password": "replace-with-your-password",
  "network": "tcp"
}
```

上游不要求账户时，按服务资料省略认证字段。`password` 是 SOCKS5 密码，不是配置链接中的访问令牌。`network: "tcp"` 将这个示例限定为 TCP；官方允许 `tcp` 或 `udp`，省略时两者都启用，但上游能否传输 UDP 仍需另行核对。

## 把一条测试路径交给出站

1. 备份当前完整配置，保留已有入站、真实节点和原有路由。
2. 把出站片段加入现有数组，检查标签 `upstream-socks` 没有重复。
3. 在测试选择组或测试路由中引用该标签，仅让自己准备验证的请求进入它。
4. 按[官方配置说明](https://sing-box.sagernet.org/configuration/)执行 `sing-box check -c config-test.json`，文件名改成副本的真实路径。
5. 校验通过后用现有启动方式加载副本，从已经正常工作的入站发起短 TCP 请求。
6. 记录入站、实际出站标签、请求时间和目标响应，再与原有出站做一次对照。

尚未建立本机入口时，先看[SOCKS 入站配置](/articles/sing-box-socks-inbound-config/)。如果已有上游是 HTTP CONNECT 服务，按[HTTP 出站配置](/articles/sing-box-http-outbound-config/)填写，不能只将 `type` 改为 `socks`。

## 根据失败阶段继续检查

配置检查失败时，先处理 JSON 结构、字段和标签引用。核心能运行但连不上上游时，核对 `server`、端口及网络路径；已连上而认证失败时，再比对上游实际账户。请求进了其他出站，则先修正测试选择或路由。

上游若是本机另一代理进程，必须使用它真实监听的地址和端口，不能填 sing-box 自己的入站端口，否则可能形成循环。已有 `detour` 等拨号设置时，对照[官方拨号字段](https://sing-box.sagernet.org/configuration/shared/dial/)检查它引用哪个出站，保留原设置并逐项确认。

网页请求通过只能证明这条 TCP 路径可用。需要 UDP 的应用应单独验收；不要因为一次网页成功就开启 `udp_over_tcp`，该字段有专门协议要求，不能假定任意 SOCKS 服务都支持。

## 回退与记录

异常时把测试流量切回原有出站，恢复配置副本并保留上游连接错误。迁移或升级前参考[配置备份与迁移](/articles/sing-box-config-migration/)。公开记录可以保留版本、错误类型和标签，删去账户、密码及含令牌的完整链接。

预期结果是新请求通过既有入站进入 `upstream-socks` 并取得目标的预期响应。示例地址没有提供真实代理服务，配置校验也不会代替上游连通性测试。

## 官方来源

- [sing-box SOCKS 出站](https://sing-box.sagernet.org/configuration/outbound/socks/)
- [sing-box 拨号字段](https://sing-box.sagernet.org/configuration/shared/dial/)
- [sing-box 配置结构与检查](https://sing-box.sagernet.org/configuration/)

来源核验日期：2026-10-14。字段兼容性以实际安装的核心版本为准。
