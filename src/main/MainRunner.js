import { app, BrowserWindow } from 'electron'
import Constants from './utils/Constants'
import { join } from 'path'
import * as electronRemote from '@electron/remote/main'

const getAppIcon = () => {
  return join(__static, Constants.APP_ICON)
}

const exitApp = (mainWindow) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.hide()
  }
  mainWindow = null
  app.exit()
}

export const createMainWindow = async (mainWindow) => {
  mainWindow = new BrowserWindow({
    title: Constants.APP_NAME,
    icon: getAppIcon(),
    show: false,
    width: Constants.IS_DEV_ENV ? 1500 : 1200,
    height: 650,
    useContentSize: true,
    webPreferences: Constants.DEFAULT_WEB_PREFERENCES
  })

  mainWindow.setMenu(null)

  mainWindow.on('close', (event) => {
    event.preventDefault()
    exitApp(mainWindow)
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

    electronRemote.initialize()
  })

  await mainWindow.loadURL(`${Constants.APP_INDEX_URL}`)

  return mainWindow
}

export const createErrorWindow = (errorWindow, mainWindow, details) => {
  if (!Constants.IS_DEV_ENV) {
    mainWindow?.hide()
  }

  errorWindow = new BrowserWindow({
    title: Constants.APP_NAME,
    icon: getAppIcon(),
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
