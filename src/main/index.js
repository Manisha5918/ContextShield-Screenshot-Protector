import { app, BrowserWindow, ipcMain, nativeImage, clipboard } from 'electron';
import * as path from 'path';
import { ClipboardMonitor } from './clipboardMonitor.js';
import * as fs from 'fs';

const historyDir = path.join(app.getPath('userData'), 'history');
const historyFilePath = path.join(historyDir, 'history.json');

function initHistory() {
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
  }
  if (!fs.existsSync(historyFilePath)) {
    fs.writeFileSync(historyFilePath, JSON.stringify([]), 'utf-8');
  }
}

let mainWindow = null;
let clipboardMonitor = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'dist/preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    },
    title: 'ContextShield Desktop',
    autoHideMenuBar: true
  });

  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in dev mode by default
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist/renderer/index.html'));
  }

  // Restrict navigation and block unauthorized new windows
  mainWindow.webContents.on('will-navigate', (event) => {
    event.preventDefault();
  });
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  // Initialize clipboard monitor instance for this window
  clipboardMonitor = new ClipboardMonitor(mainWindow);

  mainWindow.on('closed', () => {
    if (clipboardMonitor) {
      clipboardMonitor.stop();
    }
    mainWindow = null;
  });
}

// Register IPC handlers with security validation
ipcMain.handle('clipboard-guard:toggle', (_event, enabled) => {
  if (typeof enabled !== 'boolean') {
    throw new Error('IPC Security Violation: Invalid argument type for clipboard-guard:toggle');
  }
  if (!clipboardMonitor) return false;
  if (enabled) {
    return clipboardMonitor.start();
  } else {
    return clipboardMonitor.stop();
  }
});

ipcMain.handle('clipboard-guard:update-settings', (_event, enabled, intervalMs) => {
  if (typeof enabled !== 'boolean' || typeof intervalMs !== 'number') {
    throw new Error('IPC Security Violation: Invalid argument types for clipboard-guard:update-settings');
  }
  if (!clipboardMonitor) return false;
  return clipboardMonitor.updateSettings(enabled, intervalMs);
});

ipcMain.handle('clipboard:copy-image', (_event, dataUrl) => {
  if (typeof dataUrl !== 'string') {
    throw new Error('IPC Security Violation: Invalid argument type for clipboard:copy-image');
  }
  if (!dataUrl.startsWith('data:image/png;base64,')) {
    throw new Error('IPC Security Violation: Image format must be base64 PNG');
  }
  
  try {
    const image = nativeImage.createFromDataURL(dataUrl);
    if (image.isEmpty()) {
      throw new Error('Invalid or empty image data payload');
    }
    clipboard.writeImage(image);
    
    // Clipboard validation: read back and verify it succeeded
    const readBack = clipboard.readImage();
    if (readBack.isEmpty()) {
      return false;
    }
    return true;
  } catch (err) {
    console.error('[IPC Main] Failed to write image to clipboard:', err);
    return false;
  }
});

ipcMain.handle('history:save', (_event, item, fullImageBase64) => {
  if (typeof item !== 'object' || typeof fullImageBase64 !== 'string') {
    throw new Error('IPC Security Violation: Invalid history parameters');
  }
  try {
    initHistory();
    const timestamp = Date.now();
    const filename = `img_${timestamp}.png`;
    const filePath = path.join(historyDir, filename);
    
    const base64Data = fullImageBase64.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(filePath, base64Data, 'base64');
    
    const data = fs.readFileSync(historyFilePath, 'utf-8');
    const history = JSON.parse(data);
    
    const newItem = {
      ...item,
      timestamp,
      imagePath: filename
    };
    
    history.unshift(newItem);
    
    // Default max size is 20
    const maxHistory = 20;
    while (history.length > maxHistory) {
      const removed = history.pop();
      if (removed && removed.imagePath) {
        const removedPath = path.join(historyDir, removed.imagePath);
        if (fs.existsSync(removedPath)) {
          fs.unlinkSync(removedPath);
        }
      }
    }
    
    fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2), 'utf-8');
    return filename;
  } catch (err) {
    console.error('[IPC Main] Failed to save history item:', err);
    return '';
  }
});

ipcMain.handle('history:get-all', () => {
  try {
    initHistory();
    const data = fs.readFileSync(historyFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[IPC Main] Failed to get history items:', err);
    return [];
  }
});

ipcMain.handle('history:get-image', (_event, imagePath) => {
  if (typeof imagePath !== 'string') {
    throw new Error('IPC Security Violation: Invalid imagePath');
  }
  try {
    initHistory();
    const filePath = path.join(historyDir, imagePath);
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return `data:image/png;base64,${fileBuffer.toString('base64')}`;
    }
    return '';
  } catch (err) {
    console.error('[IPC Main] Failed to get history image:', err);
    return '';
  }
});

ipcMain.handle('history:delete', (_event, id) => {
  if (typeof id !== 'string') {
    throw new Error('IPC Security Violation: Invalid id');
  }
  try {
    initHistory();
    const data = fs.readFileSync(historyFilePath, 'utf-8');
    let history = JSON.parse(data);
    
    const itemToDelete = history.find((h) => h.id === id);
    if (itemToDelete && itemToDelete.imagePath) {
      const filePath = path.join(historyDir, itemToDelete.imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    history = history.filter((h) => h.id !== id);
    fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[IPC Main] Failed to delete history item:', err);
    return false;
  }
});

ipcMain.handle('history:clear', () => {
  try {
    initHistory();
    const data = fs.readFileSync(historyFilePath, 'utf-8');
    const history = JSON.parse(data);
    
    for (const item of history) {
      if (item.imagePath) {
        const filePath = path.join(historyDir, item.imagePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }
    
    fs.writeFileSync(historyFilePath, JSON.stringify([]), 'utf-8');
    return true;
  } catch (err) {
    console.error('[IPC Main] Failed to clear history:', err);
    return false;
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
