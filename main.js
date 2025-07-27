import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development';
import DatabaseManager from './src/logic/DatabaseManager.js';

let mainWindow;
const dbManager = new DatabaseManager(path.join(__dirname, 'src', 'userdata', 'nuts.db'));

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'src/assets/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist-react/index.html'));
  }
};

ipcMain.handle('db:operation', async (event, method, ...args) => {
  try {
    if (typeof dbManager[method] === 'function') {
      return await dbManager[method](...args);
    } else {
      throw new Error(`Method ${method} not found on DatabaseManager`);
    }
  } catch (error) {
    console.error('Database operation error:', error);
    throw error;
  }
});

app.whenReady().then(() => {
  createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
