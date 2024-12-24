---
order: 5
---

# 管理本地文档

Vutron 中的文档可以通过 VitePress 查看器在本地环境中查看。

此功能仅在克隆整个项目时可用。如果您使用 npm init vutron 创建项目，则不会包含 docs 文件夹。

## 安装

以下说明中的所有操作均应在"文档"文件夹中完成。

```shell
$ cd docs
```

使用以下命令安装相关软件包：

```shell
# via npm
$ npm i

# via yarn (https://yarnpkg.com)
$ yarn install

# via pnpm (https://pnpm.io)
$ pnpm i
```

您可以通过以下命令运行托管文档的本地服务器。

```shell
$ npm run dev
```
