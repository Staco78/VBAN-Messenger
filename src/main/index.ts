import { server } from "@/vban/server";
import { app, BrowserWindow, session } from "electron";
import fs from "fs";
import path from "path";
import { initIPC } from "./ipc";

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
    if (!process.argv.includes("--headless")) createWindow();
});

app.on("window-all-closed", () => {
    app.quit();
});
