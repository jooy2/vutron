import { app } from 'electron'
import Constants from './utils/Constants'
import { createErrorWindow, createMainWindow } from './MainRunner'
import Menus from './utils/Menus'

let mainWindow
let errorWindow

app.on('ready', () => {
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

process.on('uncaughtException', () => {
  errorWindow = createErrorWindow(errorWindow, mainWindow)
})
