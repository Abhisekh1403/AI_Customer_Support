<script>
  let messages = [];
  let input = "";
  let sessionId = null;
  let loading = false;

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const text = input;
    input = "";
    loading = true;

    messages = [...messages, { sender: "user", text }];

    try {
      const res = await fetch("http://localhost:3000/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId
        })
      });

      const data = await res.json();

      if (data.reply) {
        sessionId = data.sessionId;
        messages = [...messages, { sender: "ai", text: data.reply }];
      } else {
        messages = [...messages, {
          sender: "ai",
          text: "Unexpected response from server."
        }];
      }
    } catch (e) {
      messages = [...messages, {
        sender: "ai",
        text: "Server error. Please try again."
      }];
    } finally {
      loading = false;
      scrollToBottom();
    }
  }

  function scrollToBottom() {
    const el = document.getElementById("chat");
    if (el) el.scrollTop = el.scrollHeight;
  }
</script>

<style>
  body {
    margin: 0;
    background: #0f172a;
    font-family: system-ui, sans-serif;
  }

  .container {
    max-width: 420px;
    margin: 40px auto;
    height: 85vh;
    background: white;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    overflow: hidden;
  }

  .header {
    padding: 16px;
    background: #1e293b;
    color: white;
    text-align: center;
    font-weight: 600;
  }

  .chat {
    flex: 1;
    padding: 16px;
    background: #f8fafc;
    overflow-y: auto;
  }

  .msg {
    max-width: 85%;
    padding: 10px 14px;
    border-radius: 12px;
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 1.4;
  }

  .user {
    margin-left: auto;
    background: #2563eb;
    color: white;
    border-bottom-right-radius: 4px;
  }

  .ai {
    margin-right: auto;
    background: #e5e7eb;
    color: #111827;
    border-bottom-left-radius: 4px;
  }

  .input {
    display: flex;
    gap: 8px;
    padding: 12px;
    border-top: 1px solid #e5e7eb;
  }

  input {
    flex: 1;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #cbd5f5;
    outline: none;
  }

  button {
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    background: #2563eb;
    color: white;
    cursor: pointer;
  }

  button:disabled {
    background: #94a3b8;
  }
</style>

<div class="container">
  <div class="header">AI Customer Support</div>

  <div id="chat" class="chat">
    {#each messages as m}
      <div class="msg {m.sender}">
        {m.text}
      </div>
    {/each}

    {#if loading}
      <div class="msg ai">Agent is typing…</div>
    {/if}
  </div>

  <div class="input">
    <input
      bind:value={input}
      placeholder="Type your message…"
      on:keydown={(e) => e.key === "Enter" && sendMessage()}
    />
    <button on:click={sendMessage} disabled={loading}>
      Send
    </button>
  </div>
</div>
