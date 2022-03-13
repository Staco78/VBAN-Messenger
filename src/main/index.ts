import { Server } from "@/vban/server";
import { app, BrowserWindow } from "electron";
import { Server as ServerType } from "@/types";

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


const server: ServerType = new Server();
server.on("message", (msg, sender, isUTF8) => {
    console.log(`${sender.infos.userName} send ${msg.data.toString(isUTF8 ? "utf8" : "ascii")}`);
});
