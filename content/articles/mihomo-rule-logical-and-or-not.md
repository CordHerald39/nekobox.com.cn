---
title: "mihomo AND、OR、NOT 规则：组合条件与括号怎么写"
category: "tutorials"
description: "依据 mihomo 官方规则文档，区分 AND、OR、NOT 的匹配含义，检查括号、规则顺序与策略名称，并用新连接核对命中结果。"
date: "2026-11-03"
updated: "2026-11-03"
author: "NekoBox 中文指南编辑部"
draft: false
---

需要让“某个域名的 UDP 请求”使用单独策略时，两条普通规则不能表达两个条件必须同时成立。mihomo 提供 AND、OR、NOT 逻辑规则，配置前先写清希望匹配的连接范围，再决定组合方式。

## 先把条件写成一句话

AND 要求子条件同时成立，OR 表示其中一个成立即可，NOT 对括号内条件取反。官方示例使用嵌套括号包住各个子条件，不能省掉外层括号。下面是放入现有 `rules` 列表中的局部示例：

```yaml
rules:
  - AND,((DOMAIN,example.com),(NETWORK,UDP)),DIRECT
```

这条规则只把 example.com 的 UDP 连接送往 DIRECT；同域名的 TCP 连接会继续向下匹配。请把域名和策略换成实际需求，保留其他现有规则。不要把 DIRECT 当作所有环境都适用的选择。

## 用命中记录检查三个边界

1. 备份配置，确认规则位于兜底 MATCH 之前，策略名称存在。
2. 运行当前核心的配置检查，先排除括号与 YAML 层级错误。
3. 分别创建满足全部条件、只满足一个条件、完全不满足条件的新连接。
4. 查看连接面板中的网络类型、匹配规则与最终策略，确认只有预期范围被选中。

规则从上到下匹配，前面的宽泛规则可能提前接走连接。NOT 容易扩大范围，应先在有限目标上验证；结果不符时恢复原列表，再检查规则顺序。

延伸阅读：[规则顺序检查](/articles/mihomo-rule-order/)、[规则集格式](/articles/mihomo-rule-provider-format/)。

## 官方来源

- [官方文档 1](https://wiki.metacubex.one/config/rules/)

来源核验日期：2026-11-03。
