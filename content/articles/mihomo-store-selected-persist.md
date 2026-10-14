---
title: "mihomo store-selected：重启后保留策略组选择怎么检查"
category: "tutorials"
description: "根据 mihomo 官方缓存与手动选择文档启用 profile.store-selected，用同一组名和成员完成重启对照，排查客户端覆写与配置更换造成的选择重置。"
date: "2026-10-14"
updated: "2026-10-14"
author: "NekoBox 中文指南编辑部"
draft: false
---

mihomo 面板里选好节点，重启后却变回另一项，可以先检查 `profile.store-selected`。这个字段保存 API 对策略组的选择，供下次启动使用。测试时要保持同一份配置、同一个组和相同成员，才能判断选择是否被保留。

## 合并缓存设置

[官方全局配置的缓存说明](https://wiki.metacubex.one/config/general/)给出了下面的字段。把它合并到现有顶层 `profile` 中；若已经有 `profile`，保留其他设置，避免增加重复 YAML 键。

```yaml
profile:
  store-selected: true
```

同节的 `store-fake-ip` 保存 Fake-IP 映射，处理的是另一类缓存。排查策略组选择时只改 `store-selected`，原有 DNS 设置保持不变。

建议使用一个已有 `select` 组完成对照。[手动选择文档](https://wiki.metacubex.one/config/proxy-groups/select/)提供该组的结构；以下片段只是示例，两个节点必须在自己的配置中存在，不可直接代替完整配置。

```yaml
proxy-groups:
  - name: "手动连接"
    type: select
    proxies:
      - "节点甲"
      - "节点乙"
```

## 做一次不更换配置的重启对照

1. 备份当前配置，记录 mihomo 版本、实际配置路径、组名和当前选项。
2. 合并 `store-selected: true`，校验后加载副本，核对运行时配置中的值。
3. 用已连接该核心控制接口的面板，在“手动连接”中选择“节点乙”，确认面板刷新后仍显示它。
4. 发起新请求，确认请求经过这个组，再记录实际成员和响应。
5. 正常停止并重启同一核心，继续加载同一配置，先看组选择，再发起另一次新请求。
6. 比较重启前后的组名、成员和连接结果，记录是否恢复了“节点乙”。

面板连接错误时先处理[控制接口连接排查](/articles/mihomo-controller-connect-failed/)。没有确认面板控制的是哪一个核心时，界面上的选择不能作为该进程已经收到选择的证据。

## 选择重置需要保留哪些证据

检查客户端是否在启动时重新生成或覆写配置，实际工作目录与权限是否变化，重启后组名、成员是否仍然存在。缓存说明没有承诺跨目录或跨配置迁移，也没有要求某个固定缓存文件名，因此不要在排错时直接删除未知缓存。

如果测试同时更新了订阅，节点改名或被移除也会改变可供选择的成员。先恢复备份，在成员不变的情况下再做对照；订阅故障另看[代理集合更新排查](/articles/mihomo-proxy-provider-update-failed/)。

对自动选择或回退组，还需观察其自身策略和健康检查。`store-selected` 保存 API 选择，不能由此推断自动策略今后一直使用同一成员，也不保证旧连接跨重启继续存在。

## 回退与验收

若修改后配置无法加载，恢复原 `profile` 内容和原选择，再校验一次。不要同时更换内核、DNS 和订阅。迁移到另一台设备前，参考[配置版本迁移](/articles/mihomo-config-version-migration/)保存完整配置与版本记录。

验收应包含两项：正常重启后面板仍显示预期选择，新请求也经过预期路径。只见面板显示旧名称而请求走其他规则时，继续核对路由，不算完成选择持久化的连接验收。

## 官方来源

- [mihomo 全局配置：缓存](https://wiki.metacubex.one/config/general/)
- [mihomo 手动选择代理组](https://wiki.metacubex.one/config/proxy-groups/select/)

来源核验日期：2026-10-14。图形客户端使用的内核版本及覆写方式以当前安装版本为准。
