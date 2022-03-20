export const enum SubProtocol {
    audio = 0,
    serial = 0x20,
    text = 0x40,
    service = 0x60,
}

export const enum ServicePacketType {
    identification = 0,
    chatUTF8 = 1,
    RTPacketRegister = 32,
    RTPacket = 33,
}

export const enum ServicePacketFunction {
    ping = 0,
    reply = 0x80,
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

export interface ConnectionInfos {
    address: string;
    port: number;
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

export interface ServicePacketHeader {
    function: number;
    type: number;
    additionalInfo: number;
    streamName: string;
    frameCounter: number;
}
