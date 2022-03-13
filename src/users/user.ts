import { EventEmitter } from "events";
import { PingData } from "../vban/packets/packet";

interface UserEvents {
    connected: () => void;
    message: (packet: any) => void;
}

declare interface User {
    on<U extends keyof UserEvents>(event: U, listener: UserEvents[U]): this;
    emit<U extends keyof UserEvents>(event: U, ...args: Parameters<UserEvents[U]>): boolean;
}

class User extends EventEmitter {
    readonly host: string;
    readonly port: number;

    infos: PingData | null = null;

    constructor(host: string, port: number) {
        super();
        this.host = host;
        this.port = port;
    }
}

export default User;
