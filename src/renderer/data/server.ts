import { MainServerEvents, ServerEvents } from "@/typings";
import { UserData, UserStatus } from "@/typings/user";
import Message from "./message";
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

    export async function getUserById(id: bigint): Promise<User> {
        const user = users.find(u => u.id === id);
        if (user) return user;
        const userData = await window.electronAPI.getUser(id);
        if (!userData) throw new Error("user not found");
        const newUser = new User(userData);
        users.push(newUser);
        return newUser;
    }

    function addUserIfNotExists(infos: UserData): void {
        const user = users.find(user => user.infos.id === infos.id);
        if (user) return;
        const newUser = new User(infos);
        users.push(newUser);
        return;
    }

    export function on<U extends keyof ServerEvents>(event: U, listener: ServerEvents[U]) {
        const eventsMap: {
            [key in keyof ServerEvents]: (...args: Parameters<MainServerEvents[key]>) => Parameters<ServerEvents[key]>;
        } = {
            message: (msg, user) => {
                addUserIfNotExists(user);
                return [new Message(msg)];
            },
            userStatusChanged: (user, status) => {
                return [getUser(user), status];
            },
        };

        window.electronAPI.server.on(event, (...args: any) => (listener as any)(...eventsMap[event](...args)));
    }

    export async function getCurrentUser(): Promise<User> {
        return getUser(await window.electronAPI.getCurrentUser());
    }

    export async function getAllUsers(): Promise<User[]> {
        const u = await window.electronAPI.getAllUsers();
        return u.map(user => getUser(user));
    }
}

export default Server;
