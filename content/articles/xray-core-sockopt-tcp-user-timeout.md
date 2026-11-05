---
title: "Xray-core tcpUserTimeout：TCP 等待确认过久怎么核对"
category: "tutorials"
description: "依据 Project X Sockopt 和其引用的 gRPC 提案，区分 tcpUserTimeout、连接空闲与请求超时，核对毫秒单位并用受控新连接对照。"
date: "2026-11-05"
updated: "2026-11-05"
author: "NekoBox 中文指南编辑部"
draft: false
---

连接已经建立，网络中断后请求却很久没有返回错误，可以检查 Xray-core 的 `tcpUserTimeout`。官方 Sockopt 页面明确其单位为毫秒，并链接 gRPC 的 TCP User Timeout 提案。它面向 TCP 数据等待确认的时间，不能直接等同于应用请求的 deadline 或“连接多久没访问就关闭”。

## 先确认等待发生在哪一层

保存配置，记录核心版本、操作系统、出站标签和错误发生时间。先分清 DNS 查询失败、TCP 尚未建立、TLS 握手失败，以及连接建立后数据停滞。若请求根本没有进入目标出站，调整该出站的 socket 参数不会改变结果。

官方引用提案解释 Linux 的 `TCP_USER_TIMEOUT`：正值限制已发送数据保持未确认状态的最长时间，超时后 TCP 关闭连接并向应用返回错误；零值使用系统默认。提案讨论的是 Linux 内核能力，不代表它提到的 gRPC 默认值就是 Xray 的默认值，也不证明其他平台支持相同行为。

## 在正确层级核对毫秒值

以下为目标 outbound 的局部传输设置，10000 只是十秒的数值示例，不是推荐值或经过实测的故障恢复时间：

```json
{
  "streamSettings": {
    "sockopt": {"tcpUserTimeout": 10000}
  }
}
```

合并到原配置后运行 `xray run -test -config config-test.json`，使用自己的配置副本。不要把 `10` 当作十秒，也不要从 gRPC 提案复制其他库的配置键。字段校验通过后，仍须在实际运行平台核对日志和能力。

`tcpKeepAliveIdle` 与 `tcpKeepAliveInterval` 则是空闲探测相关的秒数设置。探测何时发出、已发送数据可等多久，以及应用多久放弃请求，是不同计时条件。首次对照只调整 tcpUserTimeout，避免三个计时器一起变化而无法解释结果。

## 用受控断连比较结果

1. 在自己可控制的测试链路上先建立新连接并发送数据，记录原来的停滞和报错过程。
2. 修改一项后重载，再创建新连接；旧连接可能保留创建时的 socket 设置。
3. 对照发送、失去响应、核心报错和应用结束的时间，不把某一次差值当成通用性能结论。
4. 若出现正常链路也频繁断开，恢复备份。官方引用提案提醒，过小值可能在高延迟或丢包路径上提前关闭连接。

本步骤不要求在生产网络丢包或清空防火墙。需要定位错误阶段可看 [Xray 日志配置](/articles/xray-core-log-config/)；测试命令与配置副本管理见 [配置校验](/articles/xray-core-config-test/)。本文仅完成文档和静态内容核对，未做客户端断连实测。

## 官方来源

- [官方来源 1](https://xtls.github.io/config/transports/sockopt.html)
- [官方来源 2](https://github.com/grpc/proposal/blob/master/A18-tcp-user-timeout.md)
- [官方来源 3](https://xtls.github.io/document/command.html)

来源核验日期：2026-11-05。
