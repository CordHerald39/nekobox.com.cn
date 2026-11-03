---
title: "mihomo IN-NAME 规则：listener 名称变更后不命中怎么查"
category: "tutorials"
description: "根据 mihomo 官方 IN-NAME 文档，检查入站名称、listeners 对象与规则引用，定位名称改动或客户端连接了其他入口导致的分流失效。"
date: "2026-11-03"
updated: "2026-11-03"
author: "NekoBox 中文指南编辑部"
draft: false
---

自定义 listener 能接受请求，但按名称写的分流规则没有命中，先比较 IN-NAME 的值与实际入站名称。它匹配的是入口名称，不是节点名称、代理组名称或配置文件名。

## 对照运行配置中的名称

打开客户端生成后的运行配置，找到目标 listeners 对象的 `name`，再检查规则中的引用。订阅转换、覆写或界面合并可能改变实际配置，不能只看原始文件。下面只展示规则，前提是已经有名为 local-http 的入站：

```yaml
rules:
  - IN-NAME,local-http,DIRECT
```

示例名称应替换为实际 listener 名称，策略也应使用现有对象。不要为了让规则命中而给多个监听器重复命名；排查时让每个入口有可区分的名称。

## 从入口到策略逐层检查

1. 保存当前配置和名称映射，执行核心配置检查。
2. 确认请求所用代理地址对应这个 listener，而非其他默认入口。
3. 新建连接，查看入站信息、命中规则与最终策略。
4. 若入口正确但规则未触发，检查上方规则是否先命中，以及覆写是否覆盖了规则列表。

改名时应一并核对所有 IN-NAME 引用。不要因名称规则失败就修改节点认证、TLS 或远端端口，这些字段不决定入站名称。没有改善时恢复原名称及规则，保留连接记录继续定位。

相关说明：[listeners 标签与端口](/articles/mihomo-listeners-inbound-config/)、[规则顺序](/articles/mihomo-rule-order/)。

## 官方来源

- [官方文档 1](https://wiki.metacubex.one/config/rules/)

来源核验日期：2026-11-03。
