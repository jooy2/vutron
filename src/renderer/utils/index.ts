import {
  MAIN_INVOKE_CHANNELS,
  MAIN_SEND_CHANNELS,
  RENDERER_AVAIL_CHANNELS,
  type OpenFileResult,
  type WindowInfo
} from '@/common/ipc'
import { resolveLocale } from '@/common/locales'

// Language the app starts in. The tag matching itself is shared with the main
// process in `common/locales`, only the browser global is renderer side.
export function getCurrentLocale(): string {
  return resolveLocale(navigator?.language)
}

// `version` from `package.json`, which only the main process can read
export function getAppVersion(): Promise<string> {
  return window.mainApi.invoke(MAIN_INVOKE_CHANNELS.requestGetVersion)
}

// `send` is fire and forget, there is nothing to await here
export function openExternal(url: string): void {
  window.mainApi.send(MAIN_SEND_CHANNELS.openExternalLink, url)
}

export function openFile(type: string): Promise<OpenFileResult> {
  return window.mainApi.invoke(MAIN_INVOKE_CHANNELS.openFile, type)
}

// Opens a router path in its own window. Resolves with the new window id, or
// `null` when the main process refused the request.
export function openWindow(path: string): Promise<number | null> {
  return window.mainApi.invoke(MAIN_INVOKE_CHANNELS.openWindow, path)
}

// Resolves with `false` when called from the main window, which is never closed
// this way
export function closeCurrentWindow(): Promise<boolean> {
  return window.mainApi.invoke(MAIN_INVOKE_CHANNELS.closeWindow)
}

export function getWindowInfo(): Promise<WindowInfo> {
  return window.mainApi.invoke(MAIN_INVOKE_CHANNELS.requestWindowInfo)
}

// Returns the unsubscribe function, call it before the component goes away
export function onWindowsUpdated(
  listener: (childWindowIds: number[]) => void
): () => void {
  return window.mainApi.on(
    RENDERER_AVAIL_CHANNELS.windowsUpdated,
    (_event, childWindowIds) => listener(childWindowIds)
  )
}
