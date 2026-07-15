import { clipboard } from 'electron';

export class ClipboardMonitor {
  intervalId = null;
  lastImageBuffer = null;
  isMonitoring = false;
  mainWindow = null;
  checkIntervalMs = 500;

  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  start() {
    if (this.isMonitoring) return true;

    this.isMonitoring = true;
    console.log('Clipboard Guard activated. Starting polling loop.');

    // Capture what's currently on the clipboard so we don't trigger
    // on stale/old data copied before the guard was activated.
    this.lastImageBuffer = this.getCurrentImageBuffer();

    this.intervalId = setInterval(() => {
      this.checkClipboard();
    }, this.checkIntervalMs);

    return true;
  }

  stop() {
    if (!this.isMonitoring) return false;

    this.isMonitoring = false;
    console.log('Clipboard Guard deactivated. Stopping polling loop.');

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.lastImageBuffer = null;
    return false;
  }

  updateSettings(enabled, intervalMs) {
    this.checkIntervalMs = intervalMs;
    if (this.isMonitoring) {
      // Re-initialize timer with new interval
      clearInterval(this.intervalId);
      this.intervalId = setInterval(() => {
        this.checkClipboard();
      }, this.checkIntervalMs);
    } else if (enabled) {
      this.start();
    }
    return this.isMonitoring;
  }

  getStatus() {
    return this.isMonitoring;
  }

  getCurrentImageBuffer() {
    try {
      const formats = clipboard.availableFormats();
      const hasImage = formats.some(f => f.toLowerCase().startsWith('image/'));
      
      if (!hasImage) {
        return null;
      }

      const img = clipboard.readImage();
      if (img.isEmpty()) {
        return null;
      }

      return img.toPNG();
    } catch (err) {
      console.error('Error reading clipboard image:', err);
      return null;
    }
  }

  checkClipboard() {
    try {
      const formats = clipboard.availableFormats();
      const hasImage = formats.some(f => f.toLowerCase().startsWith('image/'));
      
      if (!hasImage) {
        // Keep showing the last captured screenshot in the UI; do not clear.
        return;
      }

      const img = clipboard.readImage();
      if (img.isEmpty()) {
        return;
      }

      const currentBuffer = img.toPNG();
      if (!currentBuffer || currentBuffer.length === 0) {
        return;
      }

      // Check for duplicate images
      if (this.lastImageBuffer && currentBuffer.equals(this.lastImageBuffer)) {
        return;
      }

      console.log('New clipboard image detected.');
      this.lastImageBuffer = currentBuffer;

      // Broadcast as Data URL to the renderer
      const dataUrl = img.toDataURL();
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send('clipboard:new-image', dataUrl);
      }
    } catch (err) {
      console.error('Error in clipboard polling execution:', err);
    }
  }
}
