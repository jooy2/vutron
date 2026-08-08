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
import {
  MAIN_INVOKE_CHANNELS,
  MAIN_SEND_CHANNELS,
  type WindowInfo
} from '@/common/ipc'
import log from 'electron-log/main'

/*
 * IPC Communications
 * */
export default class IPCs {
  static initialize(): void {
    // Get application version
    ipcMain.handle(MAIN_INVOKE_CHANNELS.requestGetVersion, () => {
      return Constants.APP_VERSION
    })

    // Open url via web browser
    ipcMain.on(
      MAIN_SEND_CHANNELS.openExternalLink,
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
      MAIN_INVOKE_CHANNELS.openFile,
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
      MAIN_INVOKE_CHANNELS.openWindow,
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
    ipcMain.handle(
      MAIN_INVOKE_CHANNELS.closeWindow,
      (event: IpcMainInvokeEvent) => {
        return WindowManager.close(BrowserWindow.fromWebContents(event.sender))
      }
    )

    // State a freshly loaded window needs before the first `msgWindowsUpdated`
    // broadcast reaches it
    ipcMain.handle(
      MAIN_INVOKE_CHANNELS.requestWindowInfo,
      (event: IpcMainInvokeEvent): WindowInfo => {
        const senderWindow = BrowserWindow.fromWebContents(event.sender)

        return {
          isChildWindow: WindowManager.isChildWindow(senderWindow),
          childWindowIds: WindowManager.getIds()
        }
      }
    )
  }
}
