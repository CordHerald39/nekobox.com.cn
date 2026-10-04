---
title: "NekoBox 代理链怎么排序：入口、出口与循环引用检查"
category: tutorials
label: "专题指南"
description: "用两节点记录说明 NekoBox 代理链的方向，排查循环引用、单节点可用但链式失败，并保留可恢复的原配置。"
date: "2026-10-04"
updated: "2026-10-04"
author: "NekoBox 中文指南编辑部"
draft: false
image: "/images/nekobox-proxy-chain.svg"
imageAlt: "NekoBox 代理链怎么排序：入口、出口与循环引用检查的检查流程示意，非软件截图"
---

代理链适合你明确需要经过两个代理的场景。把两个名字放进列表不会自动获得更低延迟，也不能替代服务端的兼容性确认。本页针对 NekoBox for Android 1.4.2，说明怎样检查链的方向与失败位置。

## 先画出实际路径

开发者文档将链的方向定义为列表从上到下，最后一个配置承担出口。假设只使用你有权使用的节点 A 和 B，目标路径是“手机 → A → B → 目标服务”，列表就应按 A、B 的顺序整理。以下只是路径示意，不是软件截图或实测拓扑。

![NekoBox 两节点代理链检查示意，非软件截图](/images/nekobox-proxy-chain.svg)

A 和 B 的协议、传输方式可能不同，链式组合的支持情况也可能不同。不要把同一列表当成负载均衡：链中一段失败，会影响整个路径。客户端生成配置的逻辑可见[1.4.2 ConfigBuilder](https://github.com/MatsuriDayo/NekoBoxForAndroid/blob/5768494d8ae3c74a057bb6d46c0f8dc071b0d821/app/src/main/java/io/nekohasekai/sagernet/fmt/ConfigBuilder.kt)。

## 创建前分别验收两个节点

先保存当前可用配置，不在唯一可用的配置上直接试验。分别选择 A 和 B，用同一授权目标建立新请求，记录时间、节点、连接结果以及必要的脱敏错误。节点能单独使用只是基线，不能证明它们组合后也兼容。

再新建专门用于验证的代理链，添加 A 和 B。进入链配置后核对列表顺序和实际选中的节点身份，避免重名导致添加错对象。源码允许拖动调整列表，并在添加时检查不允许的循环引用：[ChainSettingsActivity](https://github.com/MatsuriDayo/NekoBoxForAndroid/blob/5768494d8ae3c74a057bb6d46c0f8dc071b0d821/app/src/main/java/io/nekohasekai/sagernet/ui/profile/ChainSettingsActivity.kt)。

## 链式失败怎样分段判断

| 观察 | 下一步 |
| --- | --- |
| A 单独就失败 | 先解决 A 的连接，暂不测试组合 |
| B 单独就失败 | 核对 B 的参数和可达性 |
| 两者单独可用，组合失败 | 记录组合顺序、协议和链式错误，检查连接 B 的路径与协议限制 |
| 更改顺序后结果变化 | 把两种顺序分别记录，不把变化解释成普遍加速 |

切换组合后应建立新的目标请求，旧连接不适合比较。不要用下载速度的一次波动判断是哪一段失败，也不要为让组合“能用”而关闭证书校验。

## 回退与保留材料

失败时重新选择原来的单节点配置，确认同一请求恢复。保留链的节点顺序、客户端版本、两次单节点基线以及组合错误，隐藏服务器地址、口令、UUID 和分享链接中的认证部分。含插件或特殊 UDP 传输的链需要额外核对项目文档，本页不承诺任意协议都能串联。

## 来源与适用边界

来源核对日期为 2026-10-04：[开发者配置文档中的代理链说明](https://matsuridayo.github.io/nb4a-configuration/)、上述固定提交的链编辑与配置生成源码，以及[1.4.2 发行页](https://github.com/MatsuriDayo/NekoBoxForAndroid/releases/tag/1.4.2)。本页完成文档和源码核对，未进行双节点设备实测。

若问题发生在输入配置阶段，先阅读[订阅格式与导入步骤](/articles/nekobox-formats/)。
