const { contextBridge, ipcRenderer } = require('electron');

// 暴露 API 给 renderer.js
contextBridge.exposeInMainWorld('electronAPI', {
  sendLogin: (data) => ipcRenderer.send('login', data)
});