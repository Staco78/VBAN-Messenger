import { DbUser, UserData } from "@/typings/user";
import Database from "better-sqlite3";
import fs from "fs";

namespace db {
    let db: Database.Database;
    export function init() {
        if (!fs.existsSync("db")) fs.mkdirSync("db");
        db = new Database("./db/users.sqlite");
        db.prepare(
            "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT, address TEXT, port INTEGER)"
        ).run();
    }

    export function userDbFromUserData(userData: UserData): DbUser {
        return {
            id: userData.id,
            name: userData.userName,
            address: userData.connectionInfos.address,
            port: userData.connectionInfos.port,
        };
    }

    function transform(data: any): DbUser {
        data.id = BigInt(data.id);
        return data;
    }

    export function find(id: bigint): DbUser | null {
        const data = db.prepare("SELECT * FROM users WHERE id = ?").get(id.toString());
        if (!data) return null;
        return transform(data);
    }

    export function addUser(user: DbUser) {
        db.prepare("INSERT INTO users (id, name, address, port) VALUES (?, ?, ?, ?)").run(
            user.id.toString(),
            user.name,
            user.address,
            user.port
        );
    }

    export function addIfNotExist(user: DbUser) {
        if (!find(user.id)) addUser(user);
    }

    export function getAllUsers(): DbUser[] {
        return db.prepare("SELECT * FROM users").all().map(transform);
    }
}
export default db;
