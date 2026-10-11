---
title: "Xray-core 日志配置：访问日志、错误等级与文件不生成排查"
category: "tutorials"
description: "按 Xray 官方日志配置说明区分 access 与 error，检查 stdout、文件路径和日志等级，用短时复现定位连接故障并核对敏感信息。"
date: "2026-10-11"
updated: "2026-10-11"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 没有生成预期日志文件，先检查输出位置与日志等级，再判断有没有流量进入核心。访问日志和错误日志可分别设置；把错误等级调高，不会自动把访问日志写到文件。本文提供适合短时排查的配置片段，保留原配置后再应用。

## access 与 error 分别记录

官方文档说明，`access`、`error` 不填写或为空时，输出到标准输出 stdout；值为 `none` 时关闭对应日志。因此没有磁盘文件可能只是日志在终端或服务管理器中，不能直接认定功能失效。`loglevel` 控制错误日志的级别，默认 `warning`。

以下是 Windows 的局部 `log` 配置。应用前先创建 `C:\Temp\Xray`，确认运行 Xray 的账户能够写入该目录；它不是完整代理配置。

```json
{
  "log": {
    "access": "C:\\Temp\\Xray\\access.log",
    "error": "C:\\Temp\\Xray\\error.log",
    "loglevel": "info",
    "dnsLog": false,
    "maskAddress": "full"
  }
}
```

JSON 中的 Windows 反斜杠需要转义。Linux 应使用自己的实际路径，并检查服务账户的写入权限，不能直接复制 Windows 路径。客户端可能重建配置，应确认最终加载的文件包含这段设置。

## 日志等级怎样选择

`error` 记录无法正常运行的问题；`warning` 还包含警告；`info` 再加入运行状态；`debug` 包含更多调试输出。高信息量等级包含较低信息量等级的内容。`none` 不记录相关内容。日常排查先用 `info`，必要时在短暂复现期间改为 `debug`，完成后恢复原等级。

`dnsLog` 用于 DNS 查询日志。仅在确需观察解析行为时开启，避免连接故障一律打开所有日志。日志多不代表问题更清楚，应同时记录一次请求的时间、目标与错误，便于关联。

## 文件不生成的检查顺序

1. 确认启动命令或服务加载的配置路径。使用多文件配置时，检查最终合并结果是否覆盖了 `log`。
2. 在配置副本上执行 `xray run -test -c config.json`。命令中的文件名应换成真实路径；校验通过仅说明配置合法，仍需启动服务。
3. 核对 `access`、`error` 是否为空或 `none`，查看终端及服务日志有没有输出。
4. 检查目录存在、文件可写以及运行账户。手动启动与服务启动的账户、工作目录可能不同。
5. 启动后只发起一个有明确时间的测试请求，再查看对应记录。完全没有访问记录时，继续检查请求是否进入预期入站，而不是先归咎于出站节点。

校验失败时可参考[Xray-core 配置校验](/articles/xray-core-config-test/)；更换可执行文件前先按[Windows 下载核验](/articles/xray-core-windows-download/)确认来源与平台，不要把日志路径问题当成安装包损坏。

## 分享前核对隐私，排查后恢复

`maskAddress` 的 `full` 可遮罩日志里的 IP 地址，但并不承诺删除域名、账户标识或所有配置内容。提交问题时只截取相关时间段，人工检查订阅链接、令牌和其他身份信息。多文件合并输出可能含真实凭据，也不应直接公开。

验收时确认日志位置、请求记录和错误等级符合预期，再恢复日常配置。短时调试完成后处理已有日志文件，避免长期累积；若重启后设置丢失，应回查生成配置的客户端或服务启动参数。

## 官方来源

- [Project X 日志配置](https://xtls.github.io/config/log.html)
- [Project X 命令参数](https://xtls.github.io/document/command.html)

来源核验日期：2026-10-11。字段支持情况以实际运行的 Xray-core 版本为准。
