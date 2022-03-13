import { PingData } from "@/vban/packets/servicePacket";
import { RemoteInfo } from "dgram";
import User from "./user";
import os from "os";

let users: User[] = [];
const me: User = new User(
    {
        address: "0.0.0.0",
        port: 6980,
    },
    {
        bitType: 0,
        bitFeature: 0,
        bitFeatureExt: 0,
        preferedRate: 0,
        minRate: 0,
        maxRate: 0,
        version: 0,
        GPSPosition: "",
        userPosition: "",
        langCode: "fr-fr",
        deviceName: os.hostname(),
        manufacturerName: "",
        applicationName: "VBAN-Messenger",
        userName: "Staco",
        userComment: "",
    }
);

function findUser(infos: RemoteInfo): User | null {
    const user = users.find(u => u.infos.connectionInfos.address === infos.address && u.infos.connectionInfos.port === infos.port);
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

function getAllUsers(): User[] {
    return users;
}

export default { findUser, getUser, createUser, getAllUsers, me };
