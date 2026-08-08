import { join, dirname, resolve } from 'path'
import { name, version, debug } from '../../../package.json'
import { fileURLToPath } from 'url'
import type { WebPreferences } from 'electron'

const __dirname = dirname(fileURLToPath(import.meta.url))

export interface TrayOptions {
  enabled: boolean
  trayWindow: boolean
  menu: boolean
  tooltip: string
  margin: { x: number; y: number }
  showAtStartup: boolean
}

export interface WindowOptions {
  width: number
  height: number
  tray: Partial<TrayOptions>
}

export interface ChildWindowOptions {
  width: number
  height: number
  maxWindows: number
  cascadeOffset: { x: number; y: number }
  allowDuplicatePath: boolean
}

export default class Constants {
  /* ------------------------------------------------------
   * Vutron app feature list
   *
   * This template includes examples so you can try out several Electron features.
   * To remove them from your project, you'll need to disable the features below, or find and delete the related code.
   * ------------------------------------------------------ */
  // To show devtools at startup. It requires IS_DEV_ENV=true.
  // Note: For debugging purpose, window won't be closed if click elsewhere, if devtools is open.
  static FEAT_OPEN_DEV_TOOLS_AT_START = true
  // To let the renderer open extra windows on top of the main window through
  // `WindowManager`. Set it to `false` and every open request is refused,
  // whatever `DEFAULT_CHILD_WINDOW_OPTIONS` says.
  static FEAT_MULTI_WINDOW = true
  /* ------------------------------------------------------
   * END OF FEATURES
   * ------------------------------------------------------ */

  // Display app name (uppercase first letter)
  static APP_NAME = name.charAt(0).toUpperCase() + name.slice(1)

  static APP_VERSION = version

  static IS_DEV_ENV = process.env.NODE_ENV === 'development'

  static PUBLIC_PATH = Constants.IS_DEV_ENV
    ? resolve(__dirname, '../../src/public')
    : resolve(__dirname, '..')

  static IS_MAC = process.platform === 'darwin'

  // Typed so that options removed from Electron (such as the former
  // `enableRemoteModule`) fail the build instead of sitting here doing nothing.
  static DEFAULT_WEB_PREFERENCES: WebPreferences = {
    nodeIntegration: false,
    contextIsolation: true,
    // Already the default while `nodeIntegration` is off, kept explicit so it
    // is not lost when these preferences are edited.
    sandbox: true,
    preload: join(__dirname, '../preload/index.js')
  }

  static DEFAULT_TRAY_OPTIONS: TrayOptions = {
    enabled: false,
    trayWindow: false,
    menu: false,
    tooltip: 'Vutron App',
    margin: { x: 0, y: 0 },
    showAtStartup: false
  }

  // Main window settings. Any tray value left out here falls back to
  // `DEFAULT_TRAY_OPTIONS` above.
  static DEFAULT_WINDOW_OPTIONS: WindowOptions = {
    width: Constants.IS_DEV_ENV ? 1500 : 1200,
    height: 650,
    tray: {
      enabled: true,
      // true, to use a tray menu ; false to toggle visibility on click on tray icon
      menu: false,
      // true, to use a tray floating window attached to top tray icon
      trayWindow: false
    }
  }

  // Windows opened at runtime by `WindowManager`. Only used while
  // `FEAT_MULTI_WINDOW` is enabled.
  static DEFAULT_CHILD_WINDOW_OPTIONS: ChildWindowOptions = {
    width: 800,
    height: 600,
    // Upper bound on windows open at the same time, the main window aside.
    maxWindows: 5,
    // Each window is placed down and to the right of the one that opened it.
    cascadeOffset: { x: 32, y: 32 },
    // false, to focus the window already showing a route instead of opening
    // a second one for the same path
    allowDuplicatePath: true
  }

  static APP_INDEX_URL_DEV = `${debug.env.VITE_DEV_SERVER_URL}/index.html`
  static APP_INDEX_URL_PROD = join(__dirname, '../index.html')
}
