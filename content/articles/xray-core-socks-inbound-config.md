---
title: "Xray-core SOCKS 入站配置：本机监听、密码认证与应用连接"
category: "tutorials"
description: "根据 Project X 官方文档合并本机 SOCKS 入站，核对 listen、port、auth 和 users，先校验再用显式 SOCKS5 请求检查入站与实际出站。"
date: "2026-10-14"
updated: "2026-10-14"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 已有可用出站，某个应用需要 SOCKS5 代理时，可以增加本机 SOCKS 入站。应用先连接监听地址和端口，再由 Xray 路由到实际出站。入站启动成功只是接入条件，后续还要验证目标请求。

## 把入站加入现有配置

[Project X SOCKS 入站文档](https://xtls.github.io/config/inbounds/socks.html)支持匿名和账户密码认证。以下对象是 `inbounds` 数组中的一项，不是完整配置；合并时保留已有真实出站、路由和其他入口。

```json
{
  "tag": "local-socks",
  "listen": "127.0.0.1",
  "port": 1080,
  "protocol": "socks",
  "settings": {
    "auth": "password",
    "users": [
      {
        "user": "localuser",
        "pass": "replace-with-your-password"
      }
    ],
    "udp": false
  }
}
```

认证设为 `password` 时，`users` 才生效；仅填用户而保留 `noauth` 不能启用密码认证。

[入站通用文档](https://xtls.github.io/config/inbound.html)将 `listen` 定义为监听地址、`port` 定义为监听端口。此处明确填写 IPv4 回环 `127.0.0.1`，只让本机应用连接。1080 是示例，先确认端口空闲并与应用设置保持一致。SOCKS 传输本身不加密，官方建议用于本机或局域网，不应把这个本机示例改成公网开放服务。

## 校验后再配置应用

1. 保存完整配置副本，合并入站并设定自己的密码，检查标签是否重复。
2. 按[官方命令参数](https://xtls.github.io/document/command.html)执行配置检查：`xray run -test -c config-test.json`。Windows 可用 `xray.exe`，路径换成实际文件。
3. 检查通过后按原有方式加载副本。`-test` 只检查配置，不启动代理监听。
4. 在本机应用中选择 SOCKS5，填 `127.0.0.1`、实际端口及账户密码。
5. 发起一个新请求，查看入站标签 `local-socks`、实际出站和目标响应。

应用只支持 HTTP 代理设置时，应先核对它的代理能力和所用核心版本，不将系统 HTTP 代理框当成所有软件的 SOCKS5 设置入口。

## 用明确的 SOCKS5 请求做对照

装有 curl 的设备可测试同一入口。以下命令只填写用户名，让 curl 提示输入代理密码，交互输入行为见[curl 官方代理认证说明](https://curl.se/docs/httpscripting.html)；Windows 使用 `curl.exe`。目标换成自己有权访问且预期响应已知的 HTTPS 页面。

```sh
curl --socks5-hostname 127.0.0.1:1080 --proxy-user localuser --max-time 15 https://example.com/
```

[curl 官方手册](https://curl.se/docs/manpage.html)说明，`--socks5-hostname` 让 SOCKS5 代理解析目标域名。命令成功后仍要测试原应用；两者使用代理的方式可能不同，不能用 curl 的结果替代应用验收。

## 连接失败从入口开始查

连接被拒绝时，先看进程、监听地址和端口占用；认证失败时看 `auth`、`users` 和应用账户；入站已收到请求但目标失败时，再核对[路由规则与默认出站](/articles/xray-core-routing-rules/)。需要记录错误时参考[日志配置](/articles/xray-core-log-config/)。

上例关闭 UDP，只验证普通 TCP 请求。需要 UDP 的应用应另外核对 SOCKS UDP 支持、`udp` 字段及可达地址；不要用网页能打开推断 UDP 已可用。外层 `listen` 决定监听范围，SOCKS `settings.ip` 是 UDP 相关地址，不能用后者替代本机监听限制。

修改后异常时恢复原配置，并关闭应用中新增的代理设置，再确认原网络路径恢复。升级前可阅读[配置校验步骤](/articles/xray-core-config-test/)，保留实际核心版本和最早错误，不连续换多个版本试错。

## 官方来源

- [Project X SOCKS 入站](https://xtls.github.io/config/inbounds/socks.html)
- [Project X 入站通用字段](https://xtls.github.io/config/inbound.html)
- [Project X 命令参数](https://xtls.github.io/document/command.html)
- [curl 命令手册](https://curl.se/docs/manpage.html)
- [curl 代理认证与交互密码输入](https://curl.se/docs/httpscripting.html)

来源核验日期：2026-10-14。示例账户需自行替换，核心文档不代表某个旧版图形客户端支持全部字段。
