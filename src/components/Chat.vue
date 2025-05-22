<template>
  <div id="app">
    <div class="chat-header">
      <h1>WebSocket Chat</h1>
      <div class="status-indicator" :class="connectionStatus">
        <span class="status-icon">
          <template v-if="connectionStatus === 'connected'">✓</template>
          <template v-else-if="connectionStatus === 'disconnected'">↻</template>
          <template v-else>⚠</template>
        </span>
        {{ connectionStatusText }}
      </div>
    </div>

    <div class="chat-container">
      <div class="messages-container" ref="messagesContainer">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message-wrapper"
        >
          <!-- System messages (JOIN/LEAVE) -->
          <div
            v-if="msg.type === 'JOIN' || msg.type === 'LEAVE'"
            class="system-message"
          >
            <span class="system-message-text">
              {{ msg.username }}
              {{ msg.type === "JOIN" ? "joined" : "left" }} the chat
            </span>
          </div>

          <!-- Regular chat messages -->
          <div
            v-else-if="msg.type === 'CHAT'"
            class="message-bubble"
            :class="{
              sent: isMyMessage(msg),
              received: !isMyMessage(msg),
            }"
          >
            <div class="message-meta">
              <span class="message-sender" v-if="!isMyMessage(msg)">
                {{ msg.username || "Anonymous" }}
              </span>
              <span class="message-sender-white" v-else > You</span>
              <span class="message-time">
                {{ formatTime(msg.timestamp) }}
              </span>
              
            </div>
            <div class="message-content">{{ msg.content }}</div>
          </div>
        </div>

        <!-- Typing indicators -->
        <div v-if="typingUsers.length > 0" class="typing-indicator">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="typing-text">
            <span v-if="typingUsers.length === 1"
              >{{ typingUsers[0] }} is typing</span
            >
            <span v-else-if="typingUsers.length === 2"
              >{{ typingUsers.join(" and ") }} are typing</span
            >
            <span v-else
              >{{ typingUsers[0] }} and {{ typingUsers.length - 1 }} others are
              typing</span
            >
          </span>
        </div>
      </div>

      <div class="input-area">
        <input
          v-model="message"
          @keyup.enter="sendMessage"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          placeholder="Type a message..."
          :disabled="!isConnected"
          ref="messageInput"
        />
        <button
          class="send-button"
          @click="sendMessage"
          :disabled="!isConnected || !message.trim()"
          aria-label="Send message"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Client } from "@stomp/stompjs";

