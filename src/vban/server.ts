import { ConnectionInfos, PacketHeader, SubProtocol } from "@/typings/packet";
import users from "@/data/users";
import dgram from "dgram";
import EventEmitter from "events";
import ServicePacket from "./servicePacket";
import { MainServerEvents } from "@/typings";

namespace Server {
    let UDPServer: dgram.Socket;
    const eventEmitter = new EventEmitter();

    // export function on(event: "message", handler: (msg: PartialDbMessage, sender: UserData) => void): void;
    // export function on(event: "userStatusChanged", handler: (user: UserData, status: UserStatus) => void): void;

    export function on<U extends keyof MainServerEvents>(event: U, listener: MainServerEvents[U]): void;

    export function on(event: string, handler: (...args: any[]) => void) {
        eventEmitter.on(event, handler);
    }

    export function emit<U extends keyof MainServerEvents>(event: U, ...args: Parameters<MainServerEvents[U]>): void;

    export function emit(event: string, ...args: any[]) {
        eventEmitter.emit(event, ...args);
    }

    export function init() {
        return new Promise<void>(resolve => {
            UDPServer = dgram.createSocket("udp4");
            UDPServer.on("message", messageHandler);
            UDPServer.on("listening", resolve);
            UDPServer.bind(users.me.connectionInfos.port);
        });
    }

    function messageHandler(msg: Buffer, rinfo: dgram.RemoteInfo) {
        if (msg.length < 28) return;

        const header: PacketHeader = {
            header: msg.toString("ascii", 0, 4),
            subProtocol: msg.readUInt8(4) & 0b11100000,
            sampleRateIndex: msg.readUInt8(4) & 0b00011111,
            samplePerFrame: msg.readUInt8(5),
            nbChannels: msg.readUInt8(6),
            dataFormat: msg.readUint8(7),
            streamName: msg.toString("ascii", 8, 24),
            frameCounter: msg.readUInt32LE(24),
        };

        if (header.header !== "VBAN") return;

        switch (header.subProtocol) {
            case SubProtocol.audio:
                throw new Error("Audio not implemented");
            case SubProtocol.serial:
                throw new Error("Serial not implemented");
            case SubProtocol.text:
                throw new Error("Text not implemented");
            case SubProtocol.service:
                ServicePacket.parse(rinfo, header, msg.slice(28));
                break;

            default:
                throw new Error("Unknown subProtocol");
        }
    }

    export function sendBuffer(to: ConnectionInfos, buffer: Buffer) {
        UDPServer.send(buffer, to.port, to.address);
    }
}

export default Server;
