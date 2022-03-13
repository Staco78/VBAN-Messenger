import { Server } from "@/vban/server";
import { app, BrowserWindow, ipcMain, session } from "electron";
import { Server as ServerType } from "@/types";
import fs from "fs";
import path from "path";
import { initIPC } from "./ipc";

const server: ServerType = new Server();

async function createWindow() {
    const window = new BrowserWindow({
        titleBarStyle: "default",
        webPreferences: {
            preload: path.join(process.cwd(), "src/main/preload.js"),
        },
        height: 1080,
        width: 1920,
    });

    const reactDevtoolsPath = path.join(process.cwd(), "./react-devtools");
    if (process.env.NODE_ENV === "development") {
        if (fs.existsSync(reactDevtoolsPath)) await session.defaultSession.loadExtension(reactDevtoolsPath, { allowFileAccess: true });
        window.webContents.openDevTools();
    }
    window.loadFile("dist/index.html");
    initIPC(window, server);
}

app.on("ready", () => {
    createWindow();
});

app.on("window-all-closed", () => {
    app.quit();
});
