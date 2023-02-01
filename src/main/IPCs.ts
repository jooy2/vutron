import { BrowserWindow, ipcMain } from 'electron'
import Constants from './utils/Constants'

/*
 * IPC Communications
 * */
export default class IPCs {
  static initialize(window: BrowserWindow) {
    // Get application version
    ipcMain.on('msgRequestGetVersion', () => {
      window.webContents.send('msgReceivedVersion', Constants.APP_VERSION)
    })
  }
}
