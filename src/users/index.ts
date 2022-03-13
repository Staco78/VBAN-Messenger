import { PingData } from "@/vban/packets/servicePacket";
import { RemoteInfo } from "dgram";
import User from "./user";

let users: User[] = [];

function findUser(infos: RemoteInfo): User | null {
    const user = users.find(u => u.infos.remoteInfos.address === infos.address && u.infos.remoteInfos.port === infos.port);
    return user || null;
}

function createUser(rinfos: RemoteInfo, infos: PingData) {
    const user = new User(rinfos, infos);
    users.push(user);
    return user;
}

function getUser(infos: RemoteInfo): User {
    const user = findUser(infos);
    if (!user) throw new Error("User not found");
    return user;
}

export default { findUser, getUser, createUser };
