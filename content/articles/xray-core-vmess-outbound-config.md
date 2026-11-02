---
title: "Xray-core VMess 出站配置：users 与传输参数迁移检查"
category: "tutorials"
description: "参考 Project X 官方 VMess 出站文档，核对服务器、users、security、alterId 与 streamSettings 的层级和兼容边界，避免把旧客户端字段直接混用。"
date: "2026-11-02"
updated: "2026-11-02"
author: "NekoBox 中文指南编辑部"
draft: false
---

VMess 节点迁移后出现认证失败，先比较实际运行配置中的服务器地址、端口和 `users` 数组。官方文档把用户认证和传输设置分开描述，旧客户端导出的字段不能未经核对就复制到新的核心配置。

## 只迁移已确认的字段

保留原配置副本，隐藏 UUID 后逐项比较 `id`、`alterId`、`security` 与传输对象。局部示例仅说明层级：

```json
{
  "protocol": "vmess",
  "settings": {"vnext": [{"address": "example.invalid", "port": 443, "users": [{"id": "<uuid>", "alterId": 0, "security": "auto"}]}]}
}
```

示例值不是下载链接或可用节点。`alterId` 是否接受取决于服务端和核心版本，不能因为字段存在就推断兼容。

## 用最小变化测试

1. 先执行配置检查，确认 JSON 结构和出站标签。
2. 仅替换已核实的认证或传输字段，重新连接。
3. 按错误阶段区分 DNS、TCP、TLS 和认证失败。
4. 没有改善时回滚，向节点维护方确认实际协议和传输。

不要把关闭 TLS 校验作为迁移测试手段，也不要公开敏感用户字段。

## 官方来源

- [官方文档 1](https://xtls.github.io/config/outbounds/vmess.html)

来源核验日期：2026-11-02。
