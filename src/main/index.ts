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

// `src/main/index.dev` is loaded through a dynamic import so that the
// development extensions and the packages behind them are split into a chunk
// of their own, which `buildAssets/builder/config.js` then leaves out of the
// package.
const installDevTools = async (): Promise<void> => {
  if (!Constants.IS_DEV_ENV) {
    return
  }

  const { installDevTools: install } = await import('./index.dev')

  await install()
}

/*
 * Held for as long as this process is the only instance. The lock is keyed by
 * the user data directory, so a second launch is turned away before it can
 * open a window on the same logs, cache and settings.
 * */
const hasSingleInstanceLock =
  !Constants.FEAT_SINGLE_INSTANCE || app.requestSingleInstanceLock()

if (!hasSingleInstanceLock) {
  app.quit()
}

app.on('second-instance', (): void => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return
  }

  if (mainWindow.isMinimized()) {
    mainWindow.restore()
  }

  // The window may be hidden rather than minimized while the tray owns it.
  if (!mainWindow.isVisible()) {
    mainWindow.show()
  }

  mainWindow.focus()
})

app.on('ready', async () => {
  // `app.quit()` above only takes effect on the next turn of the event loop,
  // so this handler can still run in the instance that lost the lock.
  if (!hasSingleInstanceLock) {
    return
  }

  // Disable special menus on macOS by uncommenting the following, if necessary
  /*
  if (Constants.IS_MAC) {
    systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true)
    systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true)
  }
  */
  initializeMainLogger()

  // Started before the window so that the panels are registered by the time
  // DevTools opens, and awaited only afterwards: downloading an extension on
  // the first run must not hold up the first paint.
  const devToolsInstalled = installDevTools()

  // Initialize IPC Communication. `ipcMain.handle` throws when the same channel
  // is registered twice, so this must not live in the window factory.
  IPCs.initialize()

  mainWindow = await createMainWindow()

  await devToolsInstalled
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
