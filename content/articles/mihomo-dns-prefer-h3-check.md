---
title: "mihomo DNS prefer-h3：启用前的条件与回退排查"
category: "tutorials"
description: "依据 mihomo 官方 DNS 配置文档检查 prefer-h3 的适用条件、HTTPS 记录和回退结果，避免把解析失败误判为协议故障。"
date: "2026-10-19"
updated: "2026-10-19"
author: "NekoBox 中文指南编辑部"
draft: false
---

prefer-h3 只影响 DNS 请求是否优先尝试 HTTP/3。它不能替代可用的 DNS 地址，也不能修复所有代理连接问题。修改前先备份当前配置，并记录原始解析结果。

## 先确认条件

1. 打开当前版本的 mihomo DNS 配置文档，确认版本支持该字段。
2. 确认 nameserver 或 fallback 使用的是支持 HTTPS 的 DNS 地址。
3. 只增加一项测试配置，保留原有 fallback 和 fallback-filter。
4. 用同一域名分别记录启用前后的解析结果和日志。

## 按结果定位问题

如果日志显示 HTTP/3 不可达，先检查网络、防火墙和域名解析，再观察是否回退到普通 HTTPS 或其他 nameserver。优先尝试不等于强制使用；不要因为一次回退就关闭全部 DNS 安全选项。

配置能被加载只说明字段格式正确。若目标应用仍无法连接，还要继续检查规则、出站和系统接管范围。可结合 [mihomo DNS 配置检查](/articles/mihomo-dns-config-check/) 和 [mihomo DNS fallback-filter](/articles/mihomo-dns-fallback-filter-check/) 复核。

## 官方来源

[mihomo DNS 配置](https://wiki.metacubex.one/config/dns/)

来源核验日期：2026-10-19。
