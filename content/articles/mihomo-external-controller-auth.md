---
title: "mihomo external-controller 认证：控制接口 401 或无法连接怎么查"
category: "tutorials"
description: "参考 mihomo 官方通用配置文档，检查 external-controller、secret 与监听范围，避免把本地控制接口暴露到不必要的网络。"
date: "2026-11-04"
updated: "2026-11-04"
author: "NekoBox 中文指南编辑部"
draft: false
---

面板能打开但 API 返回 401，或者控制接口完全无法连接时，先对照运行配置中的 `external-controller` 和 `secret`。控制接口的监听地址、端口、认证和面板地址是不同层次，不能只改其中一个。

## 对照监听与认证字段

保存配置并确认当前核心真正加载的值。局部示意：

```yaml
external-controller: 127.0.0.1:9090
secret: change-this-in-your-config
```

示例中的 secret 不是可用凭据，实际配置应使用本机安全生成的值。没有局域网管理需求时，优先使用回环地址，避免把控制 API 直接绑定到公网。

## 分层确认请求

1. 执行配置检查，确认端口未被其他程序占用。
2. 从同一设备请求控制接口，核对是否需要 Authorization 头。
3. 若本机成功而局域网失败，继续查监听地址和防火墙，不要先关闭认证。
4. 修改后重新加载并删除测试凭据，保留原配置备份。

控制 API 成功不等于代理连接正常。可结合 [控制器连接失败](/articles/mihomo-controller-connect-failed/) 和 [监听器配置](/articles/mihomo-listeners-inbound-config/) 继续定位。

## 官方来源

- [官方文档 1](https://wiki.metacubex.one/config/general/)

来源核验日期：2026-11-04。
