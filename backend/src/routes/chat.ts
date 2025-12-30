import { Router } from "express";
import {
  createConversation,
  insertMessage,
  getConversationById,
  getConversationHistory
} from "../db/repository";
import { generateReply } from "../llm/groq.service";

const router = Router();

router.post("/message", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    // 1. Input validation
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Message must be a non-empty string"
      });
    }

    if (message.length > 2000) {
        return res.status(400).json({
            error: "Message is too long"
        });
    }


    let conversationId = sessionId;

    // 2. Create or validate conversation
    if (conversationId) {
      const exists = getConversationById(conversationId);
      if (!exists) {
        return res.status(400).json({
          error: "Invalid sessionId"
        });
      }
    } else {
      conversationId = createConversation();
    }

    // 3. Fetch conversation history
    const history = getConversationHistory(conversationId);

    // 4. Store user message
    insertMessage(conversationId, "user", message);

    // 5. Call LLM
    const reply = await generateReply(history, message);

    // 6. Store AI reply
    insertMessage(conversationId, "ai", reply);

    // 7. Return response
    return res.json({
      reply,
      sessionId: conversationId
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
});

export default router;
