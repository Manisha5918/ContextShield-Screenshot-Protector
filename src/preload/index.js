import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  toggleGuard: (enabled) => {
    return ipcRenderer.invoke('clipboard-guard:toggle', enabled);
  },
  onNewImage: (callback) => {
    const subscription = (_event, dataUrl) => {
      callback(dataUrl);
    };
    ipcRenderer.on('clipboard:new-image', subscription);
    return () => {
      ipcRenderer.off('clipboard:new-image', subscription);
    };
  },
  copyImageToClipboard: (dataUrl) => {
    return ipcRenderer.invoke('clipboard:copy-image', dataUrl);
  },
  updateMonitorSettings: (enabled, intervalMs) => {
    return ipcRenderer.invoke('clipboard-guard:update-settings', enabled, intervalMs);
  },
  saveHistoryItem: (item, fullImageBase64) => {
    return ipcRenderer.invoke('history:save', item, fullImageBase64);
  },
  getHistoryItems: () => {
    return ipcRenderer.invoke('history:get-all');
  },
  getHistoryImage: (imagePath) => {
    return ipcRenderer.invoke('history:get-image', imagePath);
  },
  deleteHistoryItem: (id) => {
    return ipcRenderer.invoke('history:delete', id);
  },
  clearHistory: () => {
    return ipcRenderer.invoke('history:clear');
  }
});
