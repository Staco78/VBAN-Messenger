const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    getAllUsers: () => ipcRenderer.invoke("getAllUsers"),
    server: {
        on: (event, callback) => ipcRenderer.on(`server_${event}`, (e, ...args) => callback(...args)),
    },
});
