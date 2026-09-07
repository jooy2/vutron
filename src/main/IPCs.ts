import {
  shell,
  dialog,
  BrowserWindow,
  IpcMainEvent,
  IpcMainInvokeEvent
} from 'electron'
import Constants from './utils/Constants'
import WindowManager from './WindowManager'
import { isAllowedExternalUrl } from './utils/security'
import { handleInvoke, handleSend } from './utils/ipc'
import { MAIN_INVOKE_CHANNELS, MAIN_SEND_CHANNELS } from '@/common/ipc'
import log from 'electron-log/main'

/*
 * IPC Communications
 *
 * Every channel is registered through the helpers in `utils/ipc`, so the
 * arguments and the reply are checked against the contract the renderer calls
 * with. See `src/common/ipc.ts`.
 * */
export default class IPCs {
  static initialize(): void {
    // Get application version
    handleInvoke(MAIN_INVOKE_CHANNELS.requestGetVersion, () => {
      return Constants.APP_VERSION
    })

    // Open url via web browser
    handleSend(
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
    handleInvoke(
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
    handleInvoke(
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
    handleInvoke(
      MAIN_INVOKE_CHANNELS.closeWindow,
      (event: IpcMainInvokeEvent) => {
        return WindowManager.close(BrowserWindow.fromWebContents(event.sender))
      }
    )

    // State a freshly loaded window needs before the first `msgWindowsUpdated`
    // broadcast reaches it
    handleInvoke(
      MAIN_INVOKE_CHANNELS.requestWindowInfo,
      (event: IpcMainInvokeEvent) => {
        const senderWindow = BrowserWindow.fromWebContents(event.sender)

        return {
          isChildWindow: WindowManager.isChildWindow(senderWindow),
          childWindowIds: WindowManager.getIds()
        }
      }
    )
  }
}
