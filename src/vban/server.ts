import dgram from "dgram";
import { PacketHeader, packetHeaderToBuffer, SubProtocol } from "./packets/packet";
import { packetHeaderFromServicePacketHeader, ServicePacket, ServicePacketFunction, ServicePacketType } from "./packets/servicePacket";
import User from "../users/user";
import users from "../users";
import EventEmitter from "events";
import { randomInt } from "crypto";
import { Server as ServerType } from "@/types";

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

export class Server extends EventEmitter implements ServerType {
    UDPServer: dgram.Socket;

    constructor(public options: ServerOptions, public infos: ServerInfos) {
        super();

        this.UDPServer = dgram.createSocket("udp4");
        this.UDPServer.on("message", (msg, rinfo) => {
            try {
                this.messageHandler(msg, rinfo);
            } catch (error) {
                console.error(error);
            }
        });
        this.UDPServer.bind(options.port);
    }

    async messageHandler(msg: Buffer, rinfo: dgram.RemoteInfo) {
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

        switch (header.subProtocol) {
            case SubProtocol.audio:
                throw new Error("Audio not implemented");
            case SubProtocol.serial:
                throw new Error("Serial not implemented");
            case SubProtocol.text:
                throw new Error("Text not implemented");
            case SubProtocol.service:
                new ServicePacket(this, rinfo, header, msg.slice(28)).parse();
                break;

            default:
                throw new Error("Unknown subProtocol");
        }
    }

    async getUser(rinfo: dgram.RemoteInfo): Promise<User> {
        let user = users.findUser(rinfo);
        if (!user) {
            user = await this.ping(rinfo);
            if (!user) throw new Error("User ping timeout");
        }

        return user;
    }

    sendPong(pingPacket: ServicePacket) {
        const header = packetHeaderFromServicePacketHeader({
            header: "VBAN",
            function: ServicePacketFunction.reply,
            type: ServicePacketType.identification,
            additionalInfo: 0,
            frameCounter: pingPacket.header.frameCounter,
            streamName: pingPacket.header.streamName,
        });

        this.sendIndentification(header, pingPacket.rinfo);
    }

    async ping(infos: dgram.RemoteInfo): Promise<User | null> {
        return new Promise<User | null>((resolve, reject) => {
            const header = packetHeaderFromServicePacketHeader({
                header: "VBAN",
                function: ServicePacketFunction.reply,
                type: ServicePacketType.identification,
                additionalInfo: 0,
                frameCounter: randomInt(0, 0xffffffff),
                streamName: "VBAN Identification",
            });
            this.sendIndentification(header, infos);

            let resolved = false;

            const timeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    ServicePacket.removeHandler(ServicePacketType.identification, ServicePacketFunction.reply, handler);
                    resolve(null);
                }
            }, 5000);

            const handler = (packet: ServicePacket) => {
                if (!resolved) {
                    if (!packet.userData) throw new Error("No data in pong");
                    resolved = true;
                    ServicePacket.removeHandler(ServicePacketType.identification, ServicePacketFunction.reply, handler);
                    clearTimeout(timeout);
                    resolve(users.createUser(packet.rinfo, packet.userData));
                }
            };

            ServicePacket.setHandler(ServicePacketType.identification, ServicePacketFunction.reply, handler);
        });
    }

    sendIndentification(header: PacketHeader, rinfo: dgram.RemoteInfo) {
        const buffer = Buffer.alloc(676 + 28);
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

        this.sendBuffer(rinfo, buffer);
    }

    sendBuffer(to: dgram.RemoteInfo, buffer: Buffer) {
        this.UDPServer.send(buffer, to.port, to.address);
    }
}
