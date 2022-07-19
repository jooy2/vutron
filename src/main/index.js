import 'v8-compile-cache'
import { app } from 'electron'
import path from 'path'
import MainRunner from './MainRunner'
import { fileURLToPath } from 'url'
import Constants from './utils/Constants'
import * as electronRemote from '@electron/remote/main'

let mainWindow
let errorWindow

app.on('ready', () => {
  electronRemote.initialize()

  if (!Constants.IS_DEV_ENV) {
    global.__static = path.join(path.dirname(fileURLToPath(import.meta.url)), '/static')
      .replace(/\\/g, '\\\\')
  }

  mainWindow = MainRunner.createMainWindow(mainWindow)
})

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = MainRunner.createMainWindow(mainWindow)
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
  errorWindow = MainRunner.createErrorWindow(errorWindow, mainWindow, details)
})
