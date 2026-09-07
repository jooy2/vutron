# Preload Script

The preload script in Electron.js is a secure area designed for communication between the main and renderer processes. It is typically used for **[IPC communication](https://www.electronjs.org/docs/latest/tutorial/ipc)**.

For more information, see the following articles https://www.electronjs.org/docs/latest/tutorial/tutorial-preload

For compatibility and security with the latest version of Electron, we do not recommend using the old `electron/remote` module. If you want to utilize system events or Node scripts, it is recommended to do so in the main process, not the renderer.

Vutron's preload script is located in the `src/preload` folder. To create a new IPC communication channel, add the channel name to the following variable to whitelist it for communication.

- `mainSendChannels`: Send an event from renderer to main without waiting for a reply. Handled with `ipcMain.on` in the main process. (`window.mainApi.send('channelName')`)
- `mainInvokeChannels`: Send an event from renderer to main and await its result. Handled with `ipcMain.handle` in the main process. (`window.mainApi.invoke('channelName')`)
- `rendererAvailChannels`: Send an event from main to renderer. (`mainWindow.webContents.send('channelName')`)

`send` and `invoke` use separate whitelists on purpose, so that a channel can only be used the way its handler was written.

When you add a channel, say what it carries in `MainSendPayloads`, `MainInvokeContracts` or `RendererEventPayloads` in `src/common/ipc.ts`. Adding the name alone fails the build. In the main process, register it through `handleInvoke`, `handleSend` or `sendToWindow` from `src/main/utils/ipc.ts` rather than calling `ipcMain` directly. The same contract then types both the renderer call site and the main process handler.

```ts
// src/common/ipc.ts
export interface MainInvokeContracts {
  [MAIN_INVOKE_CHANNELS.openFile]: {
    args: [filter: string]
    result: OpenFileResult
  }
}
```

When sending events from renderer to main, you access the `window.mainApi` object instead of `ipcRenderer.send`. The `mainApi` is the name you set in your Vutron template and can be changed.

Here are the supported functions for mainApi:

- `send`: Send an event to main.
- `on`: A listener to receive events sent by main.
- `once`: A listener to receive events sent by main. (Handle only one call)
- `off`: Remove an event listener
- `invoke`: Functions that can send events to main and receive data asynchronously.

A listener passed to `on` or `once` is given only the values that `webContents.send` was called with. Electron's `IpcRendererEvent` stays in the preload script: its `sender` is the whole `ipcRenderer`, and handing that to the renderer would let it use any channel it likes, past the whitelists above.

```ts
const unsubscribe = window.mainApi.on('msgWindowsUpdated', (windowIds) => {
  console.log(windowIds)
})

// Call this once the listener is no longer needed
unsubscribe()
```

`on` and `once` return a function that removes the listener. Call it from `onUnmounted` when a component registered the listener: the listener lives in the main process and is not dropped when the screen goes away. Passing the same listener to `off` works too.

To change and modify this, you need to modify `exposeInMainWorld` in `src/preload/index.ts`.
