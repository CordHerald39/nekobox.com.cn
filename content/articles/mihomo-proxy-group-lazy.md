---
title: "mihomo proxy-group lazy：代理组延迟加载与启动排查"
category: "tutorials"
description: "根据 mihomo 官方代理组文档检查 lazy 的行为、启动时节点列表与首次请求触发关系。"
date: "2026-10-28"
updated: "2026-10-28"
author: "NekoBox 中文指南编辑部"
draft: false
---

代理组节点很多时，启动阶段与首次请求阶段可能呈现不同的加载现象。mihomo 官方代理组文档将 lazy 列为代理组参数，排查时应把它与健康检查、选中节点和请求结果分开记录。

## 先确定观察对象

备份配置，记录代理组类型、节点数量、interval、lazy、当前选中节点和核心日志。启动后先观察代理组是否出现、首次请求何时触发节点检查，以及节点列表是否完整。

## 用最小代理组做对照

复制配置，只保留两个能确认来源的节点，临时设置以下字段：

proxy-groups:
  - name: Auto
    type: url-test
    url: https://www.gstatic.com/generate_204
    interval: 300
    lazy: true
    proxies:
      - node-a
      - node-b

示例仅说明字段位置；实际探测地址和节点名必须来自你的环境。重载后分别观察启动、首次请求和切换节点时的日志。

## 验证和恢复

1. 使用核心配置检查命令确认数组结构与布尔类型。
2. 用同一目标地址发起新请求，记录命中代理组和实际出站。
3. 将 lazy 改回原值再测试，比较启动、首次请求和切换行为。
4. 异常时恢复备份；连接故障可继续查看 [mihomo url-test 自动选择](/articles/mihomo-url-test-tolerance/)。

## 官方来源

- [mihomo 代理组配置](https://wiki.metacubex.one/config/proxy-groups/)

来源核验日期：2026-10-28。