export default {
  name: "App",
  data() {
    return {
      message: "",
      messages: [],
      stompClient: null,
      connectionStatus: null,
      connectionStatusText: "Connecting...",
      isConnected: false,
      userId: null,
      groupId: "",
      typingUsers: [],
      typingTimeouts: {},
      isTyping: false,
      typingDebounce: null,
      scrollObserver: null,
    };
  },
  mounted() {
    this.initializeWebSocket();
    this.setupScrollObserver();
  },
  beforeDestroy() {
    this.disconnectWebSocket();
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
  },
  methods: {
    initializeWebSocket() {
      this.userId = localStorage.getItem("user_id");
      this.groupId=this.$route.params.groupId;
      const token = localStorage.getItem("authToken");

      if (!this.userId || !token) {
        this.handleUnauthorized();
        return;
      }

      const wsUrl = `ws://192.168.1.36:8080/ws-chat?token=${token}&groupId=${this.groupId}`;
      const socket = new WebSocket(wsUrl);

      socket.onerror = (error) => {
        this.handleDisconnect();
        if (error.type === "error" || !socket.OPEN) {
          this.handleUnauthorized();
        }
      };

      socket.onclose = (event) => {
        if (event.code === 1006) this.handleUnauthorized();
        this.handleDisconnect();
      };

      this.stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
          "X-Device-Type": "web",
          "heart-beat": "10000,10000",
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,

        onConnect: () => {
          this.connectionStatus = "connected";
          this.connectionStatusText = "Connected";
          this.isConnected = true;

          this.stompClient.subscribe(`/topic/${this.groupId}`, (msg) => {
            this.handleIncomingMessage(msg);
          });

          // Load previous messages if needed
          // this.loadPreviousMessages();
        },

        onStompError: (frame) => {
          if (frame.headers?.message?.includes("Unauthorized")) {
            this.handleUnauthorized();
          }
          this.handleDisconnect();
        },

        onWebSocketError: (error) => {
          this.handleUnauthorized();
          this.handleDisconnect();
        },
      });

      this.stompClient.activate();
    },

    setupScrollObserver() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          this.scrollObserver = new MutationObserver(() => {
            this.scrollToBottom();
          });
          this.scrollObserver.observe(container, {
            childList: true,
            subtree: true,
          });
        }
      });
    },

    handleDisconnect() {
      this.connectionStatus = "disconnected";
      this.connectionStatusText = "Disconnected - Reconnecting...";
      this.isConnected = false;
    },

    handleIncomingMessage(msg) {
      try {
        const message = JSON.parse(msg.body);

        // Handle different message types
        if (message.type === "TYPING"&&message.userId!=this.userId) {
          this.handleTyping(message);
          return;
        }

        if (message.type === "NOTYPING") {
          this.handleNotTyping(message.username);
          return;
        }

        // Add timestamp if not present
        message.timestamp = message.timestamp || new Date().toISOString();
        this.messages.push(message);
      } catch (e) {
        console.error("Error parsing message:", e);
      }
    },

    handleTyping(message) {
      // Don't show typing indicator for self
      if (message.userId === this.userId) return;

      // Clear any existing timeout for this user
      if (this.typingTimeouts[message.userId]) {
        clearTimeout(this.typingTimeouts[message.userId]);
      }

      // Add user to typing list if not already there
      if (!this.typingUsers.includes(message.username)) {
        this.typingUsers.push(message.username);
      }

      // Set timeout to remove typing indicator after 3 seconds of inactivity
      this.typingTimeouts[message.userId] = setTimeout(() => {
        this.handleNotTyping(message.username);
      }, 3000);
    },

    handleNotTyping(username) {
      this.typingUsers = this.typingUsers.filter((u) => u !== username);
      const userId = Object.keys(this.typingTimeouts).find((key) =>
        this.messages.find((m) => m.username === username && m.userId === key)
      );

      if (userId && this.typingTimeouts[userId]) {
        clearTimeout(this.typingTimeouts[userId]);
        delete this.typingTimeouts[userId];
      }
    },

    handleInput() {
      if (!this.isTyping && this.message.trim()) {
        this.sendTyping();
        this.isTyping = true;
      }

      clearTimeout(this.typingDebounce);
      this.typingDebounce = setTimeout(() => {
        this.sendNotTyping();
        this.isTyping = false;
      }, 1000);
    },
    handleFocus() {
      if (this.message.trim()) {
        this.sendTyping();
        this.isTyping = true;
      }
    },

    handleBlur() {
      this.sendNotTyping();
      this.isTyping = false;
      clearTimeout(this.typingDebounce);
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

    handleUnauthorized() {
      this.connectionStatus = "error";
      this.connectionStatusText = "Session expired - redirecting to login";
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setTimeout(() => this.$router.push("/login"), 2000);
    },

    isMyMessage(msg) {
      return msg.userId == this.userId;
    },

    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    sendMessage() {
      if (!this.message.trim() || !this.isConnected) return;

      const chatMessage = {
        content: this.message,
        groupId: this.groupId,
        type: "CHAT",
        userId: this.userId,
        username: localStorage.getItem("username") || "User",
        timestamp: new Date().toISOString(),
      };

      this.stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(chatMessage),
      });

      this.message = "";
      this.sendNotTyping();
      this.isTyping = false;
      this.$refs.messageInput.focus();
    },

    sendTyping() {
      if (!this.isConnected) return;

      const msg = {
        type: "TYPING",
        userId: this.userId,
        username: localStorage.getItem("username") || "User",
        groupId: this.groupId,
      };

      this.stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(msg),
      });
    },

    sendNotTyping() {
      if (!this.isConnected) return;

      const msg = {
        type: "NOTYPING",
        userId: this.userId,
        groupId: this.groupId,
      };

      this.stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(msg),
      });
    },

    // toggleEmojiPicker() {
    //   // Placeholder for emoji picker functionality
    //   console.log("Emoji picker would open here");
    // },

    disconnectWebSocket() {
      if (this.stompClient) {
        this.stompClient.deactivate();
      }
    },
  },
};
</script>

