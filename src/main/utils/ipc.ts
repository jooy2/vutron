import { BrowserWindow, ipcMain } from 'electron'
import type { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import type {
  MainInvokeChannel,
  MainInvokeContracts,
  MainSendChannel,
  MainSendPayloads,
  RendererAvailChannel,
  RendererEventPayloads
} from '@/common/ipc'

/*
 * Thin wrappers around the Electron IPC entry points, typed against the
 * contracts in `src/common/ipc`.
 *
 * Electron types every channel as `any[]` in and `any` out, so nothing would
 * catch a handler that answers with the wrong shape or a listener that reads an
 * argument the renderer never sends. These say what each channel carries, and
 * the same contract types the renderer side through `src/mainApi.d.ts`.
 *
 * The casts are where the typed surface meets the untyped Electron signature.
 * They stay here so that no call site needs one.
 * */

// Handles a request that the renderer awaits, sent with `mainApi.invoke`
export const handleInvoke = <C extends MainInvokeChannel>(
  channel: C,
  handler: (
    event: IpcMainInvokeEvent,
    ...args: MainInvokeContracts[C]['args']
  ) =>
    MainInvokeContracts[C]['result'] | Promise<MainInvokeContracts[C]['result']>
): void => {
  ipcMain.handle(
    channel,
    handler as (event: IpcMainInvokeEvent, ...args: any[]) => unknown
  )
}

// Handles a message the renderer sends with `mainApi.send` and does not await
export const handleSend = <C extends MainSendChannel>(
  channel: C,
  listener: (event: IpcMainEvent, ...args: MainSendPayloads[C]) => void
): void => {
  ipcMain.on(channel, listener as (event: IpcMainEvent, ...args: any[]) => void)
}

// Sends to one window, received by a `mainApi.on` listener in the renderer
export const sendToWindow = <C extends RendererAvailChannel>(
  window: BrowserWindow,
  channel: C,
  ...args: RendererEventPayloads[C]
): void => {
  window.webContents.send(channel, ...args)
}
