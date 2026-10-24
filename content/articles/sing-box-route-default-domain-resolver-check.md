---
title: "sing-box default_domain_resolver：路由域名解析器怎么查"
category: "tutorials"
description: "解释 sing-box 路由默认域名解析器的作用范围，核对 DNS 标签、规则命中与 final 出站。"
date: "2026-10-24"
updated: "2026-10-24"
author: "NekoBox 中文指南编辑部"
draft: false
---

sing-box 路由规则使用域名条件时，需要分清“规则怎样匹配”和“域名由谁解析”。官方路由文档提供 default_domain_resolver，用于为路由阶段指定默认域名解析器。规则没有命中、解析走错出口或启用 fake-ip 后行为不一致时，应先核对这个字段的实际作用范围。

## 先记录规则与解析链路

备份配置，记录 route.rules 顺序、final 出站、DNS server 标签以及触发问题的域名。一个域名可能先被规则识别，再由解析器得到 IP；也可能因为规则条件只接受 IP 而提前进入其他分支。不要用一次旧连接的结果代替新请求验证。

## 检查 default_domain_resolver

在当前版本官方配置结构中，default_domain_resolver 属于 route 配置。示例只展示字段关系：

```json
{
  "route": {
    "default_domain_resolver": "dns-local",
    "final": "proxy"
  }
}
```

`dns-local` 必须对应已有 DNS server 或解析器标签，不能把监听端口、URL 或节点名称混作标签。保留原有 rules 与 final，先做配置检查，再用一个明确的域名规则发起新连接。若解析器标签不存在，优先修正引用关系；不要为了绕过报错直接删掉域名规则。

## 用最小改动验收

1. 运行 `sing-box check` 或当前客户端的配置校验。
2. 只测试一个命中域名规则和一个走 final 的域名。
3. 记录 DNS 查询服务器、规则命中和最终出站。
4. 将 default_domain_resolver 恢复原值，确认对照结果可重复。

如果问题发生在 DNS server 本身，继续看 [DNS server 地址解析](/articles/sing-box-dns-server-migration/)；如果规则命中但出口错误，查看 [route.final 动作](/articles/sing-box-route-final-action/)。配置迁移时还要保留 [sing-box 配置迁移清单](/articles/sing-box-config-migration/) 中的标签映射。

## 官方来源

- [sing-box route 配置](https://sing-box.sagernet.org/configuration/route/)

来源核验日期：2026-10-24。示例只解释字段关系，不代表对某个节点或网络的实测结果。

