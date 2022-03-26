import Message from "@/renderer/data/message";
import User from "@/renderer/data/user";
import { DbChannel } from "./channels";
import { DbMessage } from "./messages";
import { UserData, UserStatus } from "./user";

export interface MainServerEvents {
    userStatusChanged: (user: UserData, status: UserStatus) => void;
    message: (msg: DbMessage, sender: UserData) => void;
}

export interface ServerEvents {
    userStatusChanged: (user: User, status: UserStatus) => void;
    message: (msg: Message) => void;
}

export interface IElectronAPI {
    // sendMessage(msg: string, to: UserData): Promise<void>;
    getCurrentUser(): Promise<UserData>;
    getDMChannel(id: bigint): Promise<DbChannel>;
    getAllUsers(): Promise<UserData[]>;
    getUser(id: bigint): Promise<UserData | null>;
    getMessages(channelId: bigint, page: number, messagesByPage: number): Promise<DbMessage[]>;
    server: {
        on<U extends keyof MainServerEvents>(event: U, listener: MainServerEvents[U]): Promise<this>;
    };
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
