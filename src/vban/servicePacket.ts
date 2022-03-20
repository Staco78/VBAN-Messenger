import { ConnectionInfos, PacketHeader, PingData, ServicePacketFunction, ServicePacketHeader, ServicePacketType } from "@/typings/packet";
import { UserData } from "@/typings/user";
import users from "@/users";
import { randomInt } from "crypto";
import EventEmitter from "events";
import { cp } from "fs";
import { packetHeaderFromServicePacketHeader, packetHeaderToBuffer } from "./packet";
import Server from "./server";

namespace ServicePacket {
    const eventEmitter = new EventEmitter();

    export function addEventListener(
        type: ServicePacketType,
        func: ServicePacketFunction,
        listener: (connectionInfos: ConnectionInfos, header: PacketHeader, data: Buffer) => void
    ) {
        eventEmitter.addListener(`${type}-${func}`, listener);
    }

    export function removeListener(
        type: ServicePacketType,
        func: ServicePacketFunction,
        listener: (connectionInfos: ConnectionInfos, header: PacketHeader, data: Buffer) => void
    ) {
        eventEmitter.removeListener(`${type}-${func}`, listener);
    }

    function servicePacketFromHeader(header: PacketHeader): ServicePacketHeader {
        return {
            function: header.samplePerFrame,
            type: header.nbChannels,
            additionalInfo: header.dataFormat,
            streamName: header.streamName,
            frameCounter: header.frameCounter,
        };
    }

    export async function parse(connectionInfos: ConnectionInfos, header: PacketHeader, data: Buffer) {
        const servicePacket = servicePacketFromHeader(header);
        if (servicePacket.type == ServicePacketType.identification) {
            if (servicePacket.function == ServicePacketFunction.ping) {
                sendPong(connectionInfos, header.frameCounter);
                const userData = receiveIdentification(data);
                if (!userData) throw new Error("No data in identification packet");
                users.add(connectionInfos, header.streamName, userData);
            }
        }
        else if (servicePacket.type == ServicePacketType.chatUTF8){
            Server.emit("message", data.toString("utf8"), await users.getUser(connectionInfos, header.streamName));
        }
        eventEmitter.emit(`${servicePacket.type}-${servicePacket.function}`, connectionInfos, header, data);
    }

    function receiveIdentification(data: Buffer): PingData | null {
        if (data.length < 676) return null;
        return {
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

    export function ping(infos: ConnectionInfos): Promise<UserData | null> {
        return new Promise<UserData | null>((resolve, reject) => {
            const frameCounter = randomInt(0, 0xffffffff);
            const header = packetHeaderFromServicePacketHeader({
                function: ServicePacketFunction.ping,
                type: ServicePacketType.identification,
                additionalInfo: 0,
                frameCounter,
                streamName: "VBAN ID",
            });
            sendIndentification(header, infos);

            let resolved = false;

            const timeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    ServicePacket.removeListener(ServicePacketType.identification, ServicePacketFunction.reply, handler);
                    resolve(null);
                }
            }, 5000);

            const handler = (connectionInfos: ConnectionInfos, header: PacketHeader, data: Buffer) => {
                if (!resolved) {
                    // if (header.frameCounter != frameCounter) return;
                    const userData = receiveIdentification(data);
                    if (!userData) throw new Error("No data in identification packet");
                    resolved = true;
                    ServicePacket.removeListener(ServicePacketType.identification, ServicePacketFunction.reply, handler);
                    clearTimeout(timeout);
                    resolve(users.createUser(connectionInfos, header.streamName, userData));                    
                }
            };

            ServicePacket.addEventListener(ServicePacketType.identification, ServicePacketFunction.reply, handler);
        });
    }

    function sendPong(connectionInfos: ConnectionInfos, frameCounter: number) {
        const header: ServicePacketHeader = {
            function: ServicePacketFunction.reply,
            type: ServicePacketType.identification,
            additionalInfo: 0,
            streamName: "VBAN ID",
            frameCounter,
        };

        sendIndentification(packetHeaderFromServicePacketHeader(header), connectionInfos);
    }

    function sendIndentification(header: PacketHeader, rinfo: ConnectionInfos) {
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

        Server.sendBuffer(rinfo, buffer);
    }

    addEventListener;
}

export default ServicePacket;
