import { BrowserWindow, screen } from 'electron'
import Constants from './utils/Constants'
import { isAllowedWindowPath, registerWindowSecurity } from './utils/security'
import { RENDERER_AVAIL_CHANNELS } from '@/common/ipc'
import log from 'electron-log/main'

/*
 * Child window manager
 *
 * Owns every window opened on top of the main window. The main window itself
 * stays with `MainRunner`, so closing a child can never take the app down.
 * Windows are keyed by `BrowserWindow.id`, which Electron never reuses.
 * */
export default class WindowManager {
  // Insertion ordered, so the cascade follows the order windows opened in.
  private static childWindows = new Map<
    number,
    { window: BrowserWindow; path: string }
  >()

  static async open(
    path: string,
    parent?: BrowserWindow | null
  ): Promise<BrowserWindow | null> {
    if (!Constants.FEAT_MULTI_WINDOW) {
      log.warn(`Multi window is disabled. Ignored open request: ${path}`)

      return null
    }

    if (!isAllowedWindowPath(path)) {
      log.warn(`Blocked window open with an unsupported route: ${path}`)

      return null
    }

    const options = Constants.DEFAULT_CHILD_WINDOW_OPTIONS

    if (!options.allowDuplicatePath) {
      const openedWindow = WindowManager.findByPath(path)

      // Bring the window that already shows this route forward rather than
      // stacking an identical one behind it.
      if (openedWindow) {
        openedWindow.focus()

        return openedWindow
      }
    }

    if (WindowManager.childWindows.size >= options.maxWindows) {
      log.warn(
        `Reached the maximum number of windows (${options.maxWindows}). Ignored open request: ${path}`
      )

      return null
    }

    log.silly(`Creating new child window... (route: ${path})`)

    const childWindow = new BrowserWindow({
      title: Constants.APP_NAME,
      show: false,
      width: options.width,
      height: options.height,
      useContentSize: true,
      webPreferences: Constants.DEFAULT_WEB_PREFERENCES,
      frame: true,
      ...WindowManager.getCascadeBounds(parent)
    })

    childWindow.setMenu(null)
    registerWindowSecurity(childWindow)

    WindowManager.childWindows.set(childWindow.id, {
      window: childWindow,
      path
    })

    // `closed` fires after the window is gone, so the entry cannot be left
    // behind by a close the renderer did not ask for (OS close button, quit).
    childWindow.on('closed', (): void => {
      WindowManager.childWindows.delete(childWindow.id)
      WindowManager.notifyWindowsUpdated()
    })

    childWindow.once('ready-to-show', (): void => {
      childWindow.show()
      childWindow.focus()
    })

    childWindow.webContents.on('did-frame-finish-load', (): void => {
      if (Constants.IS_DEV_ENV && Constants.FEAT_OPEN_DEV_TOOLS_AT_START) {
        childWindow.webContents.openDevTools()
      }
    })

    if (Constants.IS_DEV_ENV) {
      await childWindow.loadURL(`${Constants.APP_INDEX_URL_DEV}#${path}`)
    } else {
      await childWindow.loadFile(Constants.APP_INDEX_URL_PROD, { hash: path })
    }

    WindowManager.notifyWindowsUpdated()

    return childWindow
  }

  static close(window: BrowserWindow | null): boolean {
    if (!window || !WindowManager.isChildWindow(window)) {
      return false
    }

    window.close()

    return true
  }

  static closeAll(): void {
    for (const { window } of [...WindowManager.childWindows.values()]) {
      if (!window.isDestroyed()) {
        window.close()
      }
    }
  }

  static isChildWindow(window: BrowserWindow | null): boolean {
    return window ? WindowManager.childWindows.has(window.id) : false
  }

  static getIds(): number[] {
    return [...WindowManager.childWindows.keys()]
  }

  private static findByPath(path: string): BrowserWindow | null {
    for (const child of WindowManager.childWindows.values()) {
      if (child.path === path && !child.window.isDestroyed()) {
        return child.window
      }
    }

    return null
  }

  /*
   * Offsets a new window from the one that opened it, then keeps it inside the
   * work area of the display that window sits on. Without the clamp a long
   * cascade would walk windows off the bottom right of the screen.
   * */
  private static getCascadeBounds(
    parent?: BrowserWindow | null
  ): { x: number; y: number } | Record<string, never> {
    if (!parent || parent.isDestroyed()) {
      return {}
    }

    const options = Constants.DEFAULT_CHILD_WINDOW_OPTIONS
    const parentBounds = parent.getBounds()
    const step = WindowManager.childWindows.size + 1
    const { workArea } = screen.getDisplayMatching(parentBounds)

    return {
      x: Math.max(
        workArea.x,
        Math.min(
          workArea.x + workArea.width - options.width,
          parentBounds.x + options.cascadeOffset.x * step
        )
      ),
      y: Math.max(
        workArea.y,
        Math.min(
          workArea.y + workArea.height - options.height,
          parentBounds.y + options.cascadeOffset.y * step
        )
      )
    }
  }

  /*
   * Every window shares the same renderer code, so the window list is pushed to
   * all of them at once instead of only to the one that triggered the change.
   * */
  private static notifyWindowsUpdated(): void {
    const windowIds = WindowManager.getIds()

    for (const window of BrowserWindow.getAllWindows()) {
      if (!window.isDestroyed()) {
        window.webContents.send(
          RENDERER_AVAIL_CHANNELS.windowsUpdated,
          windowIds
        )
      }
    }
  }
}
