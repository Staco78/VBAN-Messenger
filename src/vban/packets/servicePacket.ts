import { server } from "../server";
import { BasePacket, PacketHeader, SubProtocol } from "./packet";
import dgram from "dgram";
import EventEmitter from "events";
import { PingData } from "@/types";

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

    constructor(rinfo: dgram.RemoteInfo, header: PacketHeader, data: Buffer) {
        super(rinfo, header, data);
        this.serviceHeader = {
            header: header.header,
            function: header.samplePerFrame,
            type: header.nbChannels,
            additionalInfo: header.dataFormat,
            streamName: header.streamName,
            frameCounter: header.frameCounter,
        };
    }

    async parse() {
        if (this.serviceHeader.type == ServicePacketType.identification) {
            if (this.serviceHeader.function == ServicePacketFunction.ping || this.serviceHeader.function == ServicePacketFunction.reply) {
                if (this.serviceHeader.function == ServicePacketFunction.ping) server.sendPong(this);

                if (this.data.length >= 676) {
                    this.userData = {
                        bitType: this.data.readUInt32LE(0),
                        bitFeature: this.data.readUInt32LE(4),
                        bitFeatureExt: this.data.readUInt32LE(8),
                        preferedRate: this.data.readUInt32LE(12),
                        minRate: this.data.readUInt32LE(16),
                        maxRate: this.data.readUInt32LE(20),
                        version: this.data.readUInt32LE(28),

                        GPSPosition: this.data.toString("ascii", 32, 40).replace(/\0/g, ""),
                        userPosition: this.data.toString("ascii", 40, 48).replace(/\0/g, ""),
                        langCode: this.data.toString("ascii", 48, 56).replace(/\0/g, ""),

                        // reserved from 56 to 164

                        deviceName: this.data.toString("ascii", 164, 228).replace(/\0/g, ""),
                        manufacturerName: this.data.toString("ascii", 228, 292).replace(/\0/g, ""),
                        applicationName: this.data.toString("ascii", 292, 356).replace(/\0/g, ""),

                        // reserved from 356 to 420

                        userName: this.data.toString("utf8", 420, 548).replace(/\0/g, ""),
                        userComment: this.data.toString("utf8", 548, 676).replace(/\0/g, ""),
                    };
                }
            }
        } else if (this.serviceHeader.type == ServicePacketType.chatUTF8) {
            const user = await server.getUser(this.rinfo);
            server.emit("message", this.data.toString("utf8"), user);
        }

        ServicePacket.events.emit(`${this.serviceHeader.type}_${this.serviceHeader.function}`, this);
    }

    static setHandler(type: ServicePacketType, func: ServicePacketFunction, handler: (packet: ServicePacket) => void) {
        this.events.on(`${type}_${func}`, handler);
    }

    static removeHandler(type: ServicePacketType, func: ServicePacketFunction, hander: (packet: ServicePacket) => void) {
        this.events.removeListener(`${type}_${func}`, hander);
    }
}
