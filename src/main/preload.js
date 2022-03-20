const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    getAllUsers: () => ipcRenderer.invoke("getAllUsers"),
    // sendMessage: (...args) => ipcRenderer.invoke("sendMessage", ...args),
    getCurrentUser: () => ipcRenderer.invoke("getCurrentUser"),
    server: {
        on: (event, callback) => ipcRenderer.on(`server_${event}`, (e, ...args) => callback(...args)),
    },
});
