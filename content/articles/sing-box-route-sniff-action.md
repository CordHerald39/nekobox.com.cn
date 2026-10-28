---
title: "sing-box route sniff：协议嗅探动作与分流验证"
category: "tutorials"
description: "使用 sing-box 官方 Route Rule 与 Protocol Sniff 文档说明 sniff 动作的配置位置、验证方法和回滚边界。"
date: "2026-10-28"
updated: "2026-10-28"
author: "NekoBox 中文指南编辑部"
draft: false
---

sing-box 的 route sniff 动作用于为后续规则提供协议或域名信息。官方 Protocol Sniff 与 Route Rule 文档分别说明嗅探能力和规则组合方式。嗅探成功只代表获得匹配信息，不能直接证明目标连接成功。

## 先确认入站与规则顺序

备份配置，记录入站类型、规则顺序、目标域名、目标端口和预期出站。优先选一个能稳定复现的请求，避免用缓存连接判断新规则。

## 添加最小动作

在现有路由规则中只增加一条与目标条件明确对应的 sniff 动作。字段结构以当前版本文档为准，动作位置示意：

{
  "route": {
    "rules": [
      {
        "action": "sniff"
      }
    ]
  }
}

运行配置检查后重载，观察日志是否出现 sniff 结果、规则是否命中以及最终出站标签。

## 验证和回滚

1. 用原配置请求一次，保存日志作为基线。
2. 只启用 sniff，再用同一目标发起新连接。
3. 对比嗅探结果、下一条规则和出站。
4. 失败时删除新增动作并恢复备份，继续检查入站权限与 TLS。

需要理解端口和网络条件时，可参考 [sing-box network 规则](/articles/xray-core-routing-network-check/)。

## 官方来源

- [Protocol Sniff](https://sing-box.sagernet.org/configuration/route/sniff/)
- [Route Rule](https://sing-box.sagernet.org/configuration/route/rule/)

来源核验日期：2026-10-28。


