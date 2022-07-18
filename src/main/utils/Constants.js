import { join } from 'path'
import { platform } from 'os'
import { app } from 'electron'

export default class Constants {
  static APP_NAME = 'Vutron'
  static APP_ICON = 'app-icon.png'

  static IS_DEV_ENV = process.env.NODE_ENV === 'development'

  static IS_MAC = platform() === 'darwin'

  static DEFAULT_WEB_PREFERENCES = {
    nodeIntegration: true,
    contextIsolation: false,
    nodeIntegrationInWorker: true,
    enableRemoteModule: true
  }

  static APP_INDEX_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080/index.html'
    : join('file://', app.getAppPath(), '/dist/electron/index.html')
}
