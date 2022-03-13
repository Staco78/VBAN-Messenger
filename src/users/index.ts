import { PacketInfos } from "../vban/packets/packet";
import User from "./user";

let users: User[] = [];

function findUser(infos: PacketInfos): User | null {
    const user = users.find(u => u.host === infos.host && u.port === infos.port);
    return user || null;
}

function createUser(infos: PacketInfos) {
    const user = new User(infos.host, infos.port);
    users.push(user);
    return user;
}

function getUser(infos: PacketInfos, create: boolean = false): User {
    const user = findUser(infos);
    if (!user) {
        if (create) return createUser(infos);
        throw new Error("User not found");
    }
    return user;
}

export default { findUser, getUser, createUser };
