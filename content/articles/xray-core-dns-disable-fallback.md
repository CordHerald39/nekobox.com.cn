---
title: "Xray-core DNS disableFallback：关闭回退查询的验证方法"
category: "tutorials"
description: "按 Xray-core 官方 DNS 文档检查 disableFallback，区分域名匹配服务器、回退顺序和连接故障，提供安全回滚步骤。"
date: "2026-10-26"
updated: "2026-10-26"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 会根据域名匹配结果构建 DNS 服务器列表。官方文档说明 `disableFallback` 为 `true` 时跳过第二组回退服务器，默认值为 `false`。它改变查询范围；第一组服务器失败时可能直接留下解析错误。

## 看清两组服务器

先备份配置，记录域名、查询类型、服务器顺序和返回地址。Xray 会先选择 `domains` 命中的服务器，再把未命中且未设置 `skipFallback` 的服务器组成回退列表。检查日志时记录是否命中了域名条件。若没有匹配服务器，`disableFallback` 可能让查询更容易失败。

## 只切换 disableFallback

官方 DnsObject 示例把字段放在 `dns` 对象中：

```json
{
  "dns": {
    "disableFallback": true
  }
}
```

`true` 表示禁用回退，`false` 或省略表示不禁用。先运行当前 Xray 的配置测试，确认大小写和布尔值有效。不要同时调整其他回退字段，否则无法判断结果来源。

## 用故障场景验证

1. 选择一个应命中指定 DNS 服务器的域名和一个不会命中的域名，记录原配置结果。
2. 只启用 `disableFallback`，重启核心并观察启动日志。
3. 分别制造“首选服务器可用”和“首选服务器不可用”的测试，记录是否继续尝试回退服务器。
4. 若命中域名的请求也失败，或未命中请求全部超时，恢复原值并再次测试。

回退被关闭后，某个服务器的短暂故障会直接暴露给应用。解析地址正常但连接失败时，继续检查 [Xray-core DNS queryStrategy](/articles/xray-core-dns-query-strategy/)与 [Xray-core DNS timeoutMs](/articles/xray-core-dns-timeout-ms-check/)。配置加载问题可参考 [Xray-core 配置校验](/articles/xray-core-config-test/)。

## 官方来源

- [Xray-core DNS 配置](https://xtls.github.io/config/dns.html)

来源核验日期：2026-10-26。官方文档说明 `disableFallback` 默认值为 `false`，开启后跳过回退服务器；本文没有把它描述成性能优化。
