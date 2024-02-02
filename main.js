const { app, BrowserWindow, ipcMain} = require('electron')
const path = require('path');
const fs = require('fs');

const getTimestamp = function() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth()).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")} ${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}:${String(date.getSeconds()).padStart(2,"0")}`;
}

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: 'ico.png'
  })
  win.maximize();
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow()
});

ipcMain.handle('log', async (event, msg, level) => {
  fs.writeFile("./main.log", `${getTimestamp()} [${level}]: ${msg}\n`, {flag: "a"}, err => {
    if (err)  console.error(err);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
	  app.quit();
  }
});

ipcMain.handle('quitApp', async () => {
  app.quit();
});

