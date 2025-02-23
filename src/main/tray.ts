import { app, screen, Menu, Tray, BrowserWindow } from 'electron'
import Constants from './utils/Constants.ts'
let tray;
let trayOptions;

export function createTray(window: BrowserWindow, options) {
  trayOptions = options || Constants.DEFAULT_TRAY_OPTIONS;

  tray = new Tray('buildAssets/icons/icon16.png');

  tray.on('double-click', function (event) {
    console.log('double-click')
    toggleWindow(window)
  });
  tray.on('right-click', function (event) {
    console.log('right-click')
    toggleWindow(window)
  });
  tray.on('click', function (event) {
    console.log('click')
    toggleWindow(window)
  });
  tray.setToolTip(trayOptions.tooltip);
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
          window.hide()
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
    tray.setContextMenu(contextMenu)
  } else {
    // no menu for tray window
    window.setMenu(null)
    tray.setContextMenu(null)
  }
  // align at startup
  alignWindow(window)
  return tray
}

export function hideWindow(window: BrowserWindow) {
  console.log('hide window');
  window.hide();
  window.on("blur", () => {
    // dont close if devtools
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });
}

export function toggleWindow(window: BrowserWindow) {
  if (window.isVisible()) {
    hideWindow(window);
  }else{
    showWindow(window);
  }
}

export function showWindow(window: BrowserWindow) {
  console.log('show window');
  window.show()

  alignWindow(window)
}

export function alignWindow(window: BrowserWindow) {
  if (!trayOptions.trayWindow) return;

  const position = calculateWindowPosition();
  const b = window.getBounds()
  window.setBounds({
    width: b.width,
    height: b.height,
    x: position.x,
    y: position.y
  });
}

function calculateWindowPosition() {
  const margin = trayOptions.margin;
  const b = trayOptions;

  const screenBounds = screen.getPrimaryDisplay().size;
  const trayBounds = tray.getBounds();
  const bottom = trayBounds.y > screenBounds.height / 2 ;
  const  x = Math.floor(trayBounds.x - b.width/2 - margin.x + trayBounds.width / 2);
  const y = bottom ?
    Math.floor(trayBounds.y - b.height - margin.y + trayBounds.height / 2)
    :
    Math.floor(trayBounds.y + margin.y + trayBounds.height / 2)
  ;

  // constraint into screen
  return {
    x: Math.max(0, Math.min(screenBounds.width - b.width, x)),
    y: Math.max(0, Math.min(screenBounds.height - b.height, y))
  };
}
