import { ConnectionInfos } from "@/typings";
import users from "@/users";
import { server } from "../server";
import { BasePacket, PacketHeader, packetHeaderToBuffer, SubProtocol } from "./packet";

export enum TextStreamType {
    ascii = 0,
    utf8 = 0x10,
}

// const _TextStreamType: { [key: number]: BufferEncoding } = {
//     [TextStreamType.ascii]: "ascii",
//     [TextStreamType.utf8]: "utf8",
// };

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

function textPacketHeaderFromPacketHeader(header: PacketHeader): TextPacketHeader {
    return {
        header: header.header,
        bitmode: header.samplePerFrame,
        channel: header.nbChannels,
        dataFormat: header.dataFormat & 0b00001111,
        serialType: header.dataFormat & 0b11110000,
        streamName: header.streamName,
        frameCounter: header.frameCounter,
        bps: header.sampleRateIndex,
    };
}

export class TextPacket extends BasePacket {
    content: string | null = null;
    readonly textHeader: TextPacketHeader;

    constructor(connectionInfos: ConnectionInfos, header: TextPacketHeader | PacketHeader) {
        if ("serialType" in header) {
            super(connectionInfos, packetHeaderFromTextPacketHeader(header));
            this.textHeader = header;
        } else {
            super(connectionInfos, header);
            this.textHeader = textPacketHeaderFromPacketHeader(header);
        }
    }

    getEncoding(serialType: number) {
        return Object.keys(TextStreamType)[Object.values(TextStreamType).indexOf(serialType)] as BufferEncoding;
    }

    async parse(data: Buffer) {
        this.content = data.toString(this.getEncoding(this.textHeader.serialType));
        server.emit("message", this.content, await server.getUser(this.connectionInfos));
    }

    send() {
        if (!this.content || this.content.length === 0) {
            console.warn("Trying to send a packet without content");
            return;
        }
        const buffer = Buffer.alloc(this.content.length + 28);
        buffer.write(packetHeaderToBuffer(this.header).toString("ascii"), 0, 28, "ascii");
        buffer.write(this.content, 28, this.getEncoding(this.textHeader.serialType));

        server.sendBuffer(buffer, this.connectionInfos);
    }

    static createMessage(msg: string, to: ConnectionInfos) {
        const header: TextPacketHeader = {
            header: "VBAN",
            bps: 0,
            bitmode: 0,
            channel: 0,
            dataFormat: 0,
            serialType: 0,
            streamName: "VBAN Text",
            frameCounter: 0,
        };

        const packet = new TextPacket(to, header);
        packet.content = msg;
        packet.send();
    }
}
