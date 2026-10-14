---
title: "Xray-core DNS hosts：精确域名映射与不生效排查"
category: "tutorials"
description: "按 Xray 内置 DNS 文档设置 hosts 静态映射，理解精确匹配、IP 与域名映射的处理边界，区分系统查询和实际经过核心的 DNS 请求。"
date: "2026-10-15"
updated: "2026-10-15"
author: "NekoBox 中文指南编辑部"
draft: false
---

给 Xray-core 的 `dns.hosts` 加了映射，系统查询结果却没变化，先确认查询是否经过核心的内置 DNS。这个对象不是操作系统 hosts 文件，也不会自动修改系统解析设置。排查应从一条确定经过 Xray DNS 的查询开始，避免在错误的查询路径上反复换地址。

## 从精确匹配的一项开始

[官方 DNS 文档](https://xtls.github.io/config/dns.html)说明，内置解析先检查 hosts 映射；未得到所需 IP 时继续查询配置的 DNS 服务器。无前缀的键默认使用 `full:` 精确匹配，与路由中裸字符串的含义有差别。

以下是局部片段，使用保留测试域名并映射到回环。它只用来验证本机映射流程，不会在回环地址创建网站；真实业务须替换成经确认的域名和正确地址，保留已有 DNS 服务器与路由。

```json
{
  "dns": {
    "hosts": {
      "full:probe.example.com": "127.0.0.1"
    }
  }
}
```

不要用该片段整段替换已有 `dns`，否则可能丢失原服务器配置。精确键只覆盖该名称，不能用访问另一个子域的结果判断它是否生效。映射到 IP 后仍须满足服务、TLS 主机名及网络路径要求，IP 正确也不保证业务成功。

## 域名映射与多地址有边界

官方允许值为单个地址或地址列表，地址可为 IP 或域名。包含 IP 和域名的混合结果会去掉域名、返回 IP；同时出现多个域名会形成歧义并视为失败。只有一个域名时会递归处理，文档规定最大递归深度为五。

首次设置尽量用一条明确的 IP 映射，别用互相引用的域名链。需要多个地址时记录每个地址的来源和用途，再检查 IPv4/IPv6 查询策略；返回了地址列表也不是按顺序自动故障切换的承诺。

## 确认实际查询路径

1. 备份配置，记录核心版本、目标域名和修改前的日志。
2. 合并一项映射，按[官方命令](https://xtls.github.io/document/command.html)用 `xray run -test -config config-test.json` 校验。
3. 保持原启动方式加载，核对最终配置是否含这项 hosts。
4. 从现有、已确认会使用内置 DNS 的请求路径发起新查询，观察核心日志中的解析与连接目标。
5. 对比一个未映射的目标，并确认原有 DNS 请求仍能完成。

直接执行系统解析工具只能验证系统所用的 DNS；除非已配置到核心的相应入口，不能以这个结果证明 hosts 无效。官方说明内置 DNS 是否在路由阶段被调用，还与 `routing.domainStrategy` 等设置有关，见[路由配置指南](/articles/xray-core-routing-rules/)。

## 不要用静态 IP 掩盖根因

地址会随服务调整，静态映射应有核验日期与恢复方式。域名查询未进入核心时，先修路径；TLS 错误继续查时间、证书和主机名，不要直接关闭校验。用[日志指南](/articles/xray-core-log-config/)记录脱敏结果，异常时撤销本次映射并恢复备份，保持其他 DNS 设置不变。

## 官方来源

- [https://xtls.github.io/config/dns.html](https://xtls.github.io/config/dns.html)
- [https://xtls.github.io/document/command.html](https://xtls.github.io/document/command.html)

来源核验日期：2026-10-15。配置说明以本机核心版本支持范围为准。
