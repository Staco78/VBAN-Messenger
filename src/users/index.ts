import os from "os";
import { ConnectionInfos, PingData, UserData } from "@/types";

const me: UserData = {
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
    connectionInfos: {
        address: "0.0.0.0",
        port: 6980,
    },
};

const users: UserData[] = [];

function findUser(infos: ConnectionInfos): UserData | null {
    const user = users.find(u => u.connectionInfos.address === infos.address && u.connectionInfos.port === infos.port);
    return user || null;
}

// function createUser(rinfos: RemoteInfo, infos: PingData) {
//     const user = new User(rinfos, infos);
//     users.push(user);
//     server.emit("userConnected", user);
//     return user;
// }

// function getUser(infos: RemoteInfo): User {
//     const user = findUser(infos);
//     if (!user) throw new Error("User not found");
//     return user;
// }

function getAllUsers(): UserData[] {
    return users;
}

function createUserData(rinfos: ConnectionInfos, infos: PingData): UserData {
    return Object.assign(infos, { connectionInfos: rinfos });
}

export default { createUserData, getAllUsers, findUser, me };
