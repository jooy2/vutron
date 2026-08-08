import type { OpenDialogReturnValue } from 'electron'

/*
 * IPC channel names and payload types, shared by the three processes.
 *
 * The channel a renderer calls, the whitelist the preload checks it against and
 * the handler the main process registers are the same string, so it is written
 * once here instead of three times.
 *
 * Everything under `src/common` is bundled into the main, preload and renderer
 * builds alike. Anything only one of them can run has to stay out: no Node.js
 * builtins, no `electron` runtime import, no DOM globals. Type-only imports are
 * erased at build time, so they are fine. ESLint enforces this, see the
 * `src/common` block in `eslint.config.ts`.
 * */

// Renderer -> Main, no reply. Sent with `mainApi.send`, handled by `ipcMain.on`.
export const MAIN_SEND_CHANNELS = {
  openExternalLink: 'msgOpenExternalLink'
} as const

// Renderer -> Main, awaits a reply. Sent with `mainApi.invoke`, handled by
// `ipcMain.handle`.
export const MAIN_INVOKE_CHANNELS = {
  requestGetVersion: 'msgRequestGetVersion',
  openFile: 'msgOpenFile',
  openWindow: 'msgOpenWindow',
  closeWindow: 'msgCloseWindow',
  requestWindowInfo: 'msgRequestWindowInfo'
} as const

// Main -> Renderer. Sent with `webContents.send`, received with `mainApi.on`.
export const RENDERER_AVAIL_CHANNELS = {
  windowsUpdated: 'msgWindowsUpdated'
} as const

export type MainSendChannel =
  (typeof MAIN_SEND_CHANNELS)[keyof typeof MAIN_SEND_CHANNELS]

export type MainInvokeChannel =
  (typeof MAIN_INVOKE_CHANNELS)[keyof typeof MAIN_INVOKE_CHANNELS]

export type RendererAvailChannel =
  (typeof RENDERER_AVAIL_CHANNELS)[keyof typeof RENDERER_AVAIL_CHANNELS]

// Payload of `msgRequestWindowInfo`
export interface WindowInfo {
  // Whether the calling window was opened on top of the main window
  isChildWindow: boolean
  // Ids of the child windows open right now, the main window aside
  childWindowIds: number[]
}

// Payload of `msgOpenFile`. The dialog runs in the main process, its result
// crosses the bridge as a plain object.
export type OpenFileResult = OpenDialogReturnValue
