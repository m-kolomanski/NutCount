import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development';
import DatabaseManager from './src/logic/DatabaseManager.js';

// setup logger //
import log from 'electron-log/main.js';
log.initialize();

const log_format = '[{y}-{m}-{d} {h}:{i}:{s}][{level}]{scope}{text}'
log.transports.console.format = log_format;
log.transports.file.format = log_format;

log.transports.console.level = "silly";
log.transports.file.level = "info";

log.transports.console.useStyles = true;
log.scope.labelPadding = false

const logger = log.scope("main");
logger.info("Main process starting")

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
    logger.error('Database operation error:', error);
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
