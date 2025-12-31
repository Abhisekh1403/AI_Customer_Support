import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { initDb } from "./db/schema";
import chatRouter from "./routes/chat";
import debugRouter from "./routes/debug";

/*
import {
  createConversation,
  insertMessage,
  getMessages
} from "./db/repository";
import { generateReply } from "./llm/groq.service";
*/
dotenv.config({quiet: true});

const app = express();
app.use(cors());
app.use(express.json({ limit: "10kb" }));

initDb();
console.log("Database initialized");

/*const conversationId = createConversation();
insertMessage(conversationId, "user", "Hello");
insertMessage(conversationId, "ai", "Hi, how can I help you?");
const messages = getMessages(conversationId);
console.log("DB TEST MESSAGES:", messages);

(async () => {
  const reply = await generateReply(
    [
      { sender: "user", text: "Do you ship to USA?" }
    ],
    "What is your return policy?"
  );

  console.log("GROQ TEST REPLY:", reply);
})();
*/

app.use("/chat", chatRouter);
app.use("/debug", debugRouter);

// Health check endpoint

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
