const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    getAllUsers: () => ipcRenderer.invoke("getAllUsers"),
    getCurrentUser: () => ipcRenderer.invoke("getCurrentUser"),
    getDMChannel: id => ipcRenderer.invoke("getDMChannel", id),
    server: {
        on: (event, callback) => ipcRenderer.on(`server_${event}`, (e, ...args) => callback(...args)),
    },
});
