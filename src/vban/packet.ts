import { PacketHeader, ServicePacketHeader, SubProtocol } from "@/typings/packet";

export function packetHeaderFromServicePacketHeader(header: ServicePacketHeader): PacketHeader {
    return {
        header: "VBAN",
        samplePerFrame: header.function,
        nbChannels: header.type,
        dataFormat: header.additionalInfo,
        streamName: header.streamName,
        frameCounter: header.frameCounter,
        sampleRateIndex: 0,
        subProtocol: SubProtocol.service,
    };
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
