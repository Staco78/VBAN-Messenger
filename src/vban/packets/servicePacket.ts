import { server } from "../server";
import { BasePacket, PacketHeader, packetHeaderToBuffer, SubProtocol } from "./packet";
import dgram from "dgram";
import EventEmitter from "events";
import { ConnectionInfos, PingData } from "@/typings";

interface ServicePacketHeader {
    header: string;
    function: number;
    type: number;
    additionalInfo: number;
    streamName: string;
    frameCounter: number;
}

export function packetHeaderFromServicePacketHeader(header: ServicePacketHeader): PacketHeader {
    return {
        header: header.header,
        samplePerFrame: header.function,
        nbChannels: header.type,
        dataFormat: header.additionalInfo,
        streamName: header.streamName,
        frameCounter: header.frameCounter,
        sampleRateIndex: 0,
        subProtocol: SubProtocol.service,
    };
}

export enum ServicePacketType {
    identification = 0,
    chatUTF8 = 1,
    RTPacketRegister = 32,
    RTPacket = 33,
}

export enum ServicePacketFunction {
    ping = 0,
    reply = 0x80,
}

export class ServicePacket extends BasePacket {
    serviceHeader: ServicePacketHeader;
    userData: PingData | null = null;

    private static events = new EventEmitter();

    constructor(connectionInfos: ConnectionInfos, header: PacketHeader) {
        super(connectionInfos, header);
        this.serviceHeader = {
            header: header.header,
            function: header.samplePerFrame,
            type: header.nbChannels,
            additionalInfo: header.dataFormat,
            streamName: header.streamName,
            frameCounter: header.frameCounter,
        };
    }

    async parse(data: Buffer) {
        if (this.serviceHeader.type == ServicePacketType.identification) {
            if (this.serviceHeader.function == ServicePacketFunction.ping || this.serviceHeader.function == ServicePacketFunction.reply) {
                if (this.serviceHeader.function == ServicePacketFunction.ping) server.sendPong(this);

                if (data.length >= 676) {
                    this.userData = {
                        bitType: data.readUInt32LE(0),
                        bitFeature: data.readUInt32LE(4),
                        bitFeatureExt: data.readUInt32LE(8),
                        preferedRate: data.readUInt32LE(12),
                        minRate: data.readUInt32LE(16),
                        maxRate: data.readUInt32LE(20),
                        version: data.readUInt32LE(28),

                        GPSPosition: data.toString("ascii", 32, 40).replace(/\0/g, ""),
                        userPosition: data.toString("ascii", 40, 48).replace(/\0/g, ""),
                        langCode: data.toString("ascii", 48, 56).replace(/\0/g, ""),

                        // reserved from 56 to 164

                        deviceName: data.toString("ascii", 164, 228).replace(/\0/g, ""),
                        manufacturerName: data.toString("ascii", 228, 292).replace(/\0/g, ""),
                        applicationName: data.toString("ascii", 292, 356).replace(/\0/g, ""),

                        // reserved from 356 to 420

                        userName: data.toString("utf8", 420, 548).replace(/\0/g, ""),
                        userComment: data.toString("utf8", 548, 676).replace(/\0/g, ""),
                    };
                }
            }
        } else if (this.serviceHeader.type == ServicePacketType.chatUTF8) {
            const user = await server.getUser(this.connectionInfos);
            server.emit("message", data.toString("utf8"), user);
        }

        ServicePacket.events.emit(`${this.serviceHeader.type}_${this.serviceHeader.function}`, this);
    }

    static setHandler(type: ServicePacketType, func: ServicePacketFunction, handler: (packet: ServicePacket) => void) {
        this.events.on(`${type}_${func}`, handler);
    }

    static removeHandler(type: ServicePacketType, func: ServicePacketFunction, hander: (packet: ServicePacket) => void) {
        this.events.removeListener(`${type}_${func}`, hander);
    }

    static createMessage(msg: string, to: ConnectionInfos) {
        const header = packetHeaderFromServicePacketHeader({
            header: "VBAN",
            frameCounter: 0,
            function: ServicePacketFunction.ping,
            type: ServicePacketType.chatUTF8,
            additionalInfo: 0,
            streamName: "VBAN Service",
        });


        const buffer = Buffer.alloc(28 + msg.length);
        buffer.write(packetHeaderToBuffer(header).toString("ascii"), 0, 28, "ascii");
        buffer.write(msg, 28, "utf8");

        server.sendBuffer(buffer, to);
    }
}
