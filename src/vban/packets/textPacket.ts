import { ConnectionInfos } from "@/typings";
import { server } from "../server";
import { BasePacket, PacketHeader, packetHeaderToBuffer, SubProtocol } from "./packet";

export const TextStreamType: { [key: number]: BufferEncoding } = {
    [0]: "ascii",
    [0x10]: "utf8",
};

interface TextPacketHeader {
    header: string;
    bps: number;
    bitmode: number;
    channel: number;
    dataFormat: number;
    serialType: number;
    streamName: string;
    frameCounter: number;
}

export function packetHeaderFromTextPacketHeader(header: TextPacketHeader): PacketHeader {
    return {
        header: header.header,
        samplePerFrame: header.bitmode,
        nbChannels: header.channel,
        dataFormat: header.dataFormat | header.serialType,
        streamName: header.streamName,
        frameCounter: header.frameCounter,
        sampleRateIndex: header.bps,
        subProtocol: SubProtocol.text,
    };
}

export class TextPacket extends BasePacket {
    content: string | null = null;

    constructor(connectionInfos: ConnectionInfos, header: PacketHeader) {
        super(connectionInfos, header);
    }

    parse(data: Buffer): void {
        this.content = data.toString(TextStreamType[this.header.sampleRateIndex]);
    }

    send() {
        if (!this.content) {
            console.warn("Trying to send a packet without content");
            return;
        }
        const buffer = Buffer.alloc(this.content.length + 28);
        buffer.write(packetHeaderToBuffer(this.header).toString("ascii"), 0, 28, "ascii");
        buffer.write(this.content, 28, TextStreamType[this.header.sampleRateIndex]);

        server.sendBuffer(buffer, this.connectionInfos);
    }
}
