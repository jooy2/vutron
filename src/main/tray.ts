import { app, Menu, Tray, BaseWindow, BrowserWindow } from 'electron'
import Constants from './utils/Constants.ts'
const electron = require("electron");

// defaults
// const width = 800;
// const height = 500;
// const DEFAULT_MARGIN = {x: 0, y: 0} ;

let tray;
let trayOptions;
const DEFAULT_OPTIONS = {
  menu: false,
  tooltip: 'Vutron App',
  margin: {x:0, y:0},
  width: Constants.IS_DEV_ENV ? 1500 : 1200,
  height: 650,
}

export function createTray(window: BaseWindow, options) {
  trayOptions = options || DEFAULT_OPTIONS;
  tray = new Tray('buildAssets/icons/icon16.png');

  tray.on('double-click', function (event) {
    toggleWindow(window)
  });
  tray.on('right-click', function (event) {
    toggleWindow(window)
  });
  tray.on('click', function (event) {
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

export function setWindowAutoHide(window: BrowserWindow) {
  window.hide();
  window.on("blur", () => {
    // dont close if devtools
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
      // ipcMain.emit("tray-window-hidden", { window: window, tray: tray });
    }
  });
}

export function toggleWindow(window: BaseWindow) {
  if (window.isVisible()) {
    window.hide();
    // ipcMain.emit("tray-window-hidden", { window: window, tray: tray });
    return;
  }

  showWindow(window);
  // ipcMain.emit("tray-window-visible", { window: window, tray: tray });
}

export function showWindow(window: BaseWindow) {
  window.show()
  alignWindow(window)
}

export function alignWindow(window: BaseWindow) {
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
  const b = trayOptions

  const screenBounds = electron.screen.getPrimaryDisplay().size;
  const trayBounds = tray.getBounds();
  // where is the icon on the screen?
  let trayPos = 4; // 1:top-left 2:top-right 3:bottom-left 4.bottom-right
  trayPos = trayBounds.y > screenBounds.height / 2 ? trayPos : trayPos / 2;
  trayPos = trayBounds.x > screenBounds.width / 2 ? trayPos : trayPos - 1;
  let x = 0;
  let y = 0 ;

  // calculate the new window position
  switch (trayPos) {
    case 1: // for TOP - LEFT
      x = Math.floor(trayBounds.x + margin.x + trayBounds.width / 2);
      y = Math.floor(trayBounds.y + margin.y + trayBounds.height / 2);
      break;

    case 2: // for TOP - RIGHT
      x = Math.floor(
        trayBounds.x - b.width - margin.x + trayBounds.width / 2
      );
      y = Math.floor(trayBounds.y + margin.y + trayBounds.height / 2);
      break;

    case 3: // for BOTTOM - LEFT
      x = Math.floor(trayBounds.x + margin.x + trayBounds.width / 2);
      y = Math.floor(
        trayBounds.y - b.height - margin.y + trayBounds.height / 2
      );
      break;

    case 4: // for BOTTOM - RIGHT
      x = Math.floor(
        trayBounds.x - b.width - margin.x + trayBounds.width / 2
      );
      y = Math.floor(
        trayBounds.y - b.height - margin.y + trayBounds.height / 2
      );
      break;
  }

  return { x, y };
}
