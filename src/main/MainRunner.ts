import {
  BrowserWindow,
  RenderProcessGoneDetails,
  BrowserWindowConstructorOptions
} from 'electron'
import Constants, { TrayOptions } from './utils/Constants'
import { createTray, destroyTray, hideWindow, showWindow } from './tray'
import { registerWindowSecurity } from './utils/security'
import log from 'electron-log/main'

export const createMainWindow = async (): Promise<BrowserWindow> => {
  log.silly('Creating new window...')

  const options = Constants.DEFAULT_WINDOW_OPTIONS

  let opt: BrowserWindowConstructorOptions = {
    title: Constants.APP_NAME,
    show: false,
    width: options.width,
    height: options.height,
    useContentSize: true,
    webPreferences: Constants.DEFAULT_WEB_PREFERENCES,
    frame: true
  }
  const trayOptions: TrayOptions = options.tray?.enabled
    ? {
        ...Constants.DEFAULT_TRAY_OPTIONS,
        ...options.tray
      }
    : {
        ...Constants.DEFAULT_TRAY_OPTIONS,
        enabled: false
      }

  // trayWindow requires tray.enabled=true
  if (trayOptions.enabled && trayOptions.trayWindow) {
    opt = {
      ...opt,
      width: options.width,
      height: options.height,
      maxWidth: options.width,
      maxHeight: options.height,
      show: false,
      frame: false,
      fullscreenable: false,
      hiddenInMissionControl: true,
      resizable: false,
      transparent: true,
      alwaysOnTop: true,
      webPreferences: {
        ...Constants.DEFAULT_WEB_PREFERENCES,
        backgroundThrottling: false
      }
    }
  }
  const mainWindow = new BrowserWindow(opt)

  mainWindow.setMenu(null)
  registerWindowSecurity(mainWindow)

  // The tray is bound to this window, so it has to go away with it. Otherwise
  // clicking the tray icon would reach into an already destroyed window.
  mainWindow.on('closed', (): void => {
    destroyTray()
  })

  mainWindow.webContents.on('did-frame-finish-load', (): void => {
    if (Constants.IS_DEV_ENV && Constants.FEAT_OPEN_DEV_TOOLS_AT_START) {
      mainWindow.webContents.openDevTools()
    }
  })

  if (trayOptions.enabled) {
    createTray(mainWindow, trayOptions)
  }

  if (trayOptions.enabled && trayOptions.trayWindow) {
    hideWindow(mainWindow)
    if (trayOptions.showAtStartup) {
      showWindow(mainWindow)
    }
  } else {
    mainWindow.once('ready-to-show', (): void => {
      mainWindow.setAlwaysOnTop(true)
      mainWindow.show()
      mainWindow.focus()
      mainWindow.setAlwaysOnTop(false)
    })
  }

  if (Constants.IS_DEV_ENV) {
    await mainWindow.loadURL(Constants.APP_INDEX_URL_DEV)
  } else {
    await mainWindow.loadFile(Constants.APP_INDEX_URL_PROD)
  }

  return mainWindow
}

export const createErrorWindow = async (
  currentErrorWindow: BrowserWindow | null,
  mainWindow: BrowserWindow | null,
  details?: RenderProcessGoneDetails
): Promise<BrowserWindow> => {
  log.error(
    details
      ? `Renderer process gone. (reason: ${details.reason}, exitCode: ${details.exitCode})`
      : 'Showing error window.'
  )

  // Reuse the window that is already on screen. Without this guard, a crash
  // loop or repeated uncaught exceptions would stack error windows endlessly.
  if (currentErrorWindow && !currentErrorWindow.isDestroyed()) {
    currentErrorWindow.focus()

    return currentErrorWindow
  }

  if (!Constants.IS_DEV_ENV) {
    mainWindow?.hide()
  }

  const errorWindow = new BrowserWindow({
    title: Constants.APP_NAME,
    show: false,
    resizable: Constants.IS_DEV_ENV,
    webPreferences: Constants.DEFAULT_WEB_PREFERENCES
  })

  errorWindow.setMenu(null)
  registerWindowSecurity(errorWindow)

  if (Constants.IS_DEV_ENV) {
    await errorWindow.loadURL(`${Constants.APP_INDEX_URL_DEV}#/error`)
  } else {
    await errorWindow.loadFile(Constants.APP_INDEX_URL_PROD, { hash: 'error' })
  }

  errorWindow.once('ready-to-show', (): void => {
    if (!Constants.IS_DEV_ENV && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.destroy()
    }
    errorWindow.show()
    errorWindow.focus()
  })

  errorWindow.webContents.on('did-frame-finish-load', (): void => {
    if (Constants.IS_DEV_ENV) {
      errorWindow.webContents.openDevTools()
    }
  })

  return errorWindow
}
