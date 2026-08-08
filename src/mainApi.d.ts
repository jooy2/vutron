import type { IpcRendererEvent } from 'electron'
import type {
  MainInvokeChannel,
  MainSendChannel,
  RendererAvailChannel
} from '@/common/ipc'

type IpcListener = (event: IpcRendererEvent, ...args: any[]) => void

/*
 * Shape of the bridge that `src/preload` exposes on `window` through
 * `contextBridge`. It is declared once and used by both sides, so the preload
 * implementation and the renderer call sites cannot drift apart.
 *
 * Channels are typed against the lists in `src/common/ipc`, which is what the
 * preload checks against at runtime too. A channel that is not on the list is
 * a build error rather than a thrown error once the app is running.
 * */
export interface MainApi {
  // Fire and forget
  send: (channel: MainSendChannel, ...data: any[]) => void
  // Listen for a main process broadcast, returns an unsubscribe fn
  on: (channel: RendererAvailChannel, listener: IpcListener) => () => void
  once: (channel: RendererAvailChannel, listener: IpcListener) => () => void
  off: (channel: RendererAvailChannel, listener: IpcListener) => void
  // Request/response
  invoke: <T = any>(channel: MainInvokeChannel, ...data: any[]) => Promise<T>
}

declare global {
  interface Window {
    // Always injected by the preload script before the renderer runs
    mainApi: MainApi
  }
}
