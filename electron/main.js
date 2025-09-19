const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const os = require('os');

let assignWin;
let displayWin;

function createWindows() {
  const displays = screen.getAllDisplays();
  const primary = displays[0];
  const secondary = displays[1] || primary; // fallback if only 1 monitor

  // Assign window (fullscreen)
  assignWin = new BrowserWindow({
    fullscreen: false,
    show: false,
    webPreferences: { contextIsolation: true },
  });
  assignWin.loadFile(path.join(__dirname, 'src', 'index.html'));
  
  assignWin.once('ready-to-show', () => {
  assignWin.maximize(); // maximize window
  assignWin.show();     // then show it
});

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

function enableAutoStart() {
  const platforms = ['win32', 'darwin', 'linux'];
  if (platforms.includes(process.platform)) {
    app.setLoginItemSettings({
      openAtLogin: true,
      path: process.execPath, // current Electron executable
    });
  }
}

app.whenReady().then(() => {
  enableAutoStart();
  createWindows();
});

app.setPath('userData', path.join(os.homedir(), 'TruckQueueAppData'));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
