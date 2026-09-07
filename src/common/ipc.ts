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

/*
 * What travels on each channel.
 *
 * The channel name alone only says that a channel exists. These three maps say
 * what it carries, so a call site is checked against the handler on the other
 * side instead of against `any`. Adding a channel above without adding it here
 * is a build error, which is the point.
 *
 * Every value has to survive the structured clone that IPC puts it through:
 * plain data only, no class instances, no functions.
 * */

// Arguments of `mainApi.send`, received by the `ipcMain.on` handler
export interface MainSendPayloads {
  [MAIN_SEND_CHANNELS.openExternalLink]: [url: string]
}

// Arguments and reply of `mainApi.invoke`, answered by `ipcMain.handle`
export interface MainInvokeContracts {
  [MAIN_INVOKE_CHANNELS.requestGetVersion]: { args: []; result: string }
  [MAIN_INVOKE_CHANNELS.openFile]: {
    args: [filter: string]
    result: OpenFileResult
  }
  [MAIN_INVOKE_CHANNELS.openWindow]: {
    args: [path: string]
    result: number | null
  }
  [MAIN_INVOKE_CHANNELS.closeWindow]: { args: []; result: boolean }
  [MAIN_INVOKE_CHANNELS.requestWindowInfo]: { args: []; result: WindowInfo }
}

// Arguments of `webContents.send`, received by a `mainApi.on` listener
export interface RendererEventPayloads {
  [RENDERER_AVAIL_CHANNELS.windowsUpdated]: [childWindowIds: number[]]
}
