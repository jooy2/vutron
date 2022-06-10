import { app, BrowserWindow } from 'electron'
import path from 'path'
import Constants from './utils/Constants'

export default class MainRunner {
  static async createMainWindow (mainWindow) {
    mainWindow = new BrowserWindow({
      show: false,
      width: Constants.IS_DEV_ENV ? 1500 : 1200,
      height: 650,
      icon: path.join(__static, Constants.APP_ICON),
      title: Constants.APP_NAME,
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

  static createCrashWindow (crashWindow, mainWindow, details) {
    if (!Constants.IS_DEV_ENV) {
      mainWindow?.hide()
    }

    crashWindow = new BrowserWindow({
      show: false,
      title: Constants.APP_NAME,
      icon: path.join(__static, Constants.APP_ICON),
      resizable: Constants.IS_DEV_ENV,
      webPreferences: Constants.DEFAULT_WEB_PREFERENCES
    })
    crashWindow.setMenu(null)
    crashWindow.loadURL(`${Constants.APP_INDEX_URL}#/crash`).then(() => true)
    crashWindow.on('ready-to-show', () => {
      if (!Constants.IS_DEV_ENV && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.destroy()
      }
      crashWindow.show()
      crashWindow.focus()
    })
    crashWindow.webContents.on('did-frame-finish-load', () => {
      if (Constants.IS_DEV_ENV) {
        crashWindow.webContents.openDevTools()
      }
    })

    return crashWindow
  }

  static exitApp (mainWindow) {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.hide()
    }
    mainWindow = null
    app.exit()
  }
}
