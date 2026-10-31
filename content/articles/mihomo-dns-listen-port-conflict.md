---
title: "mihomo DNS listen 端口冲突：监听地址与查询入口怎么核对"
category: "tutorials"
description: "按 mihomo 官方 DNS 文档检查 listen 的地址与端口，区分配置校验、进程占用、UDP/TCP 监听和系统查询路径，保留原配置逐项回退。"
date: "2026-10-31"
updated: "2026-10-31"
author: "NekoBox 中文指南编辑部"
draft: false
---

mihomo 日志出现 DNS 监听地址已被占用时，应先找到占用相同地址与端口的进程。`dns.listen` 是 mihomo DNS 服务的监听入口，官方说明支持 UDP 和 TCP；它与 HTTP/SOCKS 代理端口不同，修改后也不会自动让所有应用改用这个 DNS。

## 先确认报错属于哪一个服务

备份当前可用配置，记录日志中的完整错误、地址、端口和时间。核对最终运行配置里的 `dns.enable` 与 `dns.listen`，不要把代理端口、控制接口端口或上游 DNS 服务器地址误当成 DNS 监听入口。

如果报错只发生在启动第二个客户端时，先检查是否有另一份 mihomo 或 DNS 服务在运行。不直接结束不明进程，也不要通过反复提升权限来尝试解决端口占用。

## 用本机端口缩小检查范围

以下仅展示待合并的 DNS 字段。1053 是官方示例使用的端口，本机是否空闲仍需实际检查；回环地址只供本机访问，不能给局域网其他设备当服务器地址使用：

```yaml
dns:
  enable: true
  listen: 127.0.0.1:1053
```

保留已有上游、DNS 策略和模式，只在原 `dns` 对象中修改，不增加第二个同名块。需要局域网访问的现有配置不应直接照抄回环地址，否则其他设备会失去访问入口。

Windows 可用下面两个只读 PowerShell 命令检查示例端口，实际排查应替换为报错中的端口：

```powershell
Get-NetUDPEndpoint -LocalPort 1053
Get-NetTCPConnection -LocalPort 1053 -State Listen
```

查看输出中的 `LocalAddress` 和 `OwningProcess`，再通过任务管理器核对进程。没有结果也不能单独证明一定可绑定：权限、地址是否属于本机及系统端口限制仍需结合启动错误判断。

## 启动成功后验证真正的查询路径

1. 先运行客户端配置检查，再重新加载；配置可解析不代表运行时已成功监听。
2. 检查新日志，确认没有同样的绑定错误，再查目标地址上的 UDP/TCP 状态。
3. 使用能明确指定 DNS 服务器和端口的查询工具，分别测试已知域名及返回结果。
4. 最后核对系统、TUN 或应用实际把 DNS 请求发到哪里。浏览器缓存或加密 DNS 可能绕过这个监听入口。

不要在尚未确认 mihomo 已监听时，把系统所有 DNS 都切向该地址。无改善时恢复原字段与相关转发目标，再检查原路径。上游字段可看 [DNS 配置检查](/articles/mihomo-dns-config-check/)；涉及 TUN 接管时看 [dns-hijack 检查](/articles/mihomo-tun-dns-hijack-check/)。

## 官方来源

- [官方文档 1](https://wiki.metacubex.one/config/dns/)

来源核验日期：2026-10-31。
