import log from 'electron-log/renderer'
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

// Initialize renderer logger
log.transports.console.level = 'silly'
log.transports.console.format = '{h}:{i}:{s}.{ms} {text}'

// Whitelists of valid channels used for IPC communication.
// `send` and `invoke` are kept apart so that a fire-and-forget channel cannot
// be awaited, and a request/response channel cannot be fired blindly.

// Renderer -> Main, no reply. Handled with `ipcMain.on`.
const mainSendChannels: string[] = ['msgOpenExternalLink']
// Renderer -> Main, awaits a reply. Handled with `ipcMain.handle`.
const mainInvokeChannels: string[] = ['msgRequestGetVersion', 'msgOpenFile']
// Main -> Renderer. Sent with `mainWindow.webContents.send`.
const rendererAvailChannels: string[] = []

contextBridge.exposeInMainWorld('mainApi', {
  send: (channel: string, ...data: any[]): void => {
    if (mainSendChannels.includes(channel)) {
      ipcRenderer.send.apply(null, [channel, ...data])
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`)
    }
  },
  on: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ): (() => void) => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.on(channel, listener)

      return () => {
        ipcRenderer.off(channel, listener)
      }
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`)
    }
  },
  once: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ): (() => void) => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.once(channel, listener)

      return () => {
        ipcRenderer.off(channel, listener)
      }
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`)
    }
  },
  off: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ): void => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.off(channel, listener)
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`)
    }
  },
  invoke: async (channel: string, ...data: any[]): Promise<any> => {
    if (mainInvokeChannels.includes(channel)) {
      const result = await ipcRenderer.invoke.apply(null, [channel, ...data])
      return result
    }

    throw new Error(`Unknown ipc channel name: ${channel}`)
  }
})
