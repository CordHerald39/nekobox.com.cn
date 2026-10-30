---
title: "sing-box local DNS 服务器：系统解析、平台差异与迁移检查"
category: "tutorials"
description: "按 sing-box 官方文档配置 type 为 local 的 DNS 服务器，区分新旧 local、平台解析接口与规则选择，排查切换后解析失败。"
date: "2026-10-30"
updated: "2026-10-30"
author: "NekoBox 中文指南编辑部"
draft: false
---

sing-box 的 `local` DNS 服务器用于本地解析路径，但它在不同平台上不一定采用同一种系统接口。把旧的 `address: local` 改为新的 `type: local` 前，需要确认所装内核支持新结构，并检查 DNS 规则是否真的选择了这个服务器。

## 先核对版本与现有解析路径

官方文档将新 `local` 服务器标为自 sing-box 1.12.0 起提供，这只是该配置结构的版本要求，不代表你的客户端已经包含对应内核。先从客户端信息或核心版本输出确认实际内核，再备份配置及旧 DNS 标签。

同时记录系统当前 DNS、其他 VPN、浏览器加密 DNS和失败域名。不要同时更换系统 DNS、TUN 劫持与 DNS 规则，否则无法判断是哪项改动影响结果。

## 在已有服务器列表中增加 local 条目

下面是待合并的局部结构，标签 `local-resolver` 必须在你的配置里保持唯一。保留其他服务器及原有规则，不要用这个片段覆盖整份配置。

```json
{
  "dns": {
    "servers": [
      {
        "type": "local",
        "tag": "local-resolver"
      }
    ]
  }
}
```

仅添加服务器不会证明测试域名使用了它。应检查现有 DNS 规则所引用的服务器标签或默认选择，把一个可控测试请求指向这个标签后观察日志。若原规则仍引用旧标签，先修正引用关系，再判断解析能力。

## 不把新旧 local 当作完全相同

官方文档列出两点差异：旧 local 仅处理 IP 请求，新结构处理全部请求类型，并支持 IP 请求并发；旧 local 在没有指定 `detour` 时使用默认出站，新结构采用类似出站的拨号器，默认相当于空的 direct 出站。因此不能只替换字段名而忽略此前依赖的请求路径。

`prefer_go` 属于另外的版本字段，文档标注自 1.13.0 起提供。本例不启用它。Android 图形客户端的 local 始终通过平台接口解析；Android 10 以下该接口只能解析 A/AAAA。Linux 与 Apple 平台也有各自的系统解析行为，不能把桌面测试结果直接套到 Android。

## 校验、测试与回退

将配置保存到现有工作目录后，按官方配置页执行 `sing-box check`，确认语法与引用通过；图形客户端则使用其配置检查入口，并确认实际加载的文件。校验通过只说明配置可解析，还需要重新发起 DNS 查询及应用连接。

先测试普通域名，再测试原本失败的内网域名，记录请求类型、结果、耗时与日志选择的服务器。若仍失败，恢复旧 DNS 块和规则引用，保留失败结果，不要删除全部缓存目录来掩盖错误。

旧写法的整体迁移可先看 [sing-box DNS 服务器配置迁移](/articles/sing-box-dns-server-migration/)；涉及路由内部解析器选择时，参看 [default_domain_resolver 检查](/articles/sing-box-route-default-domain-resolver-check/)。

## 官方来源

- [sing-box Local DNS 服务器](https://sing-box.sagernet.org/configuration/dns/server/local/)
- [sing-box 配置与 check 命令](https://sing-box.sagernet.org/configuration/)

来源核验日期：2026-10-30。
