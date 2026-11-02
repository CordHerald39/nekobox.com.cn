---
title: "mihomo listeners 配置：多个入站标签与端口冲突怎么排查"
category: "tutorials"
description: "根据 mihomo 官方 listeners 文档，说明多入站监听的标签、类型、端口和路由引用关系，定位新增入口未生效或端口冲突。"
date: "2026-11-02"
updated: "2026-11-02"
author: "NekoBox 中文指南编辑部"
draft: false
---

需要同时提供 HTTP、SOCKS 或透明代理入口时，mihomo 的 `listeners` 是一组独立入站对象。新增对象后客户端仍连不上，先检查标签、类型和端口是否与现有入口重复，再核对使用方引用的究竟是哪一个入口。

## 保持每个监听对象独立

备份配置，列出每个 listener 的名称、类型、监听地址和端口。标签只用于引用，不能代替端口；同一个端口也不能因为标签不同而重复绑定。局部示例：

```yaml
listeners:
  - name: lan-http
    type: http
    port: 7890
    listen: 0.0.0.0
```

示例中的地址会扩大局域网暴露面，实际使用前应按最小范围选择。

## 从日志到客户端逐项确认

1. 运行配置检查并重载，确认每个对象都被接受。
2. 检查操作系统监听表，确认没有两个对象争用同一地址端口。
3. 用对应协议的客户端测试，HTTP 入口不要用 SOCKS 验证。
4. 若远端设备不可达，继续查防火墙和网络隔离，而不是改标签。

无改善时删除本轮 listener 并恢复备份。相关路由只应引用已确认存在的标签。

## 官方来源

- [官方文档 1](https://wiki.metacubex.one/config/listeners/)

来源核验日期：2026-11-02。
