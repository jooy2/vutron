# 主流程与渲染器流程

一个**Vutron**应用程序被分为代码，分为主进程和渲染器进程。

**“主”**是`src/main`的代码，主要是由Electron处理的进程代码。**“渲染器”**是`src/renderer`的代码，主要用于前端渲染过程，如Vue。

一般来说，**Node.js**脚本无法在渲染器进程中运行。例如，包含Node.js使用的API的模块，或**Node.js**的本机模块，如`path`或`net`、`os`或`crypto`。

预加载脚本在渲染器加载之前运行。它为主进程创建了一个桥梁，出于安全考虑，将Node.js脚本的执行与渲染器区域分开并隔离。

为了安全执行脚本，建议主进程执行Node脚本，渲染器通过消息传递接收执行结果。这可以通过**IPC通信**来实现。

欲了解更多信息，请参阅以下文章: https://www.electronjs.org/docs/latest/tutorial/ipc

### 如何在渲染器上运行Node.js？

如果您想跳过安全问题并在渲染器中使用 Node.js 脚本，需要在 `vite.config.ts` 文件中将 `nodeIntegration` 设置为 `true`。

```javascript
rendererPlugin({
  nodeIntegration: true
})
```

欲了解更多信息，请参阅以下文章: https://github.com/electron-vite/vite-plugin-electron-renderer
