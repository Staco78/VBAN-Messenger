import { MainServerEvents, ServerEvents } from "@/typings";
import { UserData } from "@/typings/user";
import User from "./user";

namespace Server {
    let users: User[] = [];
    function getUser(infos: UserData): User {
        const user = users.find(user => user.infos.id === infos.id);
        if (user) return user;
        const newUser = new User(infos);
        users.push(newUser);
        return newUser;
    }

    export function on<U extends keyof ServerEvents>(event: U, listener: ServerEvents[U]) {
        const eventsMap: {
            [key in keyof ServerEvents]: (...args: Parameters<MainServerEvents[key]>) => Parameters<ServerEvents[key]>;
        } = {
            message: (msg, user) => [msg, getUser(user)],
            userStatusChanged: (user, status) => [getUser(user), status],
        };

        window.electronAPI.server.on(event, (...args: any) => (listener as any)(...eventsMap[event](...args)));
    }

    export async function getCurrentUser(): Promise<User> {
        return getUser(await window.electronAPI.getCurrentUser());
    }
}

export default Server;
