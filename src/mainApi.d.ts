import type { IpcRendererEvent } from 'electron'

type IpcListener = (event: IpcRendererEvent, ...args: any[]) => void

/*
 * Shape of the bridge that `src/preload` exposes on `window` through
 * `contextBridge`. It is declared once and used by both sides, so the preload
 * implementation and the renderer call sites cannot drift apart.
 * */
export interface MainApi {
  // Fire and forget, for channels in `mainSendChannels`
  send: (channel: string, ...data: any[]) => void
  // Listen for channels in `rendererAvailChannels`, returns an unsubscribe fn
  on: (channel: string, listener: IpcListener) => () => void
  once: (channel: string, listener: IpcListener) => () => void
  off: (channel: string, listener: IpcListener) => void
  // Request/response, for channels in `mainInvokeChannels`
  invoke: <T = any>(channel: string, ...data: any[]) => Promise<T>
}

declare global {
  interface Window {
    // Always injected by the preload script before the renderer runs
    mainApi: MainApi
  }
}
