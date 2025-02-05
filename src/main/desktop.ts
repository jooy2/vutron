import { screen } from 'electron'

// To detect proper desktop/workspace, find the display where the mouse cursor is
export function getDisplayNearestPoint(){
  return screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
}

export function moveToCurrentDesktop(mainWindow){
  const currentDisplay = getDisplayNearestPoint();
// Center window relatively to that display
  const centerX = Math.round((currentDisplay.workArea.width - mainWindow.getBounds().width) / 2);
  const centerY = Math.round((currentDisplay.workArea.height - mainWindow.getBounds().height) / 2);
  mainWindow.setPosition(currentDisplay.workArea.x + centerX, currentDisplay.workArea.y + centerY);
}



