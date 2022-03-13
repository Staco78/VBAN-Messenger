import { Server } from "../server";
import { BasePacket, PacketHeader, SubProtocol } from "./packet";
import dgram from "dgram";
import EventEmitter from "events";

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

export interface PingData {
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

    constructor(server: Server, rinfo: dgram.RemoteInfo, header: PacketHeader, data: Buffer) {
        super(server, rinfo, header, data);
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
                if (this.serviceHeader.function == ServicePacketFunction.ping) this.server.sendPong(this);

                if (this.data.length >= 676) {
                    this.userData = {
                        bitType: this.data.readUInt32LE(0),
                        bitFeature: this.data.readUInt32LE(4),
                        bitFeatureExt: this.data.readUInt32LE(8),
                        preferedRate: this.data.readUInt32LE(12),
                        minRate: this.data.readUInt32LE(16),
                        maxRate: this.data.readUInt32LE(20),
                        version: this.data.readUInt32LE(28),

                        GPSPosition: this.data.toString("ascii", 32, 40),
                        userPosition: this.data.toString("ascii", 40, 48),
                        langCode: this.data.toString("ascii", 48, 56),

                        // reserved from 56 to 164

                        deviceName: this.data.toString("ascii", 164, 228),
                        manufacturerName: this.data.toString("ascii", 228, 292),
                        applicationName: this.data.toString("ascii", 292, 356),

                        // reserved from 356 to 420

                        userName: this.data.toString("utf8", 420, 548),
                        userComment: this.data.toString("utf8", 548, 676),
                    };
                }
            }
        } else if (this.serviceHeader.type == ServicePacketType.chatUTF8) {
            const user = await this.server.getUser(this.rinfo);
            this.server.emit("message", this.data.toString("utf8"), user);
            user.emit("message", this);
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
