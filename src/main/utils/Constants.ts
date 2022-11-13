import { join } from 'path'

export default class Constants {
  static APP_NAME = 'Vutron'

  static IS_DEV_ENV = process.env.NODE_ENV === 'development'

  static IS_MAC = process.platform === 'darwin'

  static DEFAULT_WEB_PREFERENCES = {
    nodeIntegration: true,
    contextIsolation: false,
    nodeIntegrationInWorker: true,
    preload: join(__dirname, '../preload/index.js')
  }

  static APP_INDEX_URL_DEV = 'http://localhost:5173/index.html'
  static APP_INDEX_URL_PROD = join(__dirname, '../index.html')
}
