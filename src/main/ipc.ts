import { Server, ServerEvents } from "@/types";
import users from "@/users";
import { BrowserWindow, ipcMain } from "electron";

const handlers = [{ name: "getAllUsers", handler: () => users.getAllUsers }];
const serverEvents = ["message", "userConnected"];

export function initIPC(window: BrowserWindow, server: Server) {
    for (const handle of handlers) {
        ipcMain.handle(handle.name, handle.handler);
    }

    server.on("message", (msg, sender) => {
        console.log(`${sender.infos.userName} send ${msg}`);

        window.webContents.send("message", msg, sender);
    });

    for (const event of serverEvents) {
        server.on(event as any, (...args: any[]) => window.webContents.send(event, ...args));
    }
}
