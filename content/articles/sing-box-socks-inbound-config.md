---
title: "sing-box SOCKS 入站配置：本机监听、认证与应用接入验收"
category: "tutorials"
description: "按照 sing-box 官方 SOCKS 入站和监听字段配置本机应用代理，检查端口、用户认证与路由，并区分 SOCKS 入站和 TUN 接管。"
date: "2026-10-12"
updated: "2026-10-12"
author: "NekoBox 中文指南编辑部"
draft: false
---

sing-box 已有可用出站，但某个支持 SOCKS5 的应用没有走代理，可以为它配置一个明确的本机入口。SOCKS 入站负责接收应用请求，最终走哪个节点由后续路由决定。本文从本机监听开始，适合只接入指定应用的场景。

## 把入站片段加入现有配置

[官方 SOCKS 入站文档](https://sing-box.sagernet.org/configuration/inbound/socks/)说明，这个入口支持 SOCKS4、SOCKS4a 和 SOCKS5；`users` 为空时不要求认证。以下片段应作为 `inbounds` 数组中的一项，不能单独保存成完整运行配置。

```json
{
  "type": "socks",
  "tag": "local-socks",
  "listen": "127.0.0.1",
  "listen_port": 1080,
  "users": [
    {
      "username": "localuser",
      "password": "replace-with-your-password"
    }
  ]
}
```

`listen` 和 `listen_port` 的含义见[监听字段](https://sing-box.sagernet.org/configuration/shared/listen/)。1080 是示例端口，先确认它没有被其他进程使用。示例只监听 IPv4 回环地址，因此应用应填写 `127.0.0.1`，不要用另一台设备测试这个入口。更换为其他监听地址前，先明确所需访问范围。

## 先校验，再让应用接入

1. 保存现有配置副本，把上述入站加入数组，并设置自己的账户和密码。
2. 用安装的 sing-box 执行配置检查。官方提供 `sing-box check`；指定副本时可使用 `sing-box check -c config-test.json`，文件名换成实际路径。
3. 检查通过后加载副本，确认核心持续运行且没有端口占用错误。
4. 在应用中选择 SOCKS5，填入 `127.0.0.1`、当前端口以及对应账户；只填系统 HTTP 代理不等同于完成 SOCKS 配置。
5. 新建一个请求，核对入站标签 `local-socks` 和实际出站，确认应用接入的是刚才加载的配置。

需要全系统接管时，阅读[TUN 入站配置](/articles/sing-box-tun-inbound-config/)。SOCKS 入口需要应用主动连接，不能凭核心启动就推断所有程序都已代理。

## 连接失败先看失败发生在哪里

连接被拒绝时，先检查进程、监听地址与端口，不要立即更换远端节点。认证失败时，核对运行时 `users` 与应用账户；如果应用没有认证输入框，应先确认该应用的代理能力。

入口已有请求但目标失败时，检查是否命中了预期路由和出站。网页能打开却没有对应入站记录时，也可能是应用没有使用代理。测试时保持同一目标、同一应用，只改一个设置，便于回到修改前的状态。

## 用明确请求验证结果

装有 curl 的设备可作一次独立对照。以下命令会提示输入代理密码；Windows 上可用 `curl.exe`，目标地址应换成自己有权访问的固定 HTTPS 页面。

```sh
curl --socks5-hostname 127.0.0.1:1080 --proxy-user localuser --max-time 15 https://example.com/
```

curl 的 `--socks5-hostname` 会把目标域名交给 SOCKS5 代理解析，适合减少本地解析路径对这次对照的影响。成功判据是请求得到预期响应、核心显示对应入站和预期出站，并且应用自身的测试也通过。curl 成功只能证明这次命令的路径，不能代替应用验收。

## 官方来源

- [sing-box SOCKS 入站](https://sing-box.sagernet.org/configuration/inbound/socks/)
- [sing-box 监听字段](https://sing-box.sagernet.org/configuration/shared/listen/)
- [sing-box 配置结构与检查](https://sing-box.sagernet.org/configuration/)
- [curl 命令手册](https://curl.se/docs/manpage.html)

来源核验日期：2026-10-12。升级或迁移前可参考[配置备份与迁移](/articles/sing-box-config-migration/)。
