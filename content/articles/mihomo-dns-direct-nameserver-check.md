---
title: "mihomo direct-nameserver：直连域名解析与策略跟随检查"
category: "tutorials"
description: "依据 mihomo 官方 DNS 文档区分直连出口、节点域名和默认解析，检查 direct-nameserver-follow-policy 的生效条件，按单域名对照与回退步骤排查直连失败。"
date: "2026-10-21"
updated: "2026-10-21"
author: "NekoBox 中文指南编辑部"
draft: false
---

mihomo 里节点可用、只有直连网站解析异常时，可以检查 direct-nameserver。这个字段给 direct 出口的域名解析指定 DNS；它和节点服务器域名的解析配置分别负责不同对象。先确认失败请求确实走直连，再调整解析路径，才能避免把连接故障误判为 DNS 配置错误。

## 先分清三个解析位置

官方文档将 `direct-nameserver` 定义为直连出口使用的解析服务器。没有填写时，遵循 `nameserver-policy`、`nameserver` 和 `fallback` 配置。因此，删除这个字段表示恢复通用解析链路，并不是让直连域名停止解析。

`proxy-server-nameserver` 用于节点域名解析；`default-nameserver` 用于解析 DNS 服务器自身的域名。把直连失败时用的服务器换进节点解析列表，未必会改变目标网站的结果。开始前把“要解析的域名、请求命中的出口、实际使用的解析服务器”分三列记下。

另一个容易遗漏的字段是 `direct-nameserver-follow-policy`：默认不遵循 `nameserver-policy`，并且只在 `direct-nameserver` 非空时生效。配置中看见域名策略，并不能据此认定每个直连查询都会使用它。

## 一次只调整一个条件

1. 备份当前实际加载的配置，记录客户端生成后的最终 DNS 段，避免只修改订阅原文。
2. 用一个已有直连规则的网站重现问题，记录域名、时间及连接日志；保留一个原本正常的网站作对照。
3. 检查是否填写了 `direct-nameserver`，以及其中的服务器在当前网络是否可达。先沿用已核实的服务器地址，不同时新增多个服务。
4. 如果目标是让现有域名策略也参与直连解析，确认列表非空，再单独修改跟随开关。
5. 使用当前核心的配置检查方式校验，再重新加载，发起新的请求并比对日志。

下面只是合并到既有 `dns` 段的一项修改，前提是该段已经包含有效、非空的直连解析服务器列表；不能将它当成完整配置覆盖文件：

```yaml
direct-nameserver-follow-policy: true
```

## 怎样判断改动是否生效

至少检查两类对象：一个命中现有 `nameserver-policy` 的直连域名，一个没有对应策略的直连域名。记录解析结果是否变化，同时核对最终连接仍命中预期的直连出口。若应用使用自己的加密 DNS，或请求根本没有进入当前核心，这组配置对照就不能说明应用的解析行为。

若只看到地址变化，随后连接仍失败，继续检查目标服务、端口以及系统路由。不同解析服务器可能返回不同地址，但地址不同本身不等于其中一方有错；需要结合相同网络下的访问结果判断。保留查询时间，避免把应用旧连接和新查询结果放在一起比较。

## 失败后的回退顺序

先把跟随开关恢复到备份值，再验证同一个目标。若仍异常，恢复原来的直连解析列表和最终配置，不要连带清空默认解析或节点解析。确认网络恢复后，再单独测试服务器可达性，或核对客户端是否在重载时重新生成了字段。

需要梳理通用解析链路时可先看 [mihomo DNS 配置检查](/articles/mihomo-dns-config-check/)；涉及按域名选择服务器时，结合 [nameserver-policy 配置](/articles/mihomo-dns-nameserver-policy/) 复查。软件来源与发布入口见 [mihomo 独立页面](/software/mihomo/)。

## 官方来源

- [mihomo DNS 配置：direct-nameserver 与策略跟随条件](https://wiki.metacubex.one/config/dns/)

来源核验日期：2026-10-21。本文说明字段检查方法，不代表已验证读者设备的网络环境。
