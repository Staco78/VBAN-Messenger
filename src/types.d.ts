export interface UserData {
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

    connectionInfos: ConnectionInfos;
}

export interface ConnectionInfos {
    address: string;
    port: number;
}

declare abstract class Packet {
    constructor(public server: Server, public rinfo: RemoteInfo, public header: PacketHeader, public data: Buffer);
    abstract parse(data: Buffer): void;
}

interface UserEvents {
    connected: () => void;
    message: (packet: any) => void;
}

declare interface User {
    on<U extends keyof UserEvents>(event: U, listener: UserEvents[U]): this;
    emit<U extends keyof UserEvents>(event: U, ...args: Parameters<UserEvents[U]>): boolean;
    infos: UserData;
}

interface ServerEvents {
    userConnected: () => void;
    message: (packet: Packet, sender: User, isUTF8: boolean) => void;
}

declare interface Server {
    on<U extends keyof ServerEvents>(event: U, listener: ServerEvents[U]): this;
    emit<U extends keyof ServerEvents>(event: U, ...args: Parameters<ServerEvents[U]>): boolean;
}

export interface IElectronAPI {
    getUsers(): Promise<User[]>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
