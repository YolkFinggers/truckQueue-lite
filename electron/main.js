const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

let assignWin;
let displayWin;

function createWindows() {
  const displays = screen.getAllDisplays();
  const primary = displays[0];
  const secondary = displays[1] || primary; // fallback if only 1 monitor

  // Assign window (fullscreen)
  assignWin = new BrowserWindow({
    simpleFullscreen: false,
    webPreferences: { contextIsolation: true },
  });
  assignWin.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Display window (kiosk on second monitor)
  displayWin = new BrowserWindow({
    x: secondary.bounds.x,
    y: secondary.bounds.y,
    width: secondary.bounds.width,
    height: secondary.bounds.height,
    kiosk: true,
    webPreferences: { contextIsolation: true },
  });
  displayWin.loadFile(path.join(__dirname, 'src', 'display.html'));
}

app.whenReady().then(createWindows);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
