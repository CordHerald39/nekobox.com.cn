---
title: "Xray-core sockopt mark：Linux 策略路由标记不生效怎么查"
category: "tutorials"
description: "根据 Project X 官方 Sockopt 文档，检查 mark 的 Linux 与 CAP_NET_ADMIN 边界，区分 socket 标记、ip rule 和路由表，并用新连接验证。"
date: "2026-11-05"
updated: "2026-11-05"
author: "NekoBox 中文指南编辑部"
draft: false
---

Linux 上已有策略路由，希望 Xray-core 出站进入指定路由表时，可以核对 `streamSettings.sockopt.mark`。官方定义：值非零时，以该整数为 outbound 连接设置 `SO_MARK`；它仅适用于 Linux，并需要 `CAP_NET_ADMIN` 权限。填写数字本身不会创建系统策略规则。

## 分清应用规则和内核规则

先备份 Xray 配置，记录出站标签、运行用户、核心版本，以及系统当前的策略规则。Xray 的域名、来源地址等规则先决定采用哪个出站；mark 再影响这个出站连接的底层路径。若请求命中了另一个出站，该项标记不会替它生效。

`sendThrough` 用于指定本地地址，和 `SO_MARK` 选择策略路由的作用不同。需要绑定地址时可看 [sendThrough 检查](/articles/xray-core-outbound-send-through/)，不要把两种设置混成一个“固定出口”开关。

## 在目标出站内放置 mark

下面只展示某个 outbound 的传输配置片段。数值 100 只是测试标记，必须与自己已经确认的系统规则一致，不是通用路由表编号：

```json
{
  "streamSettings": {
    "sockopt": {"mark": 100}
  }
}
```

保留原节点与协议字段，运行 `xray run -test -config config-test.json`，文件名换成配置副本。配置校验不能替代系统权限检查；容器或服务进程即使使用同一配置，也可能没有所需能力。应先查看运行方式和错误日志，避免为一次测试给服务增加过宽权限。

## 先只读检查系统路由

在 Linux 查看 `ip rule show` 和 `ip route show table all`，确认标记匹配、规则优先级及目标路由表。不要执行清空规则命令。可用以下只读查询对照一个目标的路由结果：

```sh
ip route get 1.1.1.1 mark 100
```

把地址和 mark 换成测试连接的实际值。该命令查询路由选择，不发送代理请求，也不能证明 Xray 已给 socket 设置了标记。若只有查询结果正确，真实连接却未带标记，应回到进程加载配置与权限检查，不能据此认定绑定已经生效。

重载后关闭旧连接，使用固定目标发起新请求，检查实际出站、标记与出口。规则查询正确但连接仍失败时，分别核对权限、回程路由和远端握手；不要继续改节点认证。无改善时恢复原 mark 和配置，保留测试记录。应用规则未命中则转到 [Xray 路由规则](/articles/xray-core-routing-rules/)。本文未执行真实主机的策略路由改写或联网测试。

## 官方来源

- [官方来源 1](https://xtls.github.io/config/transports/sockopt.html)
- [官方来源 2](https://xtls.github.io/document/command.html)

来源核验日期：2026-11-05。
