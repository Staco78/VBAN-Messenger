import { UserData, UserEvents } from "@/typings/user";
import { channels, DMChannel } from "./channel";
import EventEmitter from "./eventEmitter";

declare interface User {
    on<U extends keyof UserEvents>(event: U, listener: UserEvents[U]): this;
}

class User extends EventEmitter {
    constructor(public readonly infos: UserData) {
        super();
        window.electronAPI.server.on("userStatusChanged", (user, status) => {
            if (user.id === this.infos.id) {
                const oldStatus = this.infos.status;
                this.infos.status = status;
                this.emit("statusChanged", oldStatus, status);
            }
        });
    }

    get id() {
        return this.infos.id;
    }

    get name() {
        return this.infos.userName;
    }

    get status() {
        return this.infos.status;
    }

    get address() {
        return this.infos.connectionInfos.address;
    }

    get port() {
        return this.infos.connectionInfos.port;
    }

    get color() {
        return "#923E79"; // beautiful pink
    }

    get commentary() {
        return "This is a default commentary";
    }

    async getDMChannel(): Promise<DMChannel> {
        const chan = await channels.getChannel(this.infos.id);
        if (!(chan instanceof DMChannel)) throw new Error("User is not connected");
        return chan;
    }

    block() {
        throw new Error("Not implemented");
    }

    addAsFriend() {
        throw new Error("Not implemented");
    }

    removeFriend() {
        throw new Error("Not implemented");
    }
}

export default User;
