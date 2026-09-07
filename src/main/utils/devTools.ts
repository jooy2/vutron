import type { BrowserWindow } from 'electron'
import Constants from './Constants'

/*
 * Opens DevTools once the window has loaded, and only once.
 *
 * Bound to `did-finish-load` rather than `did-frame-finish-load`, which also
 * fires for every subframe, and with `once` rather than `on`, which fired again
 * on every reload.
 * */
export const openDevToolsAtStart = (
  window: BrowserWindow,
  // The error window ignores `FEAT_OPEN_DEV_TOOLS_AT_START`. It only appears
  // after a crash, where the console is the whole point of showing it.
  ignoreFeatureFlag = false
): void => {
  const enabled = ignoreFeatureFlag || Constants.FEAT_OPEN_DEV_TOOLS_AT_START

  if (!Constants.IS_DEV_ENV || !enabled) {
    return
  }

  window.webContents.once('did-finish-load', (): void => {
    window.webContents.openDevTools()
  })
}
