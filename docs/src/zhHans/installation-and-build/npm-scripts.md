---
title: NPM Scripts
order: 3
---

# Npm 脚本

> $ npm run %SCRIPT_NAME%

## 一般情况

| 脚本名称 | 说明 |
| --- | --- |
| `dev` | 启动电子作为开发环境 |
| `dev:debug` | 将 Electron 作为开发环境启动（使用 vite debug） |
| `dev:debug:force` | 以Electron作为开发环境启动（使用vite调试+清理vite缓存） |
| `build:pre` | 通常在编译时运行的命令。此脚本无需单独运行。 |
| `build` | 为当前操作系统打包。 |
| `build:all` | 为整个操作系统构建指定软件包（需要跨平台构建配置） |
| `build:dir` | `electron-builder`目录构建 |
| `build:mac` | 为macOS构建预配置软件包 |
| `build:linux` | 为Linux构建预配置软件包 |
| `build:win` | 为Windows构建预配置软件包 |
| `lint` | ESLint代码检查。它不会修改代码。 |
| `lint:fix` | ESLint代码检查。使用自动修复功能修复代码。 |
| `format` | 更漂亮的代码检查。它不会修改代码。 |
| `format:fix` | 更漂亮的代码检查。使用自动修复功能修复代码。 |
| `test` | 根据测试规范文件构建测试包并运行测试。 |
| `test:linux` | 根据测试规范文件构建测试包并运行测试。（仅适用于linux ci） |

## 文档

仅用于为项目文档提供素材。必须从“文档”目录位置运行。

| Script Name | Description                                    |
| ----------- | ---------------------------------------------- |
| `dev`       | 启动本地文档服务器。（开发中）                 |
| `build`     | 构建本地文档服务器。仅用于 GitHub 页面构建器。 |
| `serve`     | 启动本地文档服务器。                           |
