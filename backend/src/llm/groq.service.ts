import dotenv from "dotenv";
import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat";

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("GROQ_API_KEY is not set in environment variables");
}

const groq = new Groq({
  apiKey
});

const SYSTEM_PROMPT = `
You are a helpful customer support agent for a small e-commerce store.

Store information:
- Shipping: We ship within India and the USA. Orders ship in 2–3 business days.
- Returns: 7-day return policy for unused items. Refunds processed within 5 days.
- Support hours: Monday to Friday, 9 AM – 6 PM IST.

Answer clearly, politely, and concisely.
`;

export async function generateReply(
  history: { sender: "user" | "ai"; text: string }[],
  userMessage: string
): Promise<string> {
  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: SYSTEM_PROMPT
      },
      ...history.map(m => {
        const role: "user" | "assistant" = m.sender === "user" ? "user" : "assistant";
        return {
          role, 
          content: m.text
        };
      }),
      {
        role: "user" as const,
        content: userMessage
      }
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.3
    });

    return (
      completion.choices[0]?.message?.content ??
      "Sorry, I couldn’t generate a response."
    );
  } catch (error) {
    console.error("Groq error:", error);
    return "Sorry, the support agent is temporarily unavailable.";
  }
}
