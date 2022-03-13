import { Server } from "@/vban/server";
import { app, BrowserWindow, session } from "electron";
import { Server as ServerType } from "@/types";
import fs from "fs";
import path from "path";

async function createWindow() {
    const window = new BrowserWindow({
        titleBarStyle: "default",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
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
