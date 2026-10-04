---
title: "NekoBox selector 模式的旧配置：切换后连接与 DNS 怎么检查"
category: tutorials
label: "专题指南"
description: "解释已标注不再维护的 selector 分组，处理旧配置中的节点切换、旧 DNS 记录和重启按钮限制，避免当作新手推荐功能。"
date: "2026-10-04"
updated: "2026-10-04"
author: "NekoBox 中文指南编辑部"
draft: false
image: "/images/nekobox-selector-legacy.svg"
imageAlt: "NekoBox selector 模式的旧配置：切换后连接与 DNS 怎么检查的检查流程示意，非软件截图"
---

你已经在使用旧 selector 分组，切换节点后网页表现没有跟着改变，可以检查现有请求和 DNS 缓存，而不必立即重建订阅。开发者文档把这项功能标注为“不再维护”，本页服务于旧配置排查，不将它推荐为新的默认方案。

## 先确认是不是同一种分组

selector 模式的目的，是让分组中的配置切换减少重载过程。它不是 Android 的分应用开关，也不是订阅更新功能。NekoBox 1.4.2 的[分组设置](https://github.com/MatsuriDayo/NekoBoxForAndroid/blob/5768494d8ae3c74a057bb6d46c0f8dc071b0d821/app/src/main/java/io/nekohasekai/sagernet/ui/GroupSettingsActivity.kt)保留 isSelector 状态，[生成配置](https://github.com/MatsuriDayo/NekoBoxForAndroid/blob/5768494d8ae3c74a057bb6d46c0f8dc071b0d821/app/src/main/java/io/nekohasekai/sagernet/fmt/ConfigBuilder.kt)中仍可看到 selector 出站。

![旧 selector 分组排查示意，非软件截图](/images/nekobox-selector-legacy.svg)

先记录客户端版本、分组名称及当前节点，核对自己的分组确实启用了这一模式。如果只是普通分组选节点，不应照搬这里的限制。

## 切换后不要只盯着旧页面

开发者说明提示，切换会重置连接，但不会清除旧 DNS 记录；在这种模式下，“重启代理”按钮也有行为限制。因此看一个已经打开的页面，不能完整说明新的请求实际走到了哪里。

建议在少量节点的测试分组中验证：先使用 A 建立新请求并记录结果，再切换到 B，重新发起同一个目标的请求，保留时间、所选节点和相关日志。出现差异时，分清请求失败、解析缓存和节点可达性，不将浏览器页面残留当作软件完全没有切换。

## 含插件的分组要先停止扩张

项目文档不建议对需要插件的服务器分组启用 selector，因为可能同时启动多个插件。不要把整份大订阅作为第一次复现样本。已有这类分组时，先保存原设置，使用两个不依赖插件、单独可用的节点检查，再决定是否保留模式。

| 现象 | 检查重点 |
| --- | --- |
| 普通分组能用，旧 selector 异常 | 在最小分组中比较，不继续加入节点 |
| 切换后部分域名表现滞后 | 保留请求与解析时间，考虑旧 DNS 记录的影响 |
| 点击重启没有预期变化 | 先确认 selector 状态，不能把按钮表现直接解释为进程崩溃 |
| 出现多个插件进程或启动错误 | 核对分组内的协议与插件依赖 |

## 怎样回到普通配置

保存分组和节点信息后，停止代理，关闭测试分组的 selector 模式，再按正常分组方式选择一个原本可用的节点并启动。用同一目标新建请求确认恢复。操作前应避开正在进行的重要下载或会话，因为测试切换会影响连接。

若仍然异常，按[DNS 检查步骤](/articles/nekobox-dns-troubleshooting/)记录解析路径，或按[后台断连说明](/articles/nekobox-background-disconnect/)区分系统接管问题。不要把不同症状全部归给 selector。

## 固定版本来源

2026-10-04 核对：[开发者 selector 说明](https://matsuridayo.github.io/nb4a-configuration/)、上述 NekoBox 1.4.2 分组与配置源码。本页未进行设备切换实测，不承诺旧功能后续继续维护。分享反馈前隐藏分组中的订阅地址、节点认证和日志中的访问目标。

