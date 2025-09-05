// electron/main.js
const { app, BrowserWindow, ipcMain, shell, Tray, Menu } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs-extra');

const isDev = process.env.ELECTRON_DEV === 'true' || process.env.NODE_ENV === 'development';

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,    // REQUIRED for security
      nodeIntegration: false,    // REQUIRED for security
      sandbox: false
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173'); // adjust if your frontend dev server uses another port
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'frontend-mock', 'build', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // optional tray icon
  tray = new Tray(path.join(__dirname, 'assets', 'tray.png')); // add a tray icon file
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => { mainWindow.show(); } },
    { label: 'Quit', click: () => { app.quit(); } }
  ]);
  tray.setToolTip('M-hash app');
  tray.setContextMenu(contextMenu);

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Clean exit
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

/* -------- IPC handlers (example system APIs + analytics) -------- */

// simple system info
ipcMain.handle('get-system-info', async () => {
  return {
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalmem: os.totalmem(),
    freemem: os.freemem()
  };
});

// save usage event (append to a local JSON logfile)
ipcMain.handle('save-usage-event', async (_, eventObj) => {
  try {
    const dir = path.join(app.getPath('userData'), 'usage');
    await fs.ensureDir(dir);
    const file = path.join(dir, 'events.log');
    const line = JSON.stringify({ ts: new Date().toISOString(), ...eventObj }) + '\n';
    await fs.appendFile(file, line, 'utf8');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

// open external link
ipcMain.handle('open-external', async (_, url) => {
  await shell.openExternal(url);
  return { ok: true };
});

