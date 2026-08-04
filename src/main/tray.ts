import { app, screen, Menu, Tray, BrowserWindow, Rectangle } from 'electron'
import Constants, { TrayOptions } from './utils/Constants'
import { join } from 'path'
import { debounce } from 'qsu'

let tray: Tray | null = null
let trayOptions: TrayOptions = Constants.DEFAULT_TRAY_OPTIONS

export function createTray(window: BrowserWindow, options?: TrayOptions): Tray {
  trayOptions = options || Constants.DEFAULT_TRAY_OPTIONS
  // menu or trayWindow, you need to choose
  if (trayOptions.trayWindow) {
    trayOptions.menu = false
  }

  const currentTray = new Tray(
    join(Constants.PUBLIC_PATH, 'images/vutron-tray-icon.png')
  )

  tray = currentTray
  currentTray.setToolTip(trayOptions.tooltip)
  if (trayOptions.menu) {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show App',
        click: () => {
          showWindow(window)
        }
      },
      {
        label: 'Hide App',
        click: () => {
          hideWindow(window)
        }
      },
      {
        label: 'Exit',
        click: () => {
          app.quit()
        }
      }
    ])
    // tray icon only with classic window
    currentTray.setContextMenu(contextMenu)
  } else {
    // handle click on tray icon
    // `debounce` returns a debounced function, so it must be created once and
    // reused as the listener. Calling it inside the handler only builds a new
    // function on every event and never invokes it.
    const handleTrayClick = debounce(() => toggleWindow(window), 200)

    currentTray.on('right-click', handleTrayClick)
    currentTray.on('click', handleTrayClick)
    // no menu for tray window
    window.setMenu(null)
    currentTray.setContextMenu(null)
  }
  // A floating tray window hides when clicking elsewhere on screen. Registered
  // once here, because registering it inside `hideWindow` would stack up a new
  // listener on every show/hide cycle.
  if (trayOptions.trayWindow) {
    window.on('blur', () => {
      // dont close if devtools
      if (!window.webContents.isDevToolsOpened()) {
        window.hide()
      }
    })
  }
  // align at startup
  alignWindow(window)

  return currentTray
}

export function destroyTray(): void {
  tray?.destroy()
  tray = null
}

export function hideWindow(window: BrowserWindow): void {
  window.hide()
}

export function toggleWindow(window: BrowserWindow): void {
  if (window.isVisible()) {
    hideWindow(window)
  } else {
    showWindow(window)
  }
}

export function showWindow(window: BrowserWindow): void {
  window.show()
  alignWindow(window)
}

export function alignWindow(window: BrowserWindow): void {
  if (!trayOptions.trayWindow || !tray) return

  const b = window.getBounds()
  const position = calculateWindowPosition(b, tray.getBounds())
  window.setBounds({
    width: b.width,
    height: b.height,
    x: position.x,
    y: position.y
  })
}

function calculateWindowPosition(
  b: Rectangle,
  trayBounds: Rectangle
): { x: number; y: number } {
  const margin = trayOptions.margin
  const screenBounds = screen.getPrimaryDisplay().size
  const bottom = trayBounds.y > screenBounds.height / 2
  const x = Math.floor(
    trayBounds.x - b.width / 2 - margin.x + trayBounds.width / 2
  )
  const y = bottom
    ? Math.floor(trayBounds.y - b.height - margin.y + trayBounds.height / 2)
    : Math.floor(trayBounds.y + margin.y + trayBounds.height / 2)
  // constraint into screen
  return {
    x: Math.max(0, Math.min(screenBounds.width - b.width, x)),
    y: Math.max(0, Math.min(screenBounds.height - b.height, y))
  }
}
