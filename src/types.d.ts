declare module "*.module.css";
export interface PingData {
    bitType: number;
    bitFeature: number;
    bitFeatureExt: number;
    preferedRate: number;
    minRate: number;
    maxRate: number;
    version: number;

    GPSPosition: string;
    userPosition: string;
    langCode: string;

    deviceName: string;
    manufacturerName: string;
    applicationName: string;
    userName: string;
    userComment: string;
}

export interface ConnectionInfos {
    address: string;
    port: number;
}

export interface UserData extends PingData {
    connectionInfos: ConnectionInfos;
}

declare abstract class Packet {
    constructor(public server: Server, public rinfo: RemoteInfo, public header: PacketHeader, public data: Buffer);
    abstract parse(data: Buffer): void;
}

export interface User {
    infos: UserData;
    name: string;
}

interface _ServerEvents {
    userConnected: (user: UserData) => void;
    message: (msg: string, sender: UserData) => void;
}

interface ServerEvents {
    userConnected: (user: User) => void;
    message: (msg: string, sender: User) => void;
}

declare interface Server {
    on<U extends keyof ServerEvents>(event: U, listener: ServerEvents[U]): this;
    emit<U extends keyof ServerEvents>(event: U, ...args: Parameters<ServerEvents[U]>): boolean;
}

declare interface _Server {
    on<U extends keyof _ServerEvents>(event: U, listener: _ServerEvents[U]): this;
    emit<U extends keyof _ServerEvents>(event: U, ...args: Parameters<_ServerEvents[U]>): boolean;

    sendPong(pingPacket: ServicePacket): void;
    getUser(rinfo: dgram.RemoteInfo): Promise<UserData>;
}

export interface IElectronAPI {
    getAllUsers(): Promise<User[]>;
    server: {
        on<U extends keyof ServerEvents>(event: U, listener: ServerEvents[U]): this;
    };
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
