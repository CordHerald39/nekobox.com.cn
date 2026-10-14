---
title: "Xray-core HTTP 入站：本机监听、认证和应用连接检查"
category: "tutorials"
description: "根据 Xray 官方 HTTP 入站文档为本机应用配置代理入口，明确 TCP 边界、listen 地址、Basic 认证和 allowTransparent 的作用，并逐步验收。"
date: "2026-10-15"
updated: "2026-10-15"
author: "NekoBox 中文指南编辑部"
draft: false
---

应用只提供 HTTP 代理设置时，可以让它连接 Xray-core 的 HTTP 入站。这个入口负责接收应用请求，最终是否走远端代理还由出站与路由决定。先在本机回环地址建立一个可校验的入口，再测试应用，避免同时改监听地址、认证和分流。

## 监听地址要明确写出

[Xray 入站通用文档](https://xtls.github.io/config/inbound.html)说明，不指定 `listen` 默认接收所有网卡的连接。本机用途明确写 `127.0.0.1`。下面只是一项入站片段，合并到已有 `inbounds` 数组，保留原出站与路由；8080 是测试端口，先确认未被占用。

```json
{
  "inbounds": [{
    "tag": "local-http",
    "listen": "127.0.0.1",
    "port": 8080,
    "protocol": "http",
    "settings": {
      "allowTransparent": false
    }
  }]
}
```

标签需保持唯一。本例没有用户认证，仅供同一台机器上受信任的应用测试；它也不包含任何远端服务器凭据。不要把监听改成公网地址来解决本机端口连不上。

## HTTP 代理支持范围和认证

[HTTP 入站官方说明](https://xtls.github.io/config/inbounds/http.html)指出它只能代理 TCP，UDP 应用不能靠这个入口接入。HTTPS 网站可通过应用支持的 HTTP 代理方式连接，但入口协议本身不对客户端到代理这段传输加密，因此适合本机或受控局域网用途。

需要认证时，在这项 `settings` 内添加 `users` 数组，每项包含 `user`、`pass`。非空时启用 Basic Authentication；在应用中填相同值即可。自己生成测试账号，不要把真实密码写到反馈截图、命令历史或公开配置。Basic 认证不会把入口变成加密传输。

`allowTransparent` 开启后会转发非代理形式的 HTTP 请求，官方提示错误配置可能形成循环。本机普通代理接入先保持关闭，别把它当成“增强兼容”开关。

## 配置、监听、应用分三层验收

1. 保存原配置与应用原代理设置，记录核心版本和启动路径。
2. 按[官方命令](https://xtls.github.io/document/command.html)执行 `xray run -test -config config-test.json`，路径换成配置副本。
3. 校验通过后按原启动方式加载，检查日志中是否有端口占用或监听错误。
4. 在单个测试应用里选 HTTP 代理，地址填 127.0.0.1、端口填 8080；开启认证时同步填写。
5. 新建一个请求，检查是否进入 local-http，再核对实际出站和目标响应。

配置校验通过不能证明目标可达。入口接入后路径不对，查[路由规则与默认出站](/articles/xray-core-routing-rules/)；需要错误细节参考[日志设置](/articles/xray-core-log-config/)。端口拒绝、认证失败与目标超时应分别记录。

## 恢复原应用设置

完成测试先把应用恢复到原代理设置，再撤销测试入站。只关闭核心却保留应用的 127.0.0.1:8080 代理，会让应用继续连接不存在的入口。需要 SOCKS 的应用可阅读[SOCKS 入站配置](/articles/xray-core-socks-inbound-config/)，不要混填协议类型。

## 官方来源

- [https://xtls.github.io/config/inbounds/http.html](https://xtls.github.io/config/inbounds/http.html)
- [https://xtls.github.io/config/inbound.html](https://xtls.github.io/config/inbound.html)
- [https://xtls.github.io/document/command.html](https://xtls.github.io/document/command.html)

来源核验日期：2026-10-15。配置说明以本机核心版本支持范围为准。
