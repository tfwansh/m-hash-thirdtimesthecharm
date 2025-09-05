// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  saveUsageEvent: (obj) => ipcRenderer.invoke('save-usage-event', obj),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  // subscribe to native events if needed:
  on: (channel, cb) => {
    // allowlist channels
    const valid = ['update-available', 'download-progress'];
    if (valid.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => cb(...args));
    }
  }
});

