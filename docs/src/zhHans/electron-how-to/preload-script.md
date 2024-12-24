# 预加载脚本

Electron.js中的预加载脚本是一个安全区域，用于主进程和渲染器进程之间的通信。它通常用于 **[IPC通信](https://www.electronjs.org/docs/latest/tutorial/ipc)**。

更多信息，请参阅以下文章: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload

为了与最新版本的Electron兼容并确保安全，我们不建议使用旧的`electron/remote`模块。如果您想使用系统事件或Node脚本，建议在主进程中使用，而不是在渲染器中。

Vutron的预加载脚本位于`src/preload`文件夹中。要创建新的IPC通信通道，请将通道名称添加到以下变量中，将其列入通信白名单。

- `mainAvailChannels`: 从主程序发送事件到渲染程序。 (`window.mainApi.send('channelName')`)
- `rendererAvailChannels`: 将事件从渲染器发送到主程序。 (`mainWindow.webContents.send('channelName')`)

当从渲染器向主程序发送事件时，应访问`window.mainApi`对象，而不是`ipcRenderer.send`。`mainApi`是您在自己的Vutron模板中设置的名称，可以更改。

以下是mainApi支持的功能:

- `send`: 将活动发送至主页面。
- `on`: 一个接收主发送事件的听众。
- `once`: 接听主叫方发送的事件。（仅处理一个呼叫）
- `off`: 移除事件监听器
- `invoke`: 可异步发送事件和接收数据的功能。

要更改和修改此设置，您需要修改 `src/preload/index.ts` 中的 `exposeInMainWorld`。
