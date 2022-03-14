import { _Server } from "@/types";
import { BrowserWindow, ipcMain } from "electron";

export function initIPC(window: BrowserWindow, server: _Server) {
    const handlers: any = [];
    const serverEvents = ["message", "userConnected"];

    for (const handle of handlers) {
        ipcMain.handle(handle.name, handle.handler);
    }

    for (const event of serverEvents) {
        server.on(event as any, (...args: any[]) => window.webContents.send(`server_${event}`, ...args));
    }
}
