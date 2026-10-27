---
title: "mihomo geodata-mode：geoip 文件格式切换与回退检查"
category: "tutorials"
description: "根据 mihomo 官方全局配置文档核对 geodata-mode 的 geoip 文件格式，给出切换前备份、规则观察和失败回滚方法。"
date: "2026-10-26"
updated: "2026-10-26"
author: "NekoBox 中文指南编辑部"
draft: false
---

`geodata-mode` 决定 mihomo 使用的 geoip 文件格式。官方全局配置文档说明它可选 `true` 或 `false`，其中 `true` 表示使用 dat，默认值为 `false`。这只是 GEOIP 文件格式选择，不等于更新规则集，也不会自动改变代理组。切换前应确认本地资源和当前核心都支持目标格式。

## 先确认实际加载的资源

备份配置和 GEO 文件，记录核心版本、geoip 文件路径、规则中引用的 GEOIP 条件，以及切换前一组固定域名的命中结果。以运行时日志确认实际加载的文件；若已有加载错误，先保存错误文本。

## 核对 geodata-mode

官方文档给出的字段位于全局配置段，示例为：

```yaml
geodata-mode: true
```

把值设为 `true` 表示使用 dat；省略或设为 `false` 时按文档默认使用 mmdb。不要把 `geodata-loader`、`geo-auto-update` 或自定义下载地址一起修改，否则无法判断变化来自文件格式。切换前先确认目标文件确实存在，并使用当前核心的配置检查命令验证 YAML。

## 用固定规则观察变化

1. 选择一组固定域名，分别覆盖明确的国内、国外和未命中目标，记录原来的规则动作。
2. 仅切换 `geodata-mode`，重启或按客户端支持的方式重新加载资源。
3. 查看启动日志是否成功读取 geoip 文件，再重复相同域名测试。
4. 对比规则命中、最终出站和连接结果；不要把单个网站偶尔打开成功当作 GEO 数据完整的证据。

若出现文件解析错误、规则回落到 `MATCH` 或启动失败，立即恢复原配置和原资源文件。即使加载成功，资源版本差异也可能让地址分类变化，应保留对照记录。规则顺序可参考 [mihomo 规则顺序](/articles/mihomo-rule-order/)，代理集合异常可看 [mihomo 代理集合更新失败](/articles/mihomo-proxy-provider-update-failed/)。

## 官方来源

- [mihomo 全局配置：GEOIP 数据模式](https://wiki.metacubex.one/config/general/)

来源核验日期：2026-10-26。文档说明 `geodata-mode: true` 使用 dat，默认值为 `false`；本文未推断任何格式的性能或覆盖范围。
