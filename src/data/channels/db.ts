import { DbChannel } from "@/typings/channels";
import { DbMessage } from "@/typings/messages";
import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";

namespace db {
    let db: Database.Database;
    let messagesDb: Database.Database;
    export function init() {
        if (!existsSync("db")) mkdirSync("db");
        db = new Database("./db/channels.sqlite");
        db.prepare("CREATE TABLE IF NOT EXISTS channel (id TEXT PRIMARY KEY, users TEXT, type INT)").run();
        messagesDb = new Database("db/messages.sqlite");
        messagesDb
            .prepare(
                "CREATE TABLE IF NOT EXISTS message (id TEXT PRIMARY KEY, channel TEXT, author TEXT, content TEXT, timestamp TIMESTAMP)"
            )
            .run();
    }

    function transformUsers(data: any): DbChannel {
        data.users = data.users.split(",");
        data.id = BigInt(data.id);
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

    export function addMessage(message: DbMessage, senderId: bigint) {
        messagesDb
            .prepare(
                "INSERT INTO message (id, channel, author, content, timestamp) VALUES (?, ?, ?, ?, strftime('%s', 'now'))"
            )
            .run(message.id.toString(), message.channel.toString(), senderId.toString(), message.content);
    }

    export function getMessages(channelId: bigint, page: number, messagesByPage: number): DbMessage[] {
        const messages: DbMessage[] = messagesDb
            .prepare("SELECT * FROM message WHERE channel = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?")
            .all(channelId.toString(), (page + 1) * messagesByPage, page * messagesByPage);
        return messages.map(m => {
            return {
                id: BigInt(m.id),
                channel: BigInt(m.channel),
                author: BigInt(m.author),
                content: m.content,
                timestamp: m.timestamp,
            };
        });
    }
}

export default db;
