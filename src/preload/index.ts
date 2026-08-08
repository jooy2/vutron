import log from 'electron-log/renderer'
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import type { MainApi } from '@/mainApi'
import {
  MAIN_INVOKE_CHANNELS,
  MAIN_SEND_CHANNELS,
  RENDERER_AVAIL_CHANNELS
} from '@/common/ipc'

// Initialize renderer logger
log.transports.console.level = 'silly'
log.transports.console.format = '{h}:{i}:{s}.{ms} {text}'

// Whitelists of valid channels used for IPC communication, built from the lists
// shared with the main process in `src/common/ipc`.
// `send` and `invoke` are kept apart so that a fire-and-forget channel cannot
// be awaited, and a request/response channel cannot be fired blindly. The
// checks stay at runtime: the renderer is bundled JavaScript by then, so its
// types are gone and it can pass any string it likes.
const mainSendChannels: readonly string[] = Object.values(MAIN_SEND_CHANNELS)
const mainInvokeChannels: readonly string[] =
  Object.values(MAIN_INVOKE_CHANNELS)
const rendererAvailChannels: readonly string[] = Object.values(
  RENDERER_AVAIL_CHANNELS
)

// Typed against `MainApi` so the bridge and its renderer-side type stay in sync
const mainApi: MainApi = {
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
}

contextBridge.exposeInMainWorld('mainApi', mainApi)
