---
title: "sing-box DNS 服务器配置迁移：旧 address 与新 type 字段怎么核对"
category: "tutorials"
description: "对照 sing-box 官方迁移文档检查 DNS server 格式变化，区分最小字段示例、完整配置校验与解析路径验证。"
date: "2026-10-09"
updated: "2026-10-09"
author: "NekoBox 中文指南编辑部"
draft: false
---

升级 sing-box 后，旧 DNS 配置可能与当前核心接受的结构不同。官方迁移文档在 1.12.0 部分说明了新的 DNS server 格式。迁移应以实际运行的核心版本为准，不要直接将文档网站当前示例粘贴进不明版本的客户端。

## 先核对核心版本

记录旧版与目标版的核心版本、配置来源和完整错误信息。图形客户端的应用版本不等于它所使用的 sing-box 版本。独立命令行程序可以使用 `sing-box version` 查看版本；客户端则应按自身界面或日志提供的信息确认。

先备份完整配置，再在副本中修改 DNS。此处只解决 DNS server 结构变化；一般备份流程见[sing-box 配置迁移](/articles/sing-box-config-migration/)。

## 理解 address 到 type 的变化

官方迁移示例把旧的本地解析服务：

```json
{"dns":{"servers":[{"address":"local"}]}}
```

改为新的类型结构：

```json
{"dns":{"servers":[{"type":"local"}]}}
```

这两段都是结构对照，不是可直接连接代理的完整配置。其他 DNS 类型有自己的字段与拨号要求，不能把所有 `address` 一律改名为 `server`。例如旧格式的协议前缀可能需要拆成新格式的 `type` 和服务器地址；请逐项对照官方迁移示例。

## 保留引用关系再逐项修改

1. 列出所有 DNS servers 的类型、标签和被引用位置。
2. 对照目标版本文档迁移每个 server，保留规则中对应的标签关系。
3. 检查 DNS rules、默认解析器和出站域名解析的依赖，避免解析服务器本身又依赖尚未可用的解析路径。
4. FakeIP 等特殊类型应按专门的迁移段落处理，不能套用普通 UDP 服务示例。

官方迁移页还单列了出站 DNS 规则项和 domain strategy 的变更。只改 servers 数组，可能不足以迁移一份包含这些旧字段的配置。

## 在副本上校验与测试

独立核心可以先检查完整配置副本：

```text
sing-box check -c config.json
```

路径和文件名应换成自己的配置副本。确认检查通过后，再在可回滚的环境中测试一个固定域名，查看解析与连接日志。语法通过不代表 DNS 请求已经沿正确路径到达服务器。

如果目标客户端仍绑定旧核心，保留与其兼容的配置，不要为了消除警告混用不同版本的字段。上线后出现解析故障时恢复备份，并记录核心版本、迁移差异与脱敏日志，方便区分格式错误和网络故障。

## 官方来源与核验日期

- [sing-box 官方迁移文档](https://sing-box.sagernet.org/migration/)
- [sing-box 官方 DNS 配置](https://sing-box.sagernet.org/configuration/dns/)
- [sing-box 官方配置与检查命令](https://sing-box.sagernet.org/configuration/)

来源核验日期：2026-10-09。平台要求与命令行为以所用版本的官方文档为准。
