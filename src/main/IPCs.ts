import { BrowserWindow, ipcMain, shell } from 'electron'
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

    // Open url via web browser
    ipcMain.on('msgOpenExternalLink', async (event, url) => {
      await shell.openExternal(url)
    })
  }
}
