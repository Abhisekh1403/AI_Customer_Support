AI Customer Support Web Application

An AI-powered customer support web application that allows users to chat with an AI agent.
The application supports session-based conversations and persists chat history in a database, ensuring continuity across messages.

This project was built as part of a software engineering assignment, with a focus on clarity, correctness, and simplicity.

🚀 Features

AI-powered customer support chat

Session-based conversation handling using conversationId

Persistent chat history stored in SQLite

REST API backend with clean modular structure

Simple, responsive frontend chat UI

Clear separation of frontend, backend, and AI logic

🧱 Tech Stack
Backend

Node.js

Express

TypeScript

SQLite (via better-sqlite3)

Groq LLM API

Frontend

Svelte

Vite

Vanilla CSS

📂 Project Structure
AI_Customer_Support/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts        # DB initialization & tables
│   │   │   └── repository.ts    # DB queries (insert/fetch messages)
│   │   ├── routes/
│   │   │   └── chat.ts          # /chat/message endpoint
            └── debug.ts         # Read-only DB debug APIs
│   │   ├── llm/
│   │   │   └── groq.service.ts  # LLM integration logic
│   │   └── index.ts             # Backend entry point
│   ├── data.db                  # SQLite DB (gitignored)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   └── App.svelte            # Chat UI
│   ├── index.html
│   └── package.json
│
└── README.md

🔁 Conversation & Persistence Design

Each chat session is assigned a UUID-based conversationId

Every message (user and AI) is stored in SQLite with:

conversation_id

sender (user or ai)

text

created_at

On follow-up messages, the same conversationId is sent to maintain context

Chat persistence was verified by directly inspecting the SQLite database

This ensures conversations are stateful and persistent, not stateless AI calls.

⚙️ How to Run the Project Locally (Step-by-Step)
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/AI_Customer_Support.git
cd AI_Customer_Support

🔧 Backend Setup
2️⃣ Install Backend Dependencies
cd backend
npm install

3️⃣ Environment Variable Configuration

Create a .env file inside the backend/ directory:

GROQ_API_KEY=your_groq_api_key_here


The .env file is required to authenticate with the LLM provider
It is intentionally excluded from Git for security reasons

4️⃣ Database Setup (Migrations / Seed)

No manual migrations or seeding are required.

SQLite database (data.db) is automatically created on server startup

Tables are initialized in src/db/schema.ts

The database file persists locally between restarts

This keeps setup simple and avoids external DB dependencies.

5️⃣ Start the Backend Server
npm run dev


Backend will start at:

http://localhost:3000


Health check:

GET http://localhost:3000/health


Expected response:

{ "status": "ok" }

🎨 Frontend Setup
6️⃣ Install Frontend Dependencies
cd ../frontend
npm install

7️⃣ Start the Frontend
npm run dev


Frontend will run at:

http://localhost:5173


Open this URL in a browser to use the chat interface.

📡 API Documentation
POST /chat/message

Request Body

{
  "message": "Do you ship to the USA?",
  "sessionId": "optional-existing-session-id"
}


Response

{
  "reply": "Yes, we do ship to the USA...",
  "sessionId": "generated-or-existing-session-id"
}


sessionId is generated on first message

Subsequent messages must send the same sessionId

🧪 Read-Only Debug Database Endpoints (Evaluation Only)

For evaluation and verification purposes, the backend exposes read-only debug endpoints to inspect persisted data.

These endpoints do not modify the database and are intended for local verification only.

🔹 List all conversations
GET /debug/conversations


Example response:

[
  {
    "id": "6c813577-dfc8-422b-82a8-e35b0d086dd5",
    "created_at": "2025-12-30 19:10:45"
  }
]

🔹 View messages for a conversation
GET /debug/messages/:conversationId


Example:

/debug/messages/6c813577-dfc8-422b-82a8-e35b0d086dd5


Response:

[
  {
    "sender": "user",
    "text": "Do you ship to the USA?",
    "created_at": "2025-12-30 19:10:45"
  },
  {
    "sender": "ai",
    "text": "Yes, we do ship to the USA...",
    "created_at": "2025-12-30 19:10:46"
  }
]


These endpoints would be disabled or protected in a production environment.

🧠 Architecture Overview
Backend Structure

Routes layer: Handles HTTP requests and validation

Service layer (LLM): Encapsulates AI provider logic

Repository layer: Handles all database interactions

Schema layer: Responsible for DB initialization

This separation improves readability, testability, and maintainability.

💡 Key Design Decisions

SQLite chosen for simplicity and portability

UUID-based session IDs for clean conversation tracking

Minimal frontend to focus on core functionality

No authentication (not required by assignment)

No deployment (local execution was sufficient)

🤖 LLM Integration Notes

Provider: Groq

Model: Llama-based Groq-supported model

Prompting Strategy:

System prompt defines AI as a customer support agent

Full conversation history is passed to maintain context

Temperature kept low for consistent, deterministic responses

🧪 Testing & Verification

Backend APIs tested using PowerShell and curl

Frontend tested via browser interaction

Database persistence verified using SQLite inspection tools

Session continuity validated across multiple messages

⚠️ Notes & Limitations

No user authentication or rate limiting

No deployment configuration included

UI intentionally kept simple and functional

These trade-offs were made to align strictly with assignment scope.

## 🌐 Deployment (Render)

The application is deployed on **Render** using two separate services:

### Backend
- Deployed as a **Render Web Service**
- Runs the Express + TypeScript backend
- Uses **SQLite** for persistent storage
- Fully supports session-based conversations and database persistence

Backend site:
https://ai-customer-support-backend-k0rz.onrender.com

Health Check:
https://ai-customer-support-backend-k0rz.onrender.com/health

Get Conversation id:
https://ai-customer-support-backend-k0rz.onrender.com/debug/conversations

Get Messages:
https://ai-customer-support-backend-k0rz.onrender.com/debug/messages/"conversation-id"
