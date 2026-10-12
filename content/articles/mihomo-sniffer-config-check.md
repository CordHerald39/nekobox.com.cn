---
title: "mihomo 嗅探配置：协议端口、域名恢复与目标覆盖怎么验收"
category: "tutorials"
description: "依据 mihomo 官方域名嗅探文档检查 sniffer、协议端口与 override-destination，使用可回退对照测试排查域名规则未命中。"
date: "2026-10-12"
updated: "2026-10-12"
author: "NekoBox 中文指南编辑部"
draft: false
---

mihomo 连接记录只显示 IP，域名规则没有按预期命中时，可以检查域名嗅探是否适用于这条流量。嗅探从已接管的协议流量中尝试识别域名；它需要匹配协议和端口，不能保证每条连接都得到域名。本文重点是验证嗅探行为以及目标覆盖带来的变化。

## 用小范围配置建立对照

[mihomo 官方域名嗅探文档](https://wiki.metacubex.one/config/sniff/)列出的协议是 HTTP、TLS 与 QUIC。先保留修改前的配置和一个能复现问题的目标，再在副本中加入顶层 `sniffer`。下例只观察 HTTP 80 和 TLS 443；端口范围应与实际目标对应。

```yaml
sniffer:
  enable: true
  parse-pure-ip: true
  override-destination: false
  sniff:
    HTTP:
      ports: [80]
    TLS:
      ports: [443]
```

`parse-pure-ip` 针对尚未获得域名的流量强制嗅探。例子显式关闭目标覆盖，便于先观察域名识别结果。不要在第一次测试时同时启用全部协议、扩大端口和改变 DNS；否则很难确定哪项改变影响了连接。

## 目标覆盖需要单独判断

`override-destination` 决定是否把嗅探结果用于实际访问。官方字段说明的默认值为 true，示例中也可以显式设置 false，因此应检查生效值。某个协议内的同名设置会覆盖全局值；即使顶层为 false，HTTP 子项写了 true，仍需按子项检查。

如果目标使用特定 IP 才能正常工作，先记录原始目标和识别到的域名。确认识别正确并且确实需要改变实际访问目标，再在测试副本中调整覆盖值，用同一请求进行对照。不要凭日志里出现域名就认定需要打开覆盖。

## 嗅探无结果时按条件检查

1. 先确认该连接进入了 mihomo，并且加载的是包含新设置的运行时配置。
2. 核对实际协议和目标端口；例子没有启用 QUIC，不能用一次 QUIC 请求证明 TLS 配置失败。
3. 检查已有 `skip-domain`、`skip-src-address`、`skip-dst-address` 是否排除了这个域名、来源设备或目标地址。
4. 重新建立短连接，比较关闭与开启嗅探时的域名、规则命中和实际出站。
5. 若得到域名但仍走错出站，按[规则顺序指南](/articles/mihomo-rule-order/)检查首个命中项；不要继续修改嗅探范围来掩盖规则问题。

官方还提供针对 `redir-host` 流量的 `force-dns-mapping` 和强制域名列表 `force-domain`。只有复现条件确实涉及这些项时，再核对字段用途并逐项调整。域名本身解析失败的情况应转到[DNS 配置检查](/articles/mihomo-dns-config-check/)。

## 保留有效结果并检查业务影响

验收记录至少包括嗅探前后的原始目标、识别域名、命中规则、出站以及访问结果。识别准确、规则按预期命中、业务仍正常，才值得保留修改。若启用后出现新故障，先恢复原配置，再缩小测试协议或按官方跳过字段限定受影响范围。

嗅探结果依赖真实流量，本文没有进行用户设备实测。开启功能不是速度优化结论，也不能承诺所有加密连接都能恢复域名。

## 官方来源

- [mihomo 域名嗅探：协议、覆盖与跳过字段](https://wiki.metacubex.one/config/sniff/)
- [mihomo 路由规则](https://wiki.metacubex.one/config/rules/)

来源核验日期：2026-10-12。客户端与核心版本应以当前安装环境为准。
