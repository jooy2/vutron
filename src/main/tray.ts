import { app, screen, Menu, Tray, BaseWindow, BrowserWindow } from 'electron'
import Constants from './utils/Constants.ts'
import { getDisplayNearestPoint } from './desktop.ts'

let tray;
let trayOptions;
const DEFAULT_OPTIONS = {
  menu: false,
  tooltip: 'Vutron App',
  margin: {x:0, y:0},
  width: Constants.IS_DEV_ENV ? 1500 : 1200,
  height: 650,
}

export function createTray(window: BaseWindow, trayWindow: boolean, options) {
  trayOptions = options || DEFAULT_OPTIONS;
  trayOptions.trayWindow=trayWindow;
  tray = new Tray('buildAssets/icons/icon16.png');

  // tray.on('double-click', function (event) {
  //   toggleWindow(window)
  // });
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
  // To detect proper desktop/workspace, find the display where the mouse cursor is
  const currentDisplay = getDisplayNearestPoint();
  console.log("currentDisplay.workArea=", currentDisplay.workArea);

  const margin = {
    x: trayOptions.margin.x, // + currentDisplay.workArea.width,
    y: trayOptions.margin.y // + currentDisplay.workArea.height
  };
  const b = trayOptions

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
