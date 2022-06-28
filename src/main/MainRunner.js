import { app, BrowserWindow } from 'electron'
import path from 'path'
import Constants from './utils/Constants'

const BROWSER_WINDOW_DEFAULT = {
  title: Constants.APP_NAME,
  icon: path.join(__static, Constants.APP_ICON)
}

export default class MainRunner {
  static async createMainWindow (mainWindow) {
    mainWindow = new BrowserWindow({
      ...BROWSER_WINDOW_DEFAULT,
      show: false,
      width: Constants.IS_DEV_ENV ? 1500 : 1200,
      height: 650,
      useContentSize: true,
      webPreferences: Constants.DEFAULT_WEB_PREFERENCES
    })

    mainWindow.setMenu(null)

    mainWindow.on('close', (event) => {
      event.preventDefault()
      MainRunner.exitApp(mainWindow)
    })

    mainWindow.on('show', () => {
      mainWindow.focus()
    })

    mainWindow.webContents.on('did-frame-finish-load', () => {
      if (Constants.IS_DEV_ENV) {
        mainWindow.webContents.openDevTools()
      }
    })

    mainWindow.once('ready-to-show', () => {
      mainWindow.setAlwaysOnTop(true)
      mainWindow.show()
      mainWindow.setAlwaysOnTop(false)
    })

    await mainWindow.loadURL(`${Constants.APP_INDEX_URL}`)

    return mainWindow
  }

  static createErrorWindow (errorWindow, mainWindow, details) {
    if (!Constants.IS_DEV_ENV) {
      mainWindow?.hide()
    }

    errorWindow = new BrowserWindow({
      show: false,
      resizable: Constants.IS_DEV_ENV,
      webPreferences: Constants.DEFAULT_WEB_PREFERENCES
    })

    errorWindow.setMenu(null)
    errorWindow.loadURL(`${Constants.APP_INDEX_URL}#/error`).then(() => true)

    errorWindow.on('ready-to-show', () => {
      if (!Constants.IS_DEV_ENV && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.destroy()
      }
      errorWindow.show()
      errorWindow.focus()
    })

    errorWindow.webContents.on('did-frame-finish-load', () => {
      if (Constants.IS_DEV_ENV) {
        errorWindow.webContents.openDevTools()
      }
    })

    return errorWindow
  }

  static exitApp (mainWindow) {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.hide()
    }
    mainWindow = null
    app.exit()
  }
}
