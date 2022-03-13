import { app, BrowserWindow } from "electron";

function createWindow() {
    const window = new BrowserWindow({
        titleBarStyle: "default",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        height: 1080,
        width: 1920,
    });

    window.webContents.openDevTools();
    window.loadURL("https://google.com");
}

app.on("ready", () => {
    // createWindow();
});

app.on("window-all-closed", () => {
    app.quit();
});
