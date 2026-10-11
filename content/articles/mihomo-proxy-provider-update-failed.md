---
title: "mihomo 代理集合更新失败：HTTP 下载、文件路径与健康检查分开查"
category: "tutorials"
description: "按 mihomo 官方 proxy-providers 文档区分代理集合下载更新与节点健康检查，检查类型、缓存路径、下载出站和过滤条件。"
date: "2026-10-11"
updated: "2026-10-11"
author: "NekoBox 中文指南编辑部"
draft: false
---

mihomo 代理集合更新失败，需要先确认失败的是文件下载，还是集合内节点的健康检查。`proxy-providers` 顶层的 `interval` 更新集合内容，`health-check.interval` 测试节点延迟；改后者不会让订阅文件重新下载。本文处理代理集合，不是规则集合，也不是客户端自己的完整配置订阅。

## 先按 type 确认输入来源

官方文档支持 `http`、`file` 和 `inline`。HTTP 类型需要 `url`；文件类型应核对 `path`；内联内容来自 `payload`。使用本地文件时，修改远程 URL 并不能替换正在读取的文件。

| 检查项 | 对应问题 |
| --- | --- |
| 集合名称 | 必须唯一，检查日志是否指向当前集合 |
| `url` | HTTP 地址是否失效，正文是否为预期配置 |
| `path` | 是否与另一集合共用缓存文件 |
| `interval` | 单位为秒，是否误写成其他时间单位 |
| `proxy` | 下载经过的代理是否存在且可连接 |

`path` 可省略，文档说明此时使用 URL 的 MD5 作为文件名；显式路径不能重复。路径受工作目录 HomeDir 限制，只有确需其他目录时才按文档配置 `SAFE_PATHS`。不要为消除报错随意扩大到整个磁盘，也不要先删除仍能使用的缓存。

## 把请求失败与内容失败拆开

1. 备份当前配置与对应集合文件，记录内核版本和本次错误时间。
2. 检查同一 URL 的状态与正文。如果得到认证错误，核对提供方要求的请求头；网页登录成功不能证明核心带上了相同凭据。
3. 如使用 `proxy` 下载，单独测试该出站，确认不是下载路径失效。不要未经检查就将所有下载强制改为直连。
4. 状态正常但解析失败时，核对提供方返回的是否为该核心接受的代理集合内容，排除 HTML 错误页和格式变化。
5. 内容解析成功但节点变少时，检查 `filter`、`exclude-filter`、`exclude-type`，并核对节点名称是否发生变化。

节点被过滤、未被策略组引用，与下载失败是不同分支。升级后才出问题时，可参阅[mihomo 配置版本迁移](/articles/mihomo-config-version-migration/)，确认新旧核心实际接受的字段。

## 健康检查不能证明更新成功

`health-check.interval` 同样以秒计，`timeout` 以毫秒计。`lazy` 默认 true，集合没有被使用时可能不进行测试。看到延迟未刷新，应先检查是否使用了该集合，而不是直接认定 URL 下载失败。

官方 API 将更新与检查区分开：`PUT /providers/proxies/集合名称` 更新集合，`GET /providers/proxies/集合名称/healthcheck` 执行健康检查。这里的名称要使用实际集合名并正确编码；API 密钥和订阅令牌应只在本机处理。控制面板连不上时，先读[控制接口连接排查](/articles/mihomo-controller-connect-failed/)。

## 验收应留下两份记录

更新完成后，核对集合节点名称、数量和更新时间，再对一个实际使用的节点做健康检查与短请求测试。文档允许 HTTP 或文件解析失败时使用 `payload` 作为备用代理，因此仍能联网也未必意味着本次下载成功。应以日志及集合内容变化作为更新证据，以新请求的连接记录作为可用性证据。

## 官方来源

- [mihomo 代理集合配置](https://wiki.metacubex.one/config/proxy-providers/)
- [mihomo API：代理集合更新与健康检查](https://wiki.metacubex.one/api/)

来源核验日期：2026-10-11。具体字段按已安装核心版本核对。
