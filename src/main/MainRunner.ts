import { app, BrowserWindow,  RenderProcessGoneDetails, BrowserWindowConstructorOptions } from 'electron'
import Constants from './utils/Constants'
import IPCs from './IPCs'
import { createTray, setWindowAutoHide } from './tray.ts'
import { moveToCurrentDesktop } from './desktop.ts'

const options = {
  tray: true,
  trayWindow: true,
  width: Constants.IS_DEV_ENV ? 1500 : 1200,
  height: 650,
  trayOptions: {
    menu: false,
    tooltip: 'Vutron App',
    margin: {x:0, y:0},
    width: Constants.IS_DEV_ENV ? 1500 : 1200,
    height: 650,
  }
}

const exitApp = (mainWindow: BrowserWindow): void => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.hide()
  }
  mainWindow.destroy()
  app.exit()
}

export const createMainWindow = async (): Promise<BrowserWindow> => {
  let opt: BrowserWindowConstructorOptions = {
    title: Constants.APP_NAME,
    show: false,
    width: options.width,
    height: options.height,
    useContentSize: true,
    webPreferences: Constants.DEFAULT_WEB_PREFERENCES,
    frame: !options.trayWindow,
  }
  if (options.trayWindow){
    opt = {
      ...opt,
      width: options.trayOptions.width ,
      height: options.trayOptions.height,
      maxWidth: options.trayOptions.width,
      maxHeight: options.trayOptions.height,
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

  mainWindow.on('close', (event: Event): void => {
    event.preventDefault()
    exitApp(mainWindow)
  })

  mainWindow.webContents.on('did-frame-finish-load', (): void => {
    if (Constants.IS_DEV_ENV && Constants.IS_DEVTOOLS) {
      mainWindow.webContents.openDevTools()
    }
  })

  if (options.tray) {
    createTray(mainWindow, options.trayOptions);
  }

  if (options.trayWindow) {
    setWindowAutoHide(mainWindow);
    // showWindow(mainWindow)
  }else{
    mainWindow.once('ready-to-show', (): void => {
      mainWindow.setAlwaysOnTop(true)
      mainWindow.show()
      mainWindow.focus()
      mainWindow.setAlwaysOnTop(false)

      // moveToCurrentDesktop(mainWindow)
    })
  }

  // Initialize IPC Communication
  IPCs.initialize()

  if (Constants.IS_DEV_ENV) {
    await mainWindow.loadURL(Constants.APP_INDEX_URL_DEV)
  } else {
    await mainWindow.loadFile(Constants.APP_INDEX_URL_PROD)
  }

  return mainWindow
}

export const createErrorWindow = async (
  errorWindow: BrowserWindow,
  mainWindow: BrowserWindow,
  details?: RenderProcessGoneDetails
): Promise<BrowserWindow> => {
  if (!Constants.IS_DEV_ENV) {
    mainWindow?.hide()
  }

  errorWindow = new BrowserWindow({
    title: Constants.APP_NAME,
    show: false,
    resizable: Constants.IS_DEV_ENV,
    webPreferences: Constants.DEFAULT_WEB_PREFERENCES
  })

  errorWindow.setMenu(null)

  if (Constants.IS_DEV_ENV) {
    await errorWindow.loadURL(`${Constants.APP_INDEX_URL_DEV}#/error`)
  } else {
    await errorWindow.loadFile(Constants.APP_INDEX_URL_PROD, { hash: 'error' })
  }

  errorWindow.on('ready-to-show', (): void => {
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
