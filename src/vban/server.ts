import dgram from "dgram";
import { PacketHeader, packetHeaderToBuffer, SubProtocol } from "./packets/packet";
import { packetHeaderFromServicePacketHeader, ServicePacket, ServicePacketFunction, ServicePacketType } from "./packets/servicePacket";
import User from "../users/user";
import users from "../users";
import EventEmitter from "events";

export interface ServerOptions {
    port: number;
}

export interface ServerInfos {
    bitType: number;
    bitFeature: number;
    bitFeatureExt: number;
    preferedRate: number;
    minRate: number;
    maxRate: number;
    version: number;

    GPSPosition: string;
    UserPosition: string;
    langCode: string;

    deviceName: string;
    manufacturerName: string;
    applicationName: string;
    userName: string;
    userComment: string;
}

interface ServerEvents {
    userConnected: () => void;
    message: (packet: any, sender: User, isUTF8: boolean) => void;
}

export declare interface Server {
    on<U extends keyof ServerEvents>(event: U, listener: ServerEvents[U]): this;
    emit<U extends keyof ServerEvents>(event: U, ...args: Parameters<ServerEvents[U]>): boolean;
}

export class Server extends EventEmitter {
    UDPServer: dgram.Socket;

    constructor(public options: ServerOptions, public infos: ServerInfos) {
        super();

        this.UDPServer = dgram.createSocket("udp4");
        this.UDPServer.on("message", this.messageHandler.bind(this));
        this.UDPServer.bind(options.port);
    }

    messageHandler(msg: Buffer, rinfo: dgram.RemoteInfo) {
        if (msg.length < 28) return;

        // @ts-ignore
        const header: PacketHeader = {
            header: msg.toString("ascii", 0, 4),
            samplePerFrame: msg.readUInt8(5),
            nbChannels: msg.readUInt8(6),
            dataFormat: msg.readUint8(7),
            streamName: msg.toString("ascii", 8, 24),
            frameCounter: msg.readUInt32LE(24),
        };

        const data = msg.readUint8(4);
        header.subProtocol = data & 0b11100000;
        header.sampleRateIndex = data & 0b00011111;

        if (header.header !== "VBAN") return;

        const user = users.getUser({ host: rinfo.address, port: rinfo.port }, true);

        switch (header.subProtocol) {
            case SubProtocol.audio:
                throw new Error("Audio not implemented");
            case SubProtocol.serial:
                throw new Error("Serial not implemented");
            case SubProtocol.text:
                throw new Error("Text not implemented");
            case SubProtocol.service:
                new ServicePacket(this, user, header).parse(msg.slice(28));
                break;

            default:
                throw new Error("Unknown subProtocol");
        }
    }

    sendPong(pingPacket: ServicePacket) {
        const buffer = Buffer.alloc(676 + 28);
        const header = packetHeaderFromServicePacketHeader({
            header: "VBAN",
            function: ServicePacketFunction.reply,
            type: ServicePacketType.identification,
            additionalInfo: 0,
            frameCounter: pingPacket.header.frameCounter,
            streamName: pingPacket.header.streamName,
        });

        buffer.write(packetHeaderToBuffer(header).toString("ascii"), 0, 28, "ascii");

        buffer.writeUInt32LE(this.infos.bitType, 28);
        buffer.writeUInt32LE(this.infos.bitFeature, 32);
        buffer.writeUInt32LE(this.infos.bitFeatureExt, 36);
        buffer.writeUInt32LE(this.infos.preferedRate, 40);
        buffer.writeUInt32LE(this.infos.minRate, 44);
        buffer.writeUInt32LE(this.infos.maxRate, 48);
        buffer.writeUInt32LE(this.infos.version, 56);

        buffer.write(this.infos.GPSPosition, 32 + 28, 8);
        buffer.write(this.infos.UserPosition, 40 + 28, 8);
        buffer.write(this.infos.langCode, 48 + 28, 8);

        buffer.write(this.infos.deviceName, 164 + 28, 64);
        buffer.write(this.infos.manufacturerName, 228 + 28, 64);
        buffer.write(this.infos.applicationName, 292 + 28, 64);

        buffer.write(this.infos.userName, 420 + 28, 128);
        buffer.write(this.infos.userComment, 548 + 28, 128);

        this.sendBuffer(pingPacket.user, buffer);
    }

    sendBuffer(to: User, buffer: Buffer) {
        this.UDPServer.send(buffer, to.port, to.host);
    }
}
