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
    window.loadFile("dist/index.html");
}

app.on("ready", () => {
    createWindow();
});

app.on("window-all-closed", () => {
    app.quit();
});
