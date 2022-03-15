import { User as UserType, UserData } from "@/typings";

export default class User implements UserType {
    constructor(public infos: UserData) {}

    get name() {
        return this.infos.userName;
    }
}
