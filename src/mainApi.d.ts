import type {
  MainInvokeChannel,
  MainInvokeContracts,
  MainSendChannel,
  MainSendPayloads,
  RendererAvailChannel,
  RendererEventPayloads
} from '@/common/ipc'

/*
 * A listener for a main process broadcast. It is given the payload only. The
 * `IpcRendererEvent` stays in the preload script, because its `sender` is the
 * whole `ipcRenderer` and would hand the renderer every channel there is.
 * */
export type MainApiListener<C extends RendererAvailChannel> = (
  ...args: RendererEventPayloads[C]
) => void

/*
 * Shape of the bridge that `src/preload` exposes on `window` through
 * `contextBridge`. It is declared once and used by both sides, so the preload
 * implementation and the renderer call sites cannot drift apart.
 *
 * Channels are typed against the lists in `src/common/ipc`, which is what the
 * preload checks against at runtime too, and so are the arguments and the
 * reply of each one. A call that does not match its handler is a build error
 * rather than a value that turns out wrong once the app is running.
 * */
export interface MainApi {
  // Fire and forget
  send: <C extends MainSendChannel>(
    channel: C,
    ...data: MainSendPayloads[C]
  ) => void
  // Listen for a main process broadcast, returns an unsubscribe fn
  on: <C extends RendererAvailChannel>(
    channel: C,
    listener: MainApiListener<C>
  ) => () => void
  once: <C extends RendererAvailChannel>(
    channel: C,
    listener: MainApiListener<C>
  ) => () => void
  off: <C extends RendererAvailChannel>(
    channel: C,
    listener: MainApiListener<C>
  ) => void
  // Request/response
  invoke: <C extends MainInvokeChannel>(
    channel: C,
    ...data: MainInvokeContracts[C]['args']
  ) => Promise<MainInvokeContracts[C]['result']>
}

declare global {
  interface Window {
    // Always injected by the preload script before the renderer runs
    mainApi: MainApi
  }
}
