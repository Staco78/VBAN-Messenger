import { ChannelType, DbChannel } from "@/typings/channels";
import Message from "./message";
import Server from "./server";
import User from "./user";

export namespace channels {
    let channels: Channel[] = [];

    export async function getChannel(id: bigint): Promise<Channel> {
        let channel = channels.find(c => c.id === id);
        if (channel) return channel;
        const data = await window.electronAPI.getDMChannel(id);
        channel = new DMChannel(await Server.getUserById(data.id), data); // this return a DMChannel because we don't support group channels yet
        channels.push(channel);
        return channel;
    }
}

export abstract class Channel {
    constructor(protected data: DbChannel) {}

    get id() {
        return this.data.id;
    }

    abstract get name(): string;

    sendMessage(content: string) {
        throw new Error("Not implemented");
    }

    async getMessages(page: number, messagesByPage = 50): Promise<Message[]> {
        const messages = await window.electronAPI.getMessages(this.id, page, messagesByPage);
        return messages.map(m => new Message(m));
    }
}

export class DMChannel extends Channel {
    private user: User;

    constructor(user: User, data: DbChannel) {
        if (data.type !== ChannelType.DM) throw new Error("DMChannel data must be a DM channel");
        super(data);
        this.user = user;
    }

    get name() {
        return this.user.name;
    }

    get addressee() {
        return this.user;
    }
}
