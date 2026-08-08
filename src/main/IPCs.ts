import {
  ipcMain,
  shell,
  BrowserWindow,
  IpcMainEvent,
  IpcMainInvokeEvent,
  dialog
} from 'electron'
import Constants from './utils/Constants'
import WindowManager from './WindowManager'
import { isAllowedExternalUrl } from './utils/security'
import log from 'electron-log/main'

/*
 * IPC Communications
 * */
export default class IPCs {
  static initialize(): void {
    // Get application version
    ipcMain.handle('msgRequestGetVersion', () => {
      return Constants.APP_VERSION
    })

    // Open url via web browser
    ipcMain.on(
      'msgOpenExternalLink',
      async (event: IpcMainEvent, url: string) => {
        // Without this check the renderer could hand the OS any scheme it
        // likes (`file:`, `smb:`, custom app handlers), not just a web link.
        if (!isAllowedExternalUrl(url)) {
          log.warn(`Blocked external link with an unsupported protocol: ${url}`)

          return
        }

        await shell.openExternal(url)
      }
    )

    // Open file
    ipcMain.handle(
      'msgOpenFile',
      async (event: IpcMainInvokeEvent, filter: string) => {
        const filters = []
        if (filter === 'text') {
          filters.push({ name: 'Text', extensions: ['txt', 'json'] })
        } else if (filter === 'zip') {
          filters.push({ name: 'Zip', extensions: ['zip'] })
        }
        const dialogResult = await dialog.showOpenDialog({
          properties: ['openFile'],
          filters
        })
        return dialogResult
      }
    )

    // Open a new window on the given renderer route. Returns the window id, or
    // `null` when the request was refused (feature off, limit reached, bad route)
    ipcMain.handle(
      'msgOpenWindow',
      async (event: IpcMainInvokeEvent, path: string) => {
        const childWindow = await WindowManager.open(
          path,
          BrowserWindow.fromWebContents(event.sender)
        )

        return childWindow?.id ?? null
      }
    )

    // Close the window the request came from. Only windows owned by
    // `WindowManager` are closed, so a shared component cannot shut the app down
    // by calling this from the main window.
    ipcMain.handle('msgCloseWindow', (event: IpcMainInvokeEvent) => {
      return WindowManager.close(BrowserWindow.fromWebContents(event.sender))
    })

    // State a freshly loaded window needs before the first `msgWindowsUpdated`
    // broadcast reaches it
    ipcMain.handle('msgRequestWindowInfo', (event: IpcMainInvokeEvent) => {
      const senderWindow = BrowserWindow.fromWebContents(event.sender)

      return {
        isChildWindow: WindowManager.isChildWindow(senderWindow),
        childWindowIds: WindowManager.getIds()
      }
    })
  }
}
