import channels from "@/data/channels";
import users from "@/data/users";
import Server from "@/vban/server";
import { BrowserWindow, ipcMain } from "electron";

export function initIPC(window: BrowserWindow) {
    const handlers: any = [
        {
            name: "getAllUsers",
            handler: () => users.getAllUsers(),
        },
        {
            name: "getCurrentUser",
            handler: () => users.me,
        },
        {
            name: "getUser",
            handler: (id: bigint) => users.getUserByID(id),
        },
        {
            name: "getDMChannel",
            handler: (id: bigint) => channels.getDM(id),
        },
        {
            name: "getMessages",
            handler: (channelId: bigint, page: number, messagesByPage: number) =>
                channels.getMessages(channelId, page, messagesByPage),
        },
    ];
    const serverEvents = ["message", "userStatusChanged"];

    for (const handle of handlers) {
        ipcMain.handle(handle.name, (e, ...args) => handle.handler(...args));
    }

    for (const event of serverEvents) {
        Server.on(event as any, (...args: any[]) => window.webContents.send(`server_${event}`, ...args));
    }
}
