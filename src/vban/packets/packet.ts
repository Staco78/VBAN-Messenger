import User from "../../users/user";
import { Server } from "../server";

export enum SubProtocol {
    audio = 0,
    serial = 0x20,
    text = 0x40,
    service = 0x60,
}

export interface PacketHeader {
    header: string;
    samplePerFrame: number;
    nbChannels: number;
    dataFormat: number;
    streamName: string;
    frameCounter: number;
    sampleRateIndex: number;
    subProtocol: SubProtocol;
}

export interface PacketInfos {
    host: string;
    port: number;
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
    UserPosition: string;
    langCode: string;

    deviceName: string;
    manufacturerName: string;
    applicationName: string;
    userName: string;
    userComment: string;
}

export function packetHeaderToBuffer(header: PacketHeader): Buffer {
    const buffer = Buffer.alloc(28);
    buffer.write(header.header, 0, 4, "ascii");
    buffer.writeUInt8(header.sampleRateIndex | header.subProtocol, 4);
    buffer.writeUint8(header.samplePerFrame, 5);
    buffer.writeUInt8(header.nbChannels, 6);
    buffer.writeUInt8(header.dataFormat, 7);
    buffer.write(header.streamName, 8, 24, "ascii");
    buffer.writeUInt32LE(header.frameCounter, 24);
    return buffer;
}

export abstract class BasePacket {
    constructor(public server: Server, public user: User, public header: PacketHeader) {}

    abstract parse(data: Buffer): void;
}
