import Database from "better-sqlite3";
import fs from "fs/promises";

const db = new Database("./db/users.sqlite");

export async function init() {
    if (!(await fs.stat("./db")).isDirectory()) await fs.mkdir("./db");
    console.log(db.prepare("SELECT * FROM users").all());
}
