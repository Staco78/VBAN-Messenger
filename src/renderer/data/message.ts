import { DbMessage } from "@/typings/messages";
import { Channel, channels } from "./channel";
import Server from "./server";
import User from "./user";

export default class Message {
    constructor(private infos: DbMessage) {}

    async getAuthor(): Promise<User> {
        return await Server.getUserById(this.infos.author);
    }

    async getChannel(): Promise<Channel> {
        return await channels.getChannel(this.infos.channel);
    }

    get content(): string {
        return this.infos.content;
    }

    get id(): bigint {
        return this.infos.id;
    }

    get timestamp(): Date {
        return new Date(this.infos.timestamp);
    }
}
