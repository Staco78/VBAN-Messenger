import User from "@/renderer/data/user";
import { DbChannel } from "./channels";
import { UserData, UserStatus } from "./user";

export interface MainServerEvents {
    userStatusChanged: (user: UserData, status: UserStatus) => void;
    message: (msg: string, sender: UserData) => void;
}

export interface ServerEvents {
    userStatusChanged: (user: User, status: UserStatus) => void;
    message: (msg: string, sender: User) => void;
}

export interface IElectronAPI {
    sendMessage(msg: string, to: UserData);
    getCurrentUser(): Promise<UserData>;
    getDMChannel(id: bigint): Promise<DbChannel>;
    getAllUsers(): Promise<UserData[]>;
    server: {
        on<U extends keyof MainServerEvents>(event: U, listener: MainServerEvents[U]): this;
    };
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
