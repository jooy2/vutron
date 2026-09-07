# 预加载脚本

Electron.js中的预加载脚本是一个安全区域，用于主进程和渲染器进程之间的通信。它通常用于 **[IPC通信](https://www.electronjs.org/docs/latest/tutorial/ipc)**。

更多信息，请参阅以下文章: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload

为了与最新版本的Electron兼容并确保安全，我们不建议使用旧的`electron/remote`模块。如果您想使用系统事件或Node脚本，建议在主进程中使用，而不是在渲染器中。

Vutron的预加载脚本位于`src/preload`文件夹中。要创建新的IPC通信通道，请将通道名称添加到以下变量中，将其列入通信白名单。

- `mainSendChannels`: 从渲染进程向主进程发送事件，不等待回复。在主进程中使用 `ipcMain.on` 处理。 (`window.mainApi.send('channelName')`)
- `mainInvokeChannels`: 从渲染进程向主进程发送事件并等待结果。在主进程中使用 `ipcMain.handle` 处理。 (`window.mainApi.invoke('channelName')`)
- `rendererAvailChannels`: 从主进程向渲染进程发送事件。 (`mainWindow.webContents.send('channelName')`)

`send` 和 `invoke` 特意使用了各自独立的白名单，因此每个通道只能按照其处理程序的编写方式使用。

当从渲染器向主程序发送事件时，应访问`window.mainApi`对象，而不是`ipcRenderer.send`。`mainApi`是您在自己的Vutron模板中设置的名称，可以更改。

以下是mainApi支持的功能:

- `send`: 将活动发送至主页面。
- `on`: 一个接收主发送事件的听众。
- `once`: 接听主叫方发送的事件。（仅处理一个呼叫）
- `off`: 移除事件监听器
- `invoke`: 可异步发送事件和接收数据的功能。

传给 `on` 或 `once` 的监听器只会收到调用 `webContents.send` 时传入的值。Electron 的 `IpcRendererEvent` 会留在预加载脚本中：它的 `sender` 是整个 `ipcRenderer`，把它交给渲染器就等于绕过上面的白名单，让渲染器可以使用任意通道。

```ts
const unsubscribe = window.mainApi.on('msgWindowsUpdated', (windowIds) => {
  console.log(windowIds)
})

// 不再需要该监听器时调用
unsubscribe()
```

`on` 和 `once` 会返回一个用于移除监听器的函数。如果监听器是在组件中注册的，请在 `onUnmounted` 中调用它：监听器位于主进程，不会随着界面消失而被清理。把同一个监听器传给 `off` 也可以。

要更改和修改此设置，您需要修改 `src/preload/index.ts` 中的 `exposeInMainWorld`。
