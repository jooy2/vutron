import { BrowserWindow, shell } from 'electron'
import { pathToFileURL } from 'url'
import log from 'electron-log/main'
import Constants from './Constants'

/*
 * Guards for anything the renderer can ask the main process to open.
 * The renderer is untrusted by design, so URLs coming from it are validated
 * here instead of being handed straight to the OS.
 * */
const ALLOWED_EXTERNAL_PROTOCOLS = ['http:', 'https:']

export const isAllowedExternalUrl = (url: string): boolean => {
  try {
    return ALLOWED_EXTERNAL_PROTOCOLS.includes(new URL(url).protocol)
  } catch {
    // Not a parsable URL at all
    return false
  }
}

const isInternalUrl = (url: string): boolean => {
  try {
    const target = new URL(url)

    if (Constants.IS_DEV_ENV) {
      return target.origin === new URL(Constants.APP_INDEX_URL_DEV).origin
    }

    // `file:` URLs share a single opaque origin, so comparing origins would
    // accept any local file. The built index is the only valid target.
    return (
      target.protocol === 'file:' &&
      target.pathname === pathToFileURL(Constants.APP_INDEX_URL_PROD).pathname
    )
  } catch {
    return false
  }
}

const openExternalUrl = (url: string): void => {
  if (!isAllowedExternalUrl(url)) {
    log.warn(`Blocked external link with an unsupported protocol: ${url}`)

    return
  }

  shell.openExternal(url)
}

/*
 * Keeps a window pinned to the app itself. Anything that tries to navigate
 * elsewhere, or to spawn a new Electron window, is handed to the default
 * browser instead of being rendered with the app's own privileges.
 * */
export const registerWindowSecurity = (window: BrowserWindow): void => {
  window.webContents.on('will-navigate', (event, url): void => {
    if (isInternalUrl(url)) {
      return
    }

    event.preventDefault()
    log.warn(`Blocked navigation to: ${url}`)
    openExternalUrl(url)
  })

  window.webContents.setWindowOpenHandler(({ url }) => {
    openExternalUrl(url)

    return { action: 'deny' }
  })
}
