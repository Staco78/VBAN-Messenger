import { UserData, UserEvents } from "@/typings/user";
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

    get name() {
        return this.infos.userName;
    }

    get status() {
        return this.infos.status;
    }
}

export default User;
