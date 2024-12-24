---
order: 1
---

# 入门

## 克隆项目

### 方法 1: `npm init` (推荐)

只需使用 npm 命令，就能轻松克隆一个版本库。

```shell
$ npm init vutron
```

上述方法不会为项目创建不必要的文档和`.github`相关文件。

### 方法 2: 使用此模板

点击 **[使用此模板](https://github.com/jooy2/vutron/generate)**，立即创建自己的项目。

此方法可立即在 GitHub 上创建一个仓库，但在使用之前，您需要在本地克隆该项目。

### 方法 3: 克隆该版本库

使用以下命令克隆该 repo。此方法适用于直接向 Vutron 代码库投稿。

```shell
$ git clone https://github.com/jooy2/vutron <PROJECT_NAME>
```

## 安装

克隆项目后，在终端运行以下命令:

```shell
# via npm
$ npm i

# via yarn (https://yarnpkg.com)
$ yarn install

# via pnpm (https://pnpm.io)
$ pnpm i
```

## 在开发环境中运行

开发环境中的应用程序通过 **[Vite](https://vitejs.dev)** 运行。

```shell
$ npm run dev
```

如果运行命令行命令后应用程序没有出现，您可能需要检查默认端口是否被其他应用程序使用。

Vite 默认使用端口 `5173`。
