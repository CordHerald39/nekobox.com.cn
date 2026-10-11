---
title: "mihomo 控制接口连接失败：监听地址、端口与 secret 认证排查"
category: "tutorials"
description: "依据 mihomo 官方 API 和全局配置说明，分辨控制接口连接拒绝、认证失败及浏览器跨域问题，使用本机只读请求验证。"
date: "2026-10-11"
updated: "2026-10-11"
author: "NekoBox 中文指南编辑部"
draft: false
---

mihomo 控制面板无法连接，先检查 API 地址与认证，不要因此重新导入全部节点。代理端口与控制端口用途不同：应用能通过代理联网，不代表面板已连上 `external-controller`。本文先用本机只读请求确认核心响应，再定位浏览器和面板设置。

## 对照实际加载的控制地址

官方全局配置以 `external-controller: 127.0.0.1:9090` 展示本机 API 监听。9090 是示例端口，实际客户端可能另行设置；先查运行时配置或启动日志，再填写面板地址。不要把 HTTP、SOCKS 或 mixed 代理端口填进控制接口。

`127.0.0.1` 指向发起请求的设备。如果核心在路由器或另一台电脑，手机上的这个地址不会指向它。远程使用需要单独核对监听范围、可信网络与访问控制；本机面板排错时应继续使用本机监听，不必扩大到 `0.0.0.0`。监听所有地址可能让其他设备访问控制 API。

HTTPS 控制接口另有 `external-controller-tls`，需要 TLS 证书与私钥，并仍须填写 `external-controller`。只把面板 URL 改成 HTTPS，不会自动让原来的 HTTP 监听提供 TLS。

## 用只读请求分清连接与认证

官方 API 的 `GET /version` 返回版本信息，适合作为低影响验证。以下 PowerShell 命令假定你已确认本机监听是 `127.0.0.1:9090`，并设置了 `secret`；应将端口改为自己的实际值。

```powershell
$apiSecret = Read-Host '输入本机 mihomo API 密钥'
Invoke-RestMethod -Uri 'http://127.0.0.1:9090/version' -Headers @{ Authorization = "Bearer $apiSecret" }
Remove-Variable apiSecret
```

密钥从本机配置读取或输入，不要把真实值写进截图、工单或公开配置。这个请求只读取版本，不会重载配置、切换节点或关闭连接。

1. 连接被拒绝时，确认核心已经运行、监听端口一致，并查看是否有端口占用报错。暂不将问题归因于节点或订阅。
2. 收到认证错误时，核对运行时 `secret` 与面板保存的密钥。官方 API 使用 `Authorization: Bearer` 请求头。
3. 返回版本信息后，回到面板检查协议、主机、端口及密钥，再尝试连接。
4. 本机请求成功而浏览器仍报跨域错误时，检查浏览器控制台与 `external-controller-cors`，只配置所需来源。CORS 与 API 密钥解决的是不同问题。

客户端重新生成配置后，原先保存的端口或密钥可能已改变；比对当前运行值比反复重启面板更有效。

## 面板页面打不开的另一条分支

`external-ui` 用于托管静态面板，访问路径为 API 地址下的 `/ui`。`/version` 正常而 `/ui` 不正常时，检查 UI 文件路径与文件内容，不要把它判定为核心控制接口整体故障。路径在工作目录外时，按官方说明检查安全路径设置。

恢复连接后，再处理[代理集合更新失败](/articles/mihomo-proxy-provider-update-failed/)或[规则命中顺序](/articles/mihomo-rule-order/)问题。不要为了面板排错调用重启、升级或清空连接等写接口；保留一次只读响应和对应时间即可完成初步验收。

## 官方来源

- [mihomo 全局配置：外部控制与面板](https://wiki.metacubex.one/config/general/)
- [mihomo API：认证与版本查询](https://wiki.metacubex.one/api/)

来源核验日期：2026-10-11。监听值与认证设置应以当前运行配置为准。
