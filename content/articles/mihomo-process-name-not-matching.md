---
title: "mihomo PROCESS-NAME 不生效：进程名称与 find-process-mode 怎么查"
category: "tutorials"
description: "依据 mihomo 官方规则与全局配置文档，核对 PROCESS-NAME、find-process-mode、实际进程名称和规则顺序，定位本机应用分流未命中。"
date: "2026-10-31"
updated: "2026-10-31"
author: "NekoBox 中文指南编辑部"
draft: false
---

mihomo 的域名规则可以命中，`PROCESS-NAME` 却没有效果，应先检查内核是否取得了发起连接的进程名称，以及该规则有没有被前面的条目覆盖。按进程分流要求请求确实进入 mihomo；在规则里写上应用名称，不能让原本绕过代理的连接自动进入内核。

## 先确认连接属于哪个进程

保存当前配置，记录内核版本、接管方式和实际运行配置。在本机任务管理器与客户端连接记录中查找发起请求的进程，不能把窗口标题当成可执行文件名称。某些应用由辅助进程联网，应以实际连接对应的进程为准。

官方规则页用 Windows 的 `chrome.exe` 展示进程名称匹配，也列出完整路径匹配 `PROCESS-PATH`。两者填写内容不同，不要把完整安装路径放到 `PROCESS-NAME` 中。Android 包名也不能直接当作 Windows 进程名称使用。

## 检查模式，再检查规则位置

全局文档给出三种 `find-process-mode`：`strict` 为默认，由内核判断是否开启；`always` 强制匹配所有进程；`off` 不匹配进程。若运行配置为 `off`，应先核对客户端为什么设置它，而不是不断改进程名称。

下面是用于本机对照的局部配置，规则名称采用官方示例中的进程，`DIRECT` 表示直连；只有该进程确实是测试对象时才使用。合并到现有配置，保留其他规则和出站：

```yaml
find-process-mode: always
rules:
  - PROCESS-NAME,chrome.exe,DIRECT
```

把测试条目放在会提前匹配该请求的宽泛规则之前。不要直接覆盖整份 `rules`，也不要把 `always` 理解成所有平台、所有连接都一定能够取得进程信息。

## 用新连接比较结果

1. 通过客户端配置检查，确认生成后的运行配置包含这一项。
2. 关闭测试应用的旧连接，再访问一个明确的目标；保留时间、进程名称、命中规则和实际出口。
3. 用另一应用访问同一目标，确认没有意外扩大匹配范围。
4. 如果进程信息仍为空，检查客户端支持的平台能力、接管入口与运行权限提示，不要先关闭系统安全功能。

若只能看到另一台设备的源地址，不能照搬本机进程名称测试。需要按来源设备分流时应另选适合的规则条件。

## 恢复时保留排查记录

无改善时恢复原来的匹配模式和测试规则，重新建立连接复核。顺序问题可对照 [mihomo 规则顺序](/articles/mihomo-rule-order/)；升级后才出现字段差异时看 [配置版本迁移](/articles/mihomo-config-version-migration/)。不要通过清空所有订阅来处理一条进程规则。

## 官方来源

- [官方文档 1](https://wiki.metacubex.one/config/rules/)
- [官方文档 2](https://wiki.metacubex.one/config/general/)

来源核验日期：2026-10-31。
