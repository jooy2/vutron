import { app, BrowserWindow } from 'electron'
import Constants from './utils/Constants'
import { createErrorWindow, createMainWindow } from './MainRunner'
import IPCs from './IPCs'
import log from 'electron-log/main'
import { join } from 'path'

let mainWindow: BrowserWindow | null = null
let errorWindow: BrowserWindow | null = null

const initializeMainLogger = () => {
  log.initialize({
    includeFutureSessions: false,
    preload: true
  })

  const appLogFilePath = join(app.getPath('userData'), 'logs', 'applog.log')

  log.transports.file.resolvePathFn = () => appLogFilePath
  log.transports.file.level = 'silly'
  log.transports.file.format = '[{y}{m}{d} {h}:{i}:{s}.{ms}|{level}]{text}'
  log.transports.console.format = '{h}:{i}:{s}.{ms} {text}'
  log.transports.console.level = 'silly'

  log.silly(`Start logging... (Path: ${appLogFilePath}) App is ready.`)
}

const installDevTron = async () => {
  if (!Constants.IS_DEV_ENV) {
    return
  }

  try {
    const { devtron } = await import('@electron/devtron')
    await devtron.install()
  } catch {
    // Do nothing
  }
}

app.on('ready', async () => {
  if (Constants.IS_DEV_ENV) {
    import('./index.dev')
  }

  // Disable special menus on macOS by uncommenting the following, if necessary
  /*
  if (Constants.IS_MAC) {
    systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true)
    systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true)
  }
  */
  initializeMainLogger()

  await installDevTron()

  // Initialize IPC Communication. `ipcMain.handle` throws when the same channel
  // is registered twice, so this must not live in the window factory.
  IPCs.initialize()

  mainWindow = await createMainWindow()
})

app.on('activate', async () => {
  if (!mainWindow) {
    mainWindow = await createMainWindow()
  }
})

app.on('window-all-closed', () => {
  mainWindow = null
  errorWindow = null

  // On macOS an app is expected to stay alive until the user quits it
  // explicitly, so the window is recreated by the `activate` handler instead.
  if (!Constants.IS_MAC) {
    app.quit()
  }
})

// Parameter types are inferred from the Electron overload. Annotating `event`
// as the DOM `Event` here made the whole listener miss its overload.
app.on('render-process-gone', async (event, webContents, details) => {
  errorWindow = await createErrorWindow(errorWindow, mainWindow, details)
})

process.on('uncaughtException', async (error: Error) => {
  log.error(`Uncaught exception: ${error?.stack ?? error}`)

  errorWindow = await createErrorWindow(errorWindow, mainWindow)
})
