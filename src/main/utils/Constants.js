import { platform } from 'os'

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

  static APP_INDEX_URL_DEV = 'http://localhost:9080/index.html'
  static APP_INDEX_URL_PROD = './dist/electron/index.html'
}
