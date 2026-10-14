---
title: "mihomo 规则集合格式：behavior、format 与 RULE-SET 怎么对应"
category: "tutorials"
description: "按官方文档区分 mihomo 规则集合的 domain、ipcidr、classical 和 yaml、text、mrs，使用本地文件检查内容语法与 RULE-SET 引用。"
date: "2026-10-15"
updated: "2026-10-15"
author: "NekoBox 中文指南编辑部"
draft: false
---

mihomo 能下载规则文件，仍可能因为 `behavior`、`format` 或引用不匹配而无法正确分流。排查时把三件事分开：文件从哪里来、文件如何编码、每条内容属于哪种规则。先用一个本地小集合验证语法，再接入实际可核验的远端来源。

## behavior 和 format 各管什么

[规则集合配置文档](https://wiki.metacubex.one/config/rule-providers/)把 `behavior` 分为 `domain`、`ipcidr`、`classical`；`format` 可选 `yaml`、`text`、`mrs`，默认 `yaml`。其中 mrs 当前只支持 domain 和 ipcidr，不应把 classical 文件仅改扩展名后当成 mrs。

[集合内容文档](https://wiki.metacubex.one/config/rule-providers/content/)规定，classical 条目携带规则类型，如 `DOMAIN-SUFFIX,example.com`；domain 条目直接写域名模式；ipcidr 条目写地址范围。集合的条目不附最终出站策略，出站由主配置的 `RULE-SET` 引用指定。

## 用本地 classical 集合核对结构

在 mihomo 实际 HomeDir 下新建测试文件 `rules/local-check.yaml`。这是自有测试目标的语法示例，使用时替换成明确需要分流的域名：

```yaml
payload:
  - DOMAIN-SUFFIX,example.com
```

把下列片段合并进配置副本；已有同名键时修改原对象，别再增加第二个 `rules` 列表。原有规则须保留，新增测试引用放在会抢先匹配它的宽泛规则之前。

```yaml
rule-providers:
  local-check:
    type: file
    behavior: classical
    format: yaml
    path: ./rules/local-check.yaml
rules:
  - RULE-SET,local-check,DIRECT
```

这是局部片段，不能覆盖整份配置。`path` 不能与其他集合重复；官方对路径的安全限制以 HomeDir 为基础。优先把测试文件放在该目录内，没必要为格式排查扩大可写路径。

## 从加载到命中逐项确认

1. 备份可用配置，记录当前内核版本、HomeDir 和集合名称。
2. 确认文件保存为 UTF-8，YAML 有 `payload` 列表，条目语法对应 classical。
3. 运行客户端现有配置校验，加载后看集合是否存在、是否有解析错误。
4. 新建目标请求，核对命中的 RULE-SET 与最终出站；无关目标应保持原路径。

下载成功与规则命中分别验收。[官方路由规则](https://wiki.metacubex.one/config/rules/)说明规则从上到下检查，前置规则可能先命中，详见[顺序检查](/articles/mihomo-rule-order/)。代理提供者保存的是节点，规则提供者保存的是匹配内容，前者问题见[节点集合更新排查](/articles/mihomo-proxy-provider-update-failed/)。

## 接回远端来源和回退

本地小集合通过后，再核对远端文件真实格式、`type: http` 所需 URL 和更新路径，不从扩展名猜内容。不通时保留旧可用集合及错误，撤销测试引用；升级后才出现解析变化可对照[配置迁移](/articles/mihomo-config-version-migration/)。不要清空所有订阅来修一份规则文件。

## 官方来源

- [https://wiki.metacubex.one/config/rule-providers/](https://wiki.metacubex.one/config/rule-providers/)
- [https://wiki.metacubex.one/config/rule-providers/content/](https://wiki.metacubex.one/config/rule-providers/content/)
- [https://wiki.metacubex.one/config/rules/](https://wiki.metacubex.one/config/rules/)

来源核验日期：2026-10-15。配置说明以本机核心版本支持范围为准。
