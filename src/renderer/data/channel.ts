import { ChannelType, DbChannel } from "@/typings/channels";
import User from "./user";

export abstract class Channel {
    constructor(protected data: DbChannel) {}

    get id() {
        return this.data.id;
    }

    abstract get name(): string;

    sendMessage(content: string) {
        throw new Error("Not implemented");
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
