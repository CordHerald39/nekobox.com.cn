---
title: "mihomo fallback 自动回退：节点顺序、健康检查与切换验收"
category: "tutorials"
description: "按 mihomo 官方 fallback 和代理组文档设置备用节点，核对 proxies 顺序、健康检查范围与 lazy 行为，通过新请求判断是否发生回退。"
date: "2026-10-14"
updated: "2026-10-14"
author: "NekoBox 中文指南编辑部"
draft: false
---

mihomo 的一个节点失效后，希望请求能转到备用节点，可以使用 fallback 代理组。配置前先确定备用顺序和检查目标，再让测试流量进入这个组；如果请求仍走其他组，增加 fallback 并不会改变连接路径。

## 按使用优先级排列节点

[官方 fallback 文档](https://wiki.metacubex.one/config/proxy-groups/fallback/)说明，当前节点超时后，代理组按顺序选择第一个可用节点。以下是要加入已有配置的代理组片段，节点名称必须替换成自己配置中真实存在的名称。保留已有 `proxies`、入站和路由，不要用片段覆盖整份 YAML。

```yaml
proxy-groups:
  - name: "备用连接"
    type: fallback
    proxies:
      - "主用节点"
      - "备用节点"
    url: "https://www.gstatic.com/generate_204"
    interval: 300
    lazy: false
```

300 秒是示例检查间隔，测试地址也沿用官方示例；应确认该地址在自己的网络和节点路径下可以访问。节点排列表示回退优先顺序，不能将测试结果解释为最快节点排名，也不能据此承诺连接无中断。

## 核对检查覆盖了哪些节点

[代理组通用字段](https://wiki.metacubex.one/config/proxy-groups/)规定，组内 `url` 检查 `proxies` 引用的代理，不检查通过 `use` 引入的代理集合节点。已有配置使用代理集合时，另行核对集合自身的健康检查，相关故障可参考[代理集合更新检查](/articles/mihomo-proxy-provider-update-failed/)。

`interval` 非零时启用定时检查，单位是秒。`lazy` 默认开启，未选中当前组时不测试；上例在测试阶段设为 `false`，方便观察未被选择时的定时结果。长期配置应按实际需求决定，避免误把没有新测试记录判断成所有节点不可用。

## 用测试流量确认回退

1. 保存当前配置副本，记录实际 mihomo 版本、组名、节点名称和原有出站。
2. 在副本中合并代理组，按当前客户端提供的配置校验入口检查；核对最终运行配置确实包含该组。
3. 通过既有选择组或一条测试规则将固定目标交给“备用连接”，保留其他流量的原路径。
4. 发起一个新请求，记录当前使用的成员、检查时间及目标响应。
5. 在自己可控制的测试环境中让主用节点暂时不可用，观察健康检查和下一次新请求是否转到备用节点。
6. 恢复主用节点及原测试规则，重新请求并记录结果。

没有条件让主用节点失效时，可验收正常路径和备用节点各自是否可用，但尚未验证故障回退。不要用仍在传输的旧连接判断新选择；查看新连接记录更容易确认这次请求的路径。

## 没有切换时从路径查起

先查请求是否命中 fallback 组。未命中时按[规则顺序检查](/articles/mihomo-rule-order/)排查；已命中时再看节点检查结果、测试地址和节点名称。所有候选均不可用时，修改排列顺序不能修复节点本身。

测试地址可达而业务目标失败时，记录两种结果，继续检查目标访问范围和连接错误。出现异常则恢复原有选择与测试规则，保留发生时间及脱敏日志；升级前可参考[配置迁移与回退](/articles/mihomo-config-version-migration/)。图形客户端合并配置和内核字段支持范围应以安装版本为准。

## 官方来源

- [mihomo fallback 自动回退](https://wiki.metacubex.one/config/proxy-groups/fallback/)
- [mihomo 代理组通用字段](https://wiki.metacubex.one/config/proxy-groups/)

来源核验日期：2026-10-14。
