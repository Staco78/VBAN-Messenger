import { ConnectionInfos, UserData } from "@/types";
import { EventEmitter } from "events";
import { PingData } from "@/vban/packets/servicePacket";

export default class User extends EventEmitter {
    infos: UserData;

    constructor(connectionInfos: ConnectionInfos, infos: PingData) {
        super();
        this.infos = Object.assign(infos, { connectionInfos });
    }
}
