import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(__dirname, "../../data.db");

export const db = new Database(dbPath);

// Enable WAL mode for better reliability
db.pragma("journal_mode = WAL");
