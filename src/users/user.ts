import { UserData } from "@/types";
import { EventEmitter } from "events";
import dgram from "dgram";
import { PingData } from "@/vban/packets/servicePacket";

export default class User extends EventEmitter {
    infos: UserData;

    constructor(remoteInfos: dgram.RemoteInfo, infos: PingData) {
        super();
        this.infos = Object.assign(infos, { remoteInfos });
    }
}
