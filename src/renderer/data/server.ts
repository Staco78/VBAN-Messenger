import { ServerEvents, _ServerEvents } from "@/types";
import User from "./user";

namespace Server {
    export function on<U extends keyof ServerEvents>(event: U, listener: ServerEvents[U]) {
        const eventsMap: { [key in keyof ServerEvents]: (...args: Parameters<_ServerEvents[key]>) => Parameters<ServerEvents[key]> } = {
            message: (msg, user) => [msg, new User(user)],
            userConnected: user => [new User(user)],
        };

        window.electronAPI.server.on(event, (...args: any) => (listener as any)(...eventsMap[event](...args)));
    }
}

export default Server;
