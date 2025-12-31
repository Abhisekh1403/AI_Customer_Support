import { Router } from "express";
import Database from "better-sqlite3";

const router = Router();
const db = new Database("data.db");

// GET all conversations
router.get("/conversations", (_req, res) => {
  const conversations = db
    .prepare("SELECT * FROM conversations ORDER BY created_at DESC")
    .all();

  res.json(conversations);
});

// GET messages for a specific conversation
router.get("/messages/:conversationId", (req, res) => {
  const { conversationId } = req.params;

  const messages = db
    .prepare(
      "SELECT sender, text, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at"
    )
    .all(conversationId);

  if (messages.length === 0) {
    return res.status(404).json({
      error: "No messages found for this conversationId"
    });
  }

  res.json(messages);
});

export default router;
