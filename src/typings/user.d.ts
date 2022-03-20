import { ConnectionInfos, PingData } from "./packet";

export interface UserData extends PingData {
    id: bigint;
    connectionInfos: ConnectionInfos;
    isVBAN_M_User: boolean;
    status: UserStatus;
}

export interface DbUser {
    id: bigint;
    name: string;
    address: string;
    port: number;
}

export const enum UserStatus {
    Offline,
    Online,
    DoNotDisturb,
    Idle,
}

export interface UserEvents {
    statusChanged: (oldStatus: UserStatus, newStatus: UserStatus) => void;
}
