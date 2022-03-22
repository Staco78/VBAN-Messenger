import { DbChannel } from "@/typings/channels";
import Database from "better-sqlite3";
import fs from "fs";

namespace db {
    let db: Database.Database;
    export function init() {
        if (!fs.existsSync("db")) fs.mkdirSync("db");
        db = new Database("./db/channels.sqlite");
        db.prepare("CREATE TABLE IF NOT EXISTS channel (id TEXT PRIMARY KEY, users TEXT, type INT)").run();
    }

    function transformUsers(data: any): DbChannel {
        data.users = data.users.split(",");
        return data;
    }

    export function find(id: bigint): DbChannel | null {
        const data = db.prepare("SELECT * FROM channel WHERE id = ?").get(id.toString());
        if (!data) return null;
        return transformUsers(data);
    }

    export function add(channel: DbChannel) {
        db.prepare("INSERT INTO channel (id, users, type) VALUES (?, ?, ?)").run(
            channel.id.toString(),
            channel.users.join(","),
            channel.type
        );
    }
}

export default db;
