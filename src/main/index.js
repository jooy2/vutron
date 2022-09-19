import 'v8-compile-cache'
import { app } from 'electron'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Constants from './utils/Constants'
import { createErrorWindow, createMainWindow } from './MainRunner'
import Menus from './utils/Menus'

let mainWindow
let errorWindow

app.on('ready', () => {
  if (!Constants.IS_DEV_ENV) {
    global.__static = join(dirname(fileURLToPath(import.meta.url)), '/static')
      .replace(/\\/g, '\\\\')
  }

  Menus.macOSDisableDefaultMenuItem()

  mainWindow = createMainWindow(mainWindow)
})

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow(mainWindow)
  }
})

app.on('window-all-closed', () => {
  mainWindow = null
  errorWindow = null

  if (!Constants.IS_MAC) {
    app.quit()
  }
})

app.on('render-process-gone', (ev, webContents, details) => {
  errorWindow = createErrorWindow(errorWindow, mainWindow, details)
})
