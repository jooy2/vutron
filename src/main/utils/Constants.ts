import { join, dirname, resolve } from 'path'
import { name, version, debug } from '../../../package.json'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export interface TrayOptions {
  enabled: boolean
  trayWindow: boolean
  menu: boolean
  tooltip: string
  margin: { x: number; y: number }
  showAtStartup: boolean
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

  static DEFAULT_WEB_PREFERENCES = {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
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

  static APP_INDEX_URL_DEV = `${debug.env.VITE_DEV_SERVER_URL}/index.html`
  static APP_INDEX_URL_PROD = join(__dirname, '../index.html')
}
