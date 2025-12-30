import { db } from "./index";
import { v4 as uuidv4 } from "uuid";

export function createConversation(): string {
  const id = uuidv4();

  db.prepare(
    `INSERT INTO conversations (id) VALUES (?)`
  ).run(id);

  return id;
}

export function insertMessage(
  conversationId: string,
  sender: "user" | "ai",
  text: string
) {
  db.prepare(
    `INSERT INTO messages (id, conversation_id, sender, text)
     VALUES (?, ?, ?, ?)`
  ).run(uuidv4(), conversationId, sender, text);
}

export function getMessages(conversationId: string) {
  return db.prepare(
    `SELECT sender, text, created_at
     FROM messages
     WHERE conversation_id = ?
     ORDER BY created_at ASC`
  ).all(conversationId);
}

export function getConversationById(conversationId: string) {
  return db
    .prepare(
      `SELECT id FROM conversations WHERE id = ?`
    )
    .get(conversationId);
}

export function getConversationHistory(conversationId: string) {
  return db
    .prepare(
      `SELECT sender, text
       FROM messages
       WHERE conversation_id = ?
       ORDER BY created_at ASC`
    )
    .all(conversationId) as { sender: "user" | "ai"; text: string }[];
}