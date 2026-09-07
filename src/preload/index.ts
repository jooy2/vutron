import log from 'electron-log/renderer'
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import type { MainApi, MainApiListener } from '@/mainApi'
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

const assertChannel = (channel: string, allowed: readonly string[]): void => {
  if (!allowed.includes(channel)) {
    throw new Error(`Unknown ipc channel name: ${channel}`)
  }
}

type IpcRendererListener = (event: IpcRendererEvent, ...args: any[]) => void

/*
 * `ipcRenderer` is handed a wrapper instead of the renderer listener itself, so
 * that the `IpcRendererEvent` never crosses the bridge. Its `sender` is the
 * whole `ipcRenderer`, which a renderer could use to talk on any channel it
 * likes and walk straight past the whitelists above.
 *
 * `off` is called with the renderer listener, so the wrapper it was registered
 * with has to be found again. The registry is keyed weakly by that listener, so
 * a listener that goes out of scope takes its entry with it. Registering the
 * same listener on the same channel twice is allowed, which is why the wrappers
 * are stacked: `ipcRenderer.off` drops the most recently added match, and so
 * does `pop`.
 * */
const wrappers = new WeakMap<
  MainApiListener,
  Map<string, IpcRendererListener[]>
>()

const rememberWrapper = (
  channel: string,
  listener: MainApiListener,
  wrapper: IpcRendererListener
): void => {
  let byChannel = wrappers.get(listener)

  if (!byChannel) {
    byChannel = new Map()
    wrappers.set(listener, byChannel)
  }

  byChannel.set(channel, [...(byChannel.get(channel) ?? []), wrapper])
}

const forgetWrapper = (
  channel: string,
  listener: MainApiListener
): IpcRendererListener | undefined => {
  return wrappers.get(listener)?.get(channel)?.pop()
}

// Typed against `MainApi` so the bridge and its renderer-side type stay in sync
const mainApi: MainApi = {
  send: (channel: string, ...data: any[]): void => {
    assertChannel(channel, mainSendChannels)
    ipcRenderer.send(channel, ...data)
  },
  on: (channel: string, listener: MainApiListener): (() => void) => {
    assertChannel(channel, rendererAvailChannels)

    const wrapper: IpcRendererListener = (_event, ...args) => listener(...args)

    rememberWrapper(channel, listener, wrapper)
    ipcRenderer.on(channel, wrapper)

    return () => {
      forgetWrapper(channel, listener)
      ipcRenderer.off(channel, wrapper)
    }
  },
  once: (channel: string, listener: MainApiListener): (() => void) => {
    assertChannel(channel, rendererAvailChannels)

    const wrapper: IpcRendererListener = (_event, ...args) => {
      forgetWrapper(channel, listener)
      listener(...args)
    }

    rememberWrapper(channel, listener, wrapper)
    ipcRenderer.once(channel, wrapper)

    return () => {
      forgetWrapper(channel, listener)
      ipcRenderer.off(channel, wrapper)
    }
  },
  off: (channel: string, listener: MainApiListener): void => {
    assertChannel(channel, rendererAvailChannels)

    const wrapper = forgetWrapper(channel, listener)

    if (wrapper) {
      ipcRenderer.off(channel, wrapper)
    }
  },
  invoke: (channel: string, ...data: any[]): Promise<any> => {
    assertChannel(channel, mainInvokeChannels)

    return ipcRenderer.invoke(channel, ...data)
  }
}

contextBridge.exposeInMainWorld('mainApi', mainApi)
