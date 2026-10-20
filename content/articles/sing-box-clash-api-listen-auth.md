---
title: "sing-box Clash API 连接失败：监听、认证与面板分别检查"
category: "tutorials"
description: "根据 sing-box 官方 Clash API 文档区分端口未监听、Bearer 认证失败和面板静态文件问题，按本机接口到浏览器的顺序排查。"
date: "2026-10-20"
updated: "2026-10-20"
author: "NekoBox 中文指南编辑部"
draft: false
---

面板打不开不一定是代理节点故障。sing-box 的 Clash API 由 experimental.clash_api 配置；external_controller 为空时接口关闭。应先确认本机 API 能响应，再检查面板页面与浏览器限制。

## 先看监听位置

在最终运行配置中找到 external_controller，确认地址、端口和面板填写的一致。仅在本机使用时，优先限定为 127.0.0.1 上的空闲端口。官方特别提醒：监听 0.0.0.0 时始终应设置 secret，不能把未认证接口直接开放出去。

secret 用于 API 认证，请求头形式是 Authorization: Bearer 后接自己设置的值。不要把真实 secret 写进截图、反馈日志或公开链接；面板里的凭据与配置不一致时，应修正两端，而不是直接取消认证。

## 根据现象分开处理

1. 连接被拒绝：检查核心是否运行、端口是否被其他进程占用、监听地址是否与请求一致。
2. 能连接但认证失败：核对 secret 与 Bearer 请求头，确认读到的是当前运行配置。
3. API 可访问但页面空白：检查 external_ui 指向的目录及静态资源；它与代理订阅文件不同。
4. 本地请求正常、浏览器仍拦截：再查看开发者工具中的跨域或私有网络访问错误。

external_ui 可以是相对配置目录的路径，也可以是绝对目录，资源通过接口的 /ui 提供。若配置为空目录，还需检查面板下载是否成功，不要把静态文件缺失当作节点连接失败。

## 浏览器访问与恢复

当前文档列出了 access_control_allow_origin 和 access_control_allow_private_network。公共网页访问私有网络接口时，应按官方要求明确来源及相应设置；只允许实际需要的来源，先确认本机接口再处理这一层。

修复后分别验收 API、面板加载与实际代理请求。配置错误时恢复备份。日志检查见 [sing-box 日志配置](/articles/sing-box-log-config/)，启动前的兼容性检查见 [sing-box 配置迁移](/articles/sing-box-config-migration/)。

## 官方来源

[官方配置文档](https://sing-box.sagernet.org/configuration/experimental/clash-api/)

来源核验日期：2026-10-20。
