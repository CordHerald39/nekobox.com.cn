---
title: "sing-box 日志配置：等级、文件输出与没有记录怎么排查"
category: "tutorials"
description: "按 sing-box 官方日志字段设置 level、output 和 timestamp，用短时复现检查控制台与文件输出，排查禁用日志、文件路径和客户端覆盖。"
date: "2026-10-14"
updated: "2026-10-14"
author: "NekoBox 中文指南编辑部"
draft: false
---

sing-box 请求失败却找不到对应记录，可以先检查日志是否启用、记录等级和输出位置。尤其在设置 `output` 后，日志会写入文件，控制台不再输出；控制台变空不能直接证明核心没有处理请求。

## 先用控制台记录一段复现

[官方日志配置](https://sing-box.sagernet.org/configuration/log/)包含 `disabled`、`level`、`output` 和 `timestamp`。下面只是完整配置中的顶层 `log` 片段，应合并到已有 JSON，保留 DNS、入站、出站和路由。

```json
{
  "log": {
    "disabled": false,
    "level": "info",
    "timestamp": true
  }
}
```

`disabled: true` 会关闭启动后的日志输出。官方列出的等级包括 `trace`、`debug`、`info`、`warn`、`error`、`fatal`、`panic`；先从 `info` 复现，信息不足时再短暂改为 `debug`。日志内容和格式随版本及请求类型变化，不应要求每个版本输出完全相同的行。

## 需要留存时再切换文件输出

在同一个 `log` 对象中加入输出路径，例如：

```json
{
  "log": {
    "disabled": false,
    "level": "info",
    "output": "box-test.log",
    "timestamp": true
  }
}
```

`box-test.log` 是示例文件路径。启用文件输出后，官方说明控制台不再输出日志。先核对启动方式、工作目录与实际可写路径；图形客户端可能使用自己的目录或日志视图，不能按终端当前目录推断它把日志写在哪里。

如果文件没有生成，先查核心是否成功加载这个配置，再查路径与运行账户的写入权限。不要为了找到一份日志，盲目放宽整个目录的权限。需要指定位置时，使用当前系统的实际绝对路径；Windows JSON 路径中的反斜杠需要转义。

## 用固定请求对齐时间

1. 保存原配置和日志设置，记录实际 sing-box 版本以及启动配置路径。
2. 合并日志片段，按[官方配置说明](https://sing-box.sagernet.org/configuration/)执行 `sing-box check -c config-test.json`。
3. 校验通过后按现有启动方式加载副本，确认核心没有先因配置或端口错误退出。
4. 记录当前时间，从已配置的应用或本机入站发起一个新请求，保持目标和出站不变。
5. 在实际输出位置查对应时段，区分应用没有进入入口、连接上游失败、域名解析失败等阶段。
6. 若 `info` 不足以定位，短时切换 `debug` 重复同一请求，保存必要片段后恢复原等级。

入口尚不确定时参考[SOCKS 入站检查](/articles/sing-box-socks-inbound-config/)。上游路径异常时再看[SOCKS 出站配置](/articles/sing-box-socks-outbound-config/)，避免同时改变日志、节点和路由。

## 文件有内容仍需确认是不是本次运行

检查文件修改时间及新记录的时间戳，排除打开的是旧文件，或另一个核心仍在写入。同名配置也可能被客户端重新生成，需核对最终运行的 `log` 值。旧请求或应用缓存没有触发新网络连接时，不一定产生新的连接记录。

验收要求是本次复现的时间和日志能够对应，并能指出错误发生在哪一步；没有错误日志不等于请求成功，还需检查目标响应。若修改导致启动失败，恢复原日志配置并校验，再处理最早错误。

## 保留用于反馈的最小记录

保存核心版本、启动方式、错误时间、预期入口与出站标签，以及相关错误上下文。分享前隐藏账户、服务器凭据、订阅令牌和个人访问目标。长期使用恢复平常等级，按自己的留存需求管理文件，不把调试输出永久追加到唯一配置备份中。

升级前可参考[配置迁移与备份](/articles/sing-box-config-migration/)。本文描述核心字段；不能由最新核心文档推断旧版 NekoBox 已暴露相同编辑入口。

## 官方来源

- [sing-box 日志字段](https://sing-box.sagernet.org/configuration/log/)
- [sing-box 配置结构与检查](https://sing-box.sagernet.org/configuration/)

来源核验日期：2026-10-14。
