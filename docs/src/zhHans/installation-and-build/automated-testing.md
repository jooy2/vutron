---
order: 4
---

# 自动测试

**Vutron**包括自动测试。测试框架使用微软的\*\*[Playwright](https://playwright.dev)。

**Playwright**针对网络应用测试进行了优化，并完全支持**Electron**框架。它易于安装，无需配置即可立即开始测试，并且是跨平台的。您可以在此处了解有关**Playwright**的更多信息：https://github.com/microsoft/playwright

此模板仅对模板主屏幕进行了非常简单的启动和行为测试。高级测试取决于您的应用程序范围。

目前，测试规范文件位于`tests`目录中，测试结果文件位于`tests/results`中。（内置测试规范文件不会生成单独的结果文件。）

Playwright配置文件位于项目根目录下的playwright.config.ts，更多信息请参阅以下文档：https://playwright.dev/docs/test-configuration

完成所有配置后，您可以使用以下命令进行测试。

```shell
$ npm run test
```

在运行测试之前，请清空构建目录（`dist`）并编译测试包。
