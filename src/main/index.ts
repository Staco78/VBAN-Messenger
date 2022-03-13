import { Server, ServerInfos } from "@/vban/server";
import { app, BrowserWindow } from "electron";
import { Server as ServerType } from "@/types";
import os from "os";

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

const infos: ServerInfos = {
    bitType: 0,
    bitFeature: 0,
    bitFeatureExt: 0,
    preferedRate: 0,
    minRate: 0,
    maxRate: 0,
    version: 0,
    GPSPosition: "",
    UserPosition: "",
    langCode: "fr-fr",
    deviceName: os.hostname(),
    manufacturerName: "",
    applicationName: "VBAN-Messenger",
    userName: "Staco",
    userComment: "",
};

const server: ServerType = new Server({ port: 6980 }, infos);
server.on("message", (msg, sender, isUTF8) => {
    console.log(`${sender.infos.userName} send ${msg.data.toString(isUTF8 ? "utf8" : "ascii")}`);
});
