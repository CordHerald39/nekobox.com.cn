---
title: "sing-box DNS reverse_mapping：反向映射与域名恢复检查"
category: "tutorials"
description: "按 sing-box 官方 DNS 文档检查 reverse_mapping 的作用范围，区分地址映射、缓存命中和代理规则。"
date: "2026-10-28"
updated: "2026-10-28"
author: "NekoBox 中文指南编辑部"
draft: false
---

DNS 返回地址后，应用日志有时只显示 IP，排查人员难以判断该地址对应的域名。sing-box 官方 DNS 文档提供 reverse_mapping 选项，用于保留地址到域名的关联。它不替代上游 DNS，也不负责修复 TLS 或路由。

## 先保留可比样本

备份配置，选择能稳定查询的域名，记录查询类型、返回地址、使用的 server、缓存状态和后续出站。不要同时改动 independent_cache、规则或 fake-IP 设置。

## 开启后观察映射

在现有 dns 段内只加入一个布尔字段：

{
  "dns": {
    "reverse_mapping": true
  }
}

使用当前版本的配置检查命令验证类型，再重载核心。对同一域名发起新查询和新连接，观察日志是否能把返回地址关联回域名；旧缓存与旧连接需要清理后再比较。

## 区分三类结果

- 查询失败：先检查 DNS server、网络和规则条件。
- 查询成功但没有映射：确认字段生效、缓存是否复用以及日志是否记录映射。
- 映射存在但连接失败：继续检查 TLS、出站和目标服务。

确认结果后恢复备份或保留单项改动，并记录核心版本。可参考 [sing-box DNS 客户端子网](/articles/sing-box-dns-client-subnet-check/)。

## 官方来源

- [sing-box DNS 配置](https://sing-box.sagernet.org/configuration/dns/)

来源核验日期：2026-10-28。