<style scoped>

#app{
  height: 100vh;
}
.chat-header {
  padding: 1rem 1.5rem;
  background-color: var(--white);
  box-shadow: var(--shadow-sm);
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
}

.status-indicator.connected {
  color: var(--success-color);
  background-color: rgba(76, 175, 80, 0.1);
}

.status-indicator.disconnected {
  color: var(--warning-color);
  background-color: rgba(255, 152, 0, 0.1);
}

.status-indicator.error {
  color: var(--error-color);
  background-color: rgba(244, 67, 54, 0.1);
}

.status-icon {
  font-size: 0.75rem;
}

.chat-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  padding: 1rem 1.5rem;
  overflow-y: auto;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Custom scrollbar */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: var(--gray-light);
}

.messages-container::-webkit-scrollbar-thumb {
  background: var(--gray-medium);
  border-radius: 3px;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
}

.system-message {
  align-self: center;
  margin: 0.5rem 0;
}

.system-message-text {
  font-size: 0.75rem;
  color: var(--text-light);
  background-color: var(--gray-light);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.message-bubble {
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  line-height: 1.4;
  word-break: break-word;
  animation: fadeIn 0.2s ease-out;
  box-shadow: var(--shadow-sm);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-bubble.sent {
  align-self: flex-end;
  background-color: var(--primary-color);
  color: var(--white);
  border-bottom-right-radius: var(--radius-sm);
}

.message-bubble.received {
  align-self: flex-start;
  background-color: var(--white);
  border: 1px solid var(--gray-light);
  border-bottom-left-radius: var(--radius-sm);
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
}

.message-sender {
  margin-right: 5px;
  font-weight: 600;
  color: var(--secondary-color);
}
.message-sender-white{
    margin-right: 5px;
  font-weight: 600;
  color: var(--white);
}
.sent .message-meta {
  color: rgba(255, 255, 255, 0.8);
}

.received .message-meta {
  color: var(--text-light);
}

.message-time {
  opacity: 0.8;
}

.message-content {
  font-size: 0.9375rem;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  align-self: flex-start;
  margin-top: 0.5rem;
  animation: fadeIn 0.2s ease-out;
}

.typing-dots {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  height: 1rem;
}

.typing-dots span {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--text-light);
  animation: typingAnimation 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) {
  animation-delay: 0s;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingAnimation {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

.typing-text {
  font-size: 0.8125rem;
  color: var(--text-light);
}

.input-area {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background-color: var(--white);
  border-top: 1px solid var(--gray-light);
}

.emoji-button {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-light);
  transition: var(--transition);
}

.emoji-button:hover {
  color: var(--primary-color);
  transform: scale(1.1);
}

.input-area input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--radius-lg);
  font-size: 0.9375rem;
  transition: var(--transition);
  background-color: var(--bg-color);
}

.input-area input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-light);
}

.send-button {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

.send-button:disabled {
  background-color: var(--gray-medium);
  cursor: not-allowed;
  opacity: 0.7;
}

.send-button:not(:disabled):hover {
  background-color: var(--secondary-color);
  transform: scale(1.05);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .chat-header {
    padding: 0.75rem 1rem;
  }

  .messages-container {
    padding: 0.75rem 1rem;
  }

  .message-bubble {
    max-width: 90%;
    padding: 0.625rem 0.875rem;
  }

  .input-area {
    padding: 0.75rem 1rem;
  }

  .input-area input {
    padding: 0.625rem 0.875rem;
  }
}
</style>