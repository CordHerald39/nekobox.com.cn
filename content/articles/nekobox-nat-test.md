---
title: "NekoBox NAT 测试怎么看：Discover Error 与 Fake fullcone"
category: tutorials
label: "专题指南"
description: "解释 NekoBox NAT 测试的错误行、映射过滤结果与 Fake fullcone 提示，避免把完成状态当成 UDP 或游戏连通性保证。"
date: "2026-10-04"
updated: "2026-10-04"
author: "NekoBox 中文指南编辑部"
draft: false
image: "/images/nekobox-nat-test.svg"
imageAlt: "NekoBox NAT 测试怎么看：Discover Error 与 Fake fullcone的检查流程示意，非软件截图"
---

NAT 测试结束后看到结果框，并不代表所有测试分支都成功。NekoBox 1.4.2 的测试代码会把错误与部分结果放在同一份文字中。判断时应先读错误行，再看有没有有效的映射与过滤数据。

## 先固定测量条件

使用自己有权使用的网络和节点，记录客户端版本、Wi-Fi 或移动网络、测试时是否启用 VPN，以及使用的 STUN 服务器。不要在一次比较中同时换网络、节点和测试服务器。

![NAT 测试结果判读示意，非软件截图](/images/nekobox-nat-test.svg)

测试服务器必须支持相应测试，不能因为某个地址能解析就认定它支持所有探测。项目的[stun.go](https://github.com/MatsuriDayo/NekoBoxForAndroid/blob/5768494d8ae3c74a057bb6d46c0f8dc071b0d821/libcore/stun.go)还包含关于特定 STUN 地址不受该库支持的注释；应以当前实现与服务器能力为准。

## 逐行读结果，比只看 NAT 名称更可靠

| 文字 | 怎样理解 |
| --- | --- |
| Discover Error | 第一组发现过程发生错误，先记录具体原因 |
| BehaviorTest Error | 行为测试没有完整得到预期结果，不能补猜过滤类型 |
| External IP / External Port | 探测所观察到的外部地址与端口，不等同于所有应用的出口 |
| Mapping Behavior / Filtering Behavior | 当前样本的映射与过滤行为，需结合网络和服务器条件 |
| Fake fullcone 提示 | 检测发现相关端点变化行为异常，不能据此宣传真实全锥形能力 |

这里有一个容易误读的实现细节：函数末尾会设置 Success 为 true，同时保留前面拼入的 Discover Error 或 BehaviorTest Error。这个标志表示函数走到了返回阶段，不能单独充当“网络测试全部通过”的证据。该判断来自固定版本源码，而非对你设备的测量。

## 复测时保持目标一致

先保留原始文字，等待网络状态稳定后，在同样条件下再测。若结果不一致，记录波动和错误，不挑选最好看的一次。比较直连与代理时分别注明 VPN 状态，并确认你真正使用的节点没有在测试期间切换。

不要通过关闭防火墙、扩大端口开放范围或更改路由器配置来追求某个 NAT 标签。诊断工具的结果应该帮助缩小问题，不能替代网络访问权限与具体应用的配置要求。

## NAT 标签不能替代应用验收

即使某次显示较宽松的映射行为，语音、联机游戏或其他 UDP 应用仍可能受协议、服务端和路由影响。下一步应在获得授权的实际应用中验证连接，保留它自己的错误与时间。将 NAT 报告、应用结果和测试条件放在一起，才能说明问题发生在哪个样本。

## 来源与隐私

2026-10-04 核对[1.4.2 NAT 测试实现](https://github.com/MatsuriDayo/NekoBoxForAndroid/blob/5768494d8ae3c74a057bb6d46c0f8dc071b0d821/libcore/stun.go)、[Android 测试界面](https://github.com/MatsuriDayo/NekoBoxForAndroid/blob/5768494d8ae3c74a057bb6d46c0f8dc071b0d821/app/src/main/java/io/nekohasekai/sagernet/ui/StunActivity.kt)与[开发者 NAT 测试说明](https://matsuridayo.github.io/nb4a-configuration/)。本文未运行你设备上的 NAT 测试，也不承诺某个节点支持游戏或语音。

分享报告前遮盖外部 IP、端口及可识别账号的内容。若只是一款应用无法访问，可先查[分应用与 VPN 范围](/articles/nekobox-app-routing/)。

