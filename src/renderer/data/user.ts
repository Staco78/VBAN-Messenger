import { UserData } from "@/typings/user";

export default class User {
    constructor(public infos: UserData) {}

    get name() {
        return this.infos.userName;
    }
}
