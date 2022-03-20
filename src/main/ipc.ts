import users from "@/users";
import Server from "@/vban/server";
import { BrowserWindow, ipcMain } from "electron";

export function initIPC(window: BrowserWindow) {
    const handlers: any = [
        {
            name: "getAllUsers",
            handler: () => users.getAllUsers(),
        },
        // {
        //     name: "sendMessage",
        //     handler: (msg: string, to: UserData) => server.sendMessage(msg, to),
        // },
        {
            name: "getCurrentUser",
            handler: () => users.me,
        }
    ];
    const serverEvents = ["message", "userStatusChanged"];

    for (const handle of handlers) {
        ipcMain.handle(handle.name, (e, ...args) => handle.handler(...args));
    }

    for (const event of serverEvents) {
        Server.on(event as any, (...args: any[]) => window.webContents.send(`server_${event}`, ...args));
    }
}
