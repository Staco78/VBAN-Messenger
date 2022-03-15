import { UserData, _Server } from "@/typings";
import users from "@/users";
import { BrowserWindow, ipcMain } from "electron";

export function initIPC(window: BrowserWindow, server: _Server) {
    const handlers: any = [
        {
            name: "getAllUsers",
            handler: () => users.getAllUsers(),
        },
        {
            name: "sendMessage",
            handler: (msg: string, to: UserData) => server.sendMessage(msg, to),
        },
    ];
    const serverEvents = ["message", "userConnected"];

    for (const handle of handlers) {
        ipcMain.handle(handle.name, (e, ...args) => handle.handler(...args));
    }

    for (const event of serverEvents) {
        server.on(event as any, (...args: any[]) => window.webContents.send(`server_${event}`, ...args));
    }
}
