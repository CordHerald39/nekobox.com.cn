---
title: "Xray-core 路由规则：域名、inboundTag 与默认出站怎么检查"
category: "tutorials"
description: "根据 Xray 官方路由文档检查规则顺序、域名匹配、多个条件同时满足和默认出站，避免配置校验通过却走错节点。"
date: "2026-10-12"
updated: "2026-10-12"
author: "NekoBox 中文指南编辑部"
draft: false
---

Xray-core 配置能启动，却让某个域名走了错误出站，应先检查规则是否命中。路由检查需要知道请求来自哪个入站、目标是域名还是 IP，以及最终使用哪个出站标签。本文用少量规则说明这一过程，不包含服务器节点配置。

## 先建立能追踪的规则

[Xray 官方路由文档](https://xtls.github.io/config/routing.html)说明，规则从上到下匹配，第一条生效规则决定出站。以下是顶层 `routing` 的局部示例；`local-socks` 必须是已有入站标签，`direct` 和 `proxy` 必须是已有出站标签。

```json
{
  "routing": {
    "domainStrategy": "AsIs",
    "rules": [
      {
        "inboundTag": ["local-socks"],
        "domain": ["full:example.com"],
        "outboundTag": "direct"
      },
      {
        "inboundTag": ["local-socks"],
        "network": "tcp,udp",
        "outboundTag": "proxy"
      }
    ]
  }
}
```

这组规则只针对 `local-socks`：精确匹配 `example.com` 的连接走 `direct`，来自同一入站的其他 TCP/UDP 连接走 `proxy`。不同入站的请求不能直接套用这个结论。示例域名用于展示语法，实际测试应换成自己明确要分流的目标。

## 匹配条件为什么会失效

同一规则里填写多个属性，要求这些条件同时成立。上例第一条必须同时符合入站标签与域名；把请求从另一个入口发出，即使域名相同也不会命中。

`full:` 是完整域名匹配，`domain:` 匹配该域名及其子域名。需要覆盖子域名时，应先明确范围，再选择语法。不要把裸字符串误当成精确匹配；官方文档将其解释为子串匹配。使用 `AsIs` 时，路由不主动为匹配解析域名，若入站提供的是 IP，不能仅凭浏览器地址栏推断路由已经拿到域名。

## 兜底不一定是名为 proxy 的出站

所有规则都未命中时，官方说明流量由 `outbounds` 中的第一项发出。因此调整出站数组顺序也可能改变未匹配连接的行为。上面的第二条是针对一个入站的兜底，其他入站仍需检查自己的路径。

先画出一条请求的条件：实际入站标签 → 实际目标 → 从第一条开始匹配 → 出站标签。宽泛规则位于具体规则之前时，后面的具体规则可能没有机会生效。没有必要一开始就加入大量 geosite 或 geoip 规则；少量明确目标更容易定位问题。

## 校验和实际分流分别验收

保存副本后，按[官方命令参数](https://xtls.github.io/document/command.html)执行 `xray run -test -config config-test.json`，文件名换成实际路径。检查成功说明配置合法，不能证明真实请求已经命中目标规则。

加载后从指定入口分别发起精确目标、一个不匹配的目标，以及另一个入站的对照请求。核对日志中实际出站与预期路径；必要时参考[日志配置](/articles/xray-core-log-config/)。第一组与第二组按不同规则出站，第三组符合其原有规则或默认出站，才算完成验收。

## 官方来源

- [Xray 路由规则、匹配条件与默认出站](https://xtls.github.io/config/routing.html)
- [Xray 命令参数与配置校验](https://xtls.github.io/document/command.html)

来源核验日期：2026-10-12。安装的核心版本应支持所用字段；启动失败可先按[配置校验指南](/articles/xray-core-config-test/)处理。
