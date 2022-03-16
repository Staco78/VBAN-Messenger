import dgram from "dgram";
import { PacketHeader, packetHeaderToBuffer, SubProtocol } from "./packets/packet";
import { packetHeaderFromServicePacketHeader, ServicePacket, ServicePacketFunction, ServicePacketType } from "./packets/servicePacket";
import users from "../users";
import EventEmitter from "events";
import { randomInt } from "crypto";
import { _Server as ServerType, UserData, ConnectionInfos } from "@/typings";
import { TextPacket } from "./packets/textPacket";

export class Server extends EventEmitter implements ServerType {
    UDPServer: dgram.Socket;

    constructor() {
        super();

        this.UDPServer = dgram.createSocket("udp4");
        this.UDPServer.on("message", (msg, rinfo) => {
            try {
                this.messageHandler(msg, rinfo);
            } catch (error) {
                console.error(error);
            }
        });
        this.UDPServer.bind(users.me.connectionInfos.port);
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
                new TextPacket(rinfo, header).parse(msg.slice(28));
            case SubProtocol.service:
                new ServicePacket(rinfo, header).parse(msg.slice(28));
                break;

            default:
                throw new Error("Unknown subProtocol");
        }
    }

    async getUser(rinfo: ConnectionInfos): Promise<UserData> {
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
            frameCounter: 1234567,
            streamName: pingPacket.header.streamName,
        });

        this.sendIndentification(header, pingPacket.connectionInfos);
    }

    async ping(infos: ConnectionInfos): Promise<UserData | null> {
        return new Promise<UserData | null>((resolve, reject) => {
            const header = packetHeaderFromServicePacketHeader({
                header: "VBAN",
                function: ServicePacketFunction.ping,
                type: ServicePacketType.identification,
                additionalInfo: 0,
                frameCounter: randomInt(0, 0xffffffff),
                streamName: "VBAN ID",
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
                    let user = users.findUser(packet.connectionInfos);
                    if (!user) {
                        user = users.createUserData(packet.connectionInfos, packet.userData);
                        this.emit("userConnected", user);
                    }
                    resolve(user);
                }
            };

            ServicePacket.setHandler(ServicePacketType.identification, ServicePacketFunction.reply, handler);
        });
    }

    sendIndentification(header: PacketHeader, rinfo: ConnectionInfos) {
        const buffer = Buffer.alloc(676 + 28);
        packetHeaderToBuffer(header).copy(buffer);

        buffer.writeUInt32LE(users.me.bitType, 28);
        buffer.writeUInt32LE(users.me.bitFeature, 32);
        buffer.writeUInt32LE(users.me.bitFeatureExt, 36);
        buffer.writeUInt32LE(users.me.preferedRate, 40);
        buffer.writeUInt32LE(users.me.minRate, 44);
        buffer.writeUInt32LE(users.me.maxRate, 48);
        buffer.writeUInt32LE(users.me.version, 56);

        buffer.write(users.me.GPSPosition, 32 + 28, 8);
        buffer.write(users.me.userPosition, 40 + 28, 8);
        buffer.write(users.me.langCode, 48 + 28, 8);

        buffer.write(users.me.deviceName, 164 + 28, 64);
        buffer.write(users.me.manufacturerName, 228 + 28, 64);
        buffer.write(users.me.applicationName, 292 + 28, 64);

        buffer.write(users.me.userName, 420 + 28, 128);
        buffer.write(users.me.userComment, 548 + 28, 128);

        this.sendBuffer(buffer, rinfo);
    }

    sendMessage(msg: string, to: UserData) {
        if (to.isVBAN_M_User) TextPacket.createMessage(msg, to.connectionInfos);
        else ServicePacket.createMessage(msg, to.connectionInfos);
    }

    sendBuffer(buffer: Buffer, to: ConnectionInfos) {
        this.UDPServer.send(buffer, to.port, to.address);
    }
}

export const server: ServerType = new Server();
