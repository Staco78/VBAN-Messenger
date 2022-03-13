import User from "../../users/user";
import { Server } from "../server";
import { BasePacket, PacketHeader, packetHeaderToBuffer, PacketInfos, PingData, SubProtocol } from "./packet";

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
    data: Buffer | null = null;

    constructor(server: Server, user: User, header: PacketHeader) {
        super(server, user, header);
        this.serviceHeader = {
            header: header.header,
            function: header.samplePerFrame,
            type: header.nbChannels,
            additionalInfo: header.dataFormat,
            streamName: header.streamName,
            frameCounter: header.frameCounter,
        };
    }

    parse(data: Buffer) {
        this.data = data;

        if (this.serviceHeader.type == ServicePacketType.identification) {
            if (this.serviceHeader.function == ServicePacketFunction.ping) {
                this.server.sendPong(this);

                if (data.length >= 676) {
                    const d: PingData = {
                        bitType: data.readUInt32LE(0),
                        bitFeature: data.readUInt32LE(4),
                        bitFeatureExt: data.readUInt32LE(8),
                        preferedRate: data.readUInt32LE(12),
                        minRate: data.readUInt32LE(16),
                        maxRate: data.readUInt32LE(20),
                        version: data.readUInt32LE(28),

                        GPSPosition: data.toString("ascii", 32, 40),
                        UserPosition: data.toString("ascii", 40, 48),
                        langCode: data.toString("ascii", 48, 56),

                        // reserved from 56 to 164

                        deviceName: data.toString("ascii", 164, 228),
                        manufacturerName: data.toString("ascii", 228, 292),
                        applicationName: data.toString("ascii", 292, 356),

                        // reserved from 356 to 420

                        userName: data.toString("utf8", 420, 548),
                        userComment: data.toString("utf8", 548, 676),
                    };
                    console.log(d);
                    
                    this.user.infos = d;
                }
            }
        } else if (this.serviceHeader.type == ServicePacketType.chatUTF8) {
            this.server.emit("message", this, this.user, true);
            this.user.emit("message", this);
        }
    }
}
