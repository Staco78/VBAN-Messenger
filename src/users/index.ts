import os from "os";
import { ConnectionInfos, PingData, UserData } from "@/typings";

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
    isVBAN_M_User: true,
};

const users: UserData[] = [];

function findUser(infos: ConnectionInfos): UserData | null {
    const user = users.find(u => u.connectionInfos.address === infos.address && u.connectionInfos.port === infos.port);
    return user || null;
}

function getAllUsers(): UserData[] {
    return users;
}

function createUserData(rinfos: ConnectionInfos, infos: PingData): UserData {
    console.log("user created");

    return Object.assign(infos, { connectionInfos: rinfos, isVBAN_M_User: infos.applicationName === "VBAN-Messenger" });
}

export default { createUserData, getAllUsers, findUser, me };
