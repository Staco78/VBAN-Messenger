import { MainServerEvents, ServerEvents } from "@/typings";
import User from "./user";

namespace Server {
    export function on<U extends keyof ServerEvents>(event: U, listener: ServerEvents[U]) {
        const eventsMap: { [key in keyof ServerEvents]: (...args: Parameters<MainServerEvents[key]>) => Parameters<ServerEvents[key]> } = {
            message: (msg, user) => [msg, new User(user)],
            userStatusChanged: (user, status) => [new User(user), status],
        };

        window.electronAPI.server.on(event, (...args: any) => (listener as any)(...eventsMap[event](...args)));
    }

    export function sendMessage(msg: string, to: User) {
        window.electronAPI.sendMessage(msg, to.infos);
    }

    export async function getCurrentUser(): Promise<User> {
        return new User(await window.electronAPI.getCurrentUser());
    }
}

export default Server;
