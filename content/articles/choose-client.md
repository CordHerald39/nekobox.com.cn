---
title: "NekoBox Android、NekoRay 与 Throne 有什么区别？迁移前先核对项目和配置"
description: "区分 NekoBox 安卓客户端、NekoRay 桌面项目与 Throne 的延续关系，核对原始来源，并按官方说明迁移订阅、分享链接和路由设置。"
date: "2026-09-19"
category: "tutorials"
updated: "2026-10-05"
author: "NekoBox 中文指南编辑部"
draft: false
---

Throne 延续 Nekoray 这条产品线：桌面端此前叫 Nekoray，Android 端此前叫 NekoBox for Android。桌面覆盖 Windows、Linux、macOS，核心为基于 sing-box 的 ThroneCore，部分配置仍走 Xray；Android 从 2.0.0 起与桌面共用同一核心、设置模型和备份格式。延续不是简单改名，旧配置也不是全兼容。菜单位置、TUN 白名单、DNS 劫持等能力有搬迁或替换；Nekoray 配置目录不能直接导入；旧 Android 备份不能整包恢复。迁移前先保留原目录，按组复制订阅地址，导出标准分享链接，再重建路由并核对 DNS 与端口。

## 延续同一条线，入口已经换位

多数操作习惯仍接近旧客户端，但点击路径不同。原来的 Server 菜单改到配置列表上右键，菜单栏默认隐藏。原来的 Preferences 改到工具栏 Settings，里面有 Basic Settings、Routing Settings、Tun Settings、Hotkey Settings。订阅分组仍在 Groups，更新某一组可在其标签上右键后选 Update subscription。原来 TUN 里按进程绕过的 Bypass Process Name，改为路由配置 Direct 框中的 processName 规则，或在 Connections 里把进程追加到 Direct；原来的白名单模式，改为 Default outbound 设为 direct，再把进程或站点放入 Proxy 框。国家路由预设改为 Routing → Download Profiles 中的 China、Iran、Russia。FlatGray、LightBlue、BlackSoft 等主题从 1.1.5 起回到 Basic Settings → Style → Theme。Throne 不能读取 nekoray:// 或 sn://，只接受标准分享链接。1.3.1 及更早的 Hijack、System DNS 已弃用并将移除，应改用 Tun Mode。适用对象是正在使用 Nekoray 或 NekoBox、准备迁到 Throne 的使用者；核对差异时不要假设菜单与旧版相同。

## 桌面端：留下原目录，按组粘贴订阅

Throne 读不了 Nekoray 的配置文件夹，也没有对应导入工具。先完整保留原安装目录作对照，再手工搬迁：在 Nekoray 各组设置里复制订阅 URL；到 Throne 主窗口按 Ctrl+V，选择 Create new subscription group，一组一贴直到全部完成。手工添加的节点，在 Nekoray 中选中后执行 Server → Share → Copy links of selected，再到 Throne 用 Ctrl+V 导入。路由必须重建：用 Routing → Download Profiles 下载对应地区配置，或按原规则自行添加。对照旧端改过的监听端口、DNS 服务器和热键，在 Settings 里重新填写。Throne 1.0.x 升到 1.1.0 后数据改存 throne.db，旧 JSON 不会自动出现；原地升级后若列表为空，同样保留旧文件夹并按上述步骤搬迁。1.1.3 起可用 Basic Settings → Backup and Restore 在 Throne 版本之间或电脑之间搬家，这套 .thrbackup 不能替代 Nekoray 目录导入。粘贴失败时，先检查链接是否仍是 nekoray:// 或 sn://，改成标准分享链接后再试。不要同时开启 Nekoray 与 Throne 的 TUN 或系统代理。

## Android 端：先抄链接，旧备份不能直接恢复

Throne for Android 2.0.0 更换了签名密钥，不能覆盖安装 1.x；卸载旧应用会清空配置。卸载前在抽屉 Group 点分组铅笔图标，复制 Subscription Link；不要用 Share Subscription，它给出的 sn:// 链接 2.0.0 读不了。非订阅节点用分组菜单 Export → Export to file。WireGuard、SSH、ShadowTLS、Mieru、链式和自定义配置若仍导出为 sn://，需记下参数后在新应用里重建。若电脑上已有同一套 Throne 桌面配置，可在桌面生成 .thrbackup，装好 2.0 后用 Tools → Restore 恢复。2.0 只恢复 .thrbackup（含桌面备份）。旧版 throne_backup_….json 以及 1.6.x 及更早的 WebDAV .zip 不能恢复。不要把 Throne 新备份格式当作旧 NekoBox 备份去打开。原版 NekoBox 包名不同，系统会并列安装 Throne，两边数据互不相认，仍须用订阅链接迁移。同一时间只能连接一个 VPN 应用。需要分应用路由时打开 Tun Mode；仅系统代理时，忽略系统代理的应用流量到不了 Throne，规则不会生效。

## 双开冲突、端口 DNS 与备份秘密

两侧都装、准备对照或切换时，先关掉一侧的 TUN 与系统代理，再启动另一侧，避免端口和虚拟网卡争用。随后核对：监听端口是否与旧端或其他代理冲突；DNS 是否已离开已弃用的 Hijack 与 System DNS；Default outbound 是 direct 还是 block（block 从 1.2.0 起提供）；进程绕过是否已写成 processName。备份文件含节点密码和订阅链接，只放在私密位置，不要随聊天发出。恢复时勾选的部分会覆盖当前数据且不可撤销。桌面与 Android 可互导 .thrbackup，但 OTP 与自定义托盘图标在 Android 上不恢复，仅 Android 的分应用规则在桌面无效。订阅 URL 本身就是秘密，抄写时用私密笔记。各组更新成功并完成延迟检测后，再卸载旧客户端。

https://throneproj.github.io/help/migrating/
https://throneproj.github.io/android/installation/
https://throneproj.github.io/get_started/
https://throneproj.github.io/guides/backup/
