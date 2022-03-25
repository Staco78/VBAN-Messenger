import { ConnectionInfos, PingData } from "@/typings/packet";
import { DbUser, UserData, UserStatus } from "@/typings/user";
import Server from "@/vban/server";
import ServicePacket from "@/vban/servicePacket";
import { hostname } from "os";
import db from "./db";

namespace users {
    let users: UserData[] = [];
    let initialized = false;

    export const me: UserData = {
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
        deviceName: hostname(),
        manufacturerName: "",
        applicationName: "VBAN-Messenger",
        userName: "Staco",
        userComment: "",
        connectionInfos: {
            address: "0.0.0.0",
            port: 6980,
        },
        isVBAN_M_User: true,
        status: UserStatus.Online,
        id: 0n, // TODO: get id from db
    };

    export async function init() {
        db.init();

        const u = db.getAllUsers();
        await Promise.all(
            u.map(
                user =>
                    new Promise<void>(async resolve => {
                        const userData = await ServicePacket.ping(user);
                        if (userData) {
                            users.push(userData);
                            Server.emit("userStatusChanged", userData, UserStatus.Online);
                        } else {
                            users.push(createDefaultUserFromDbUser(user));
                        }
                        resolve();
                    })
            )
        );
        initialized = true;
    }

    function createDefaultUserFromDbUser(user: DbUser): UserData {
        return {
            bitType: 0,
            bitFeature: 0,
            bitFeatureExt: 0,
            preferedRate: 0,
            minRate: 0,
            maxRate: 0,
            version: 0,
            GPSPosition: "",
            userPosition: "",
            langCode: "",
            deviceName: "",
            manufacturerName: "",
            applicationName: "",
            userName: user.name,
            userComment: "",
            connectionInfos: {
                address: user.address,
                port: user.port,
            },
            isVBAN_M_User: false,
            id: user.id,
            status: UserStatus.Offline,
        };
    }

    export function getUserId(streamName: string, connectionInfos: ConnectionInfos): bigint {
        try {
            return BigInt(streamName);
        } catch (e) {
            return BigInt(
                connectionInfos.address
                    .split(".")
                    .map(v => v.padStart(3, "0"))
                    .join("") + connectionInfos.port.toString().padStart(5, "0")
            );
        }
    }

    export function createUser(connectionInfos: ConnectionInfos, streamName: string, userData: PingData): UserData {
        return {
            ...userData,
            connectionInfos,
            isVBAN_M_User: userData.applicationName === "VBAN-Messenger",
            id: getUserId(streamName, connectionInfos),
            status: UserStatus.Online,
        };
    }

    export function add(connectionInfos: ConnectionInfos, streamName: string, userData: PingData): void {
        const user = createUser(connectionInfos, streamName, userData);
        if (user.isVBAN_M_User) db.addIfNotExist(db.userDbFromUserData(user));
        users.push(user);
        Server.emit("userStatusChanged", user, UserStatus.Online);
    }

    export async function getUser(connectionInfos: ConnectionInfos, streamName: string): Promise<UserData> {
        const userId = getUserId(streamName, connectionInfos);
        const user = users.find(u => u.id === userId);
        if (user) return user;

        const userData = await ServicePacket.ping(connectionInfos);
        if (!userData) throw new Error("user not found");

        add(connectionInfos, streamName, userData);
        return userData;
    }

    export function getAllUsers(): UserData[] {
        if (!initialized) return db.getAllUsers().map(createDefaultUserFromDbUser);
        return users;
    }
}

export default users;
