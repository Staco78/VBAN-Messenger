const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    getAllUsers: () => ipcRenderer.invoke("getAllUsers"),
    on: (event, callback) => ipcRenderer.on(event, (e, ...args) => callback(...args)),
});
