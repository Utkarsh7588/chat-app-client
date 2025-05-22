<template>
  <div class="groups-page">
    <div class="groups-container">
      <div class="groups-header">
        <h1>General Chat Rooms</h1>
        <p>Join a conversation with like-minded people</p>
      </div>

      <div class="groups-list">
        <div
          v-for="group in groups"
          :key="group.id"
          class="group-card"
          @click="joinGroup(group.id)"
        >
          <div
            class="group-avatar"
            :style="{ backgroundColor: stringToColor(group.name) }"
          >
            {{ group.name.charAt(0).toUpperCase() }}
          </div>
          <div class="group-info">
            <h3>{{ group.name }}</h3>
            <p>{{ group.description }}</p>
            <!-- <div class="group-meta">
              <span>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                </svg>
                {{ group.memberCount }} active
              </span>
            </div> -->
          </div>
          <div class="group-actions">
            <button class="join-button">
              Join
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      groups: [
        {
          id: 1,
          name: "General Chat",
          description: "For everyday conversations and casual talk",
          memberCount: 124,
          icon: "💬",
        },
        {
          id: 2,
          name: "Tech Talk",
          description: "Discuss technology, programming, and gadgets",
          memberCount: 89,
          icon: "💻",
        },
        {
          id: 3,
          name: "Gaming",
          description: "Video games, esports, and gaming culture",
          memberCount: 156,
          icon: "🎮",
        },
        {
          id: 4,
          name: "Movies & TV",
          description: "Talk about films, series, and entertainment",
          memberCount: 72,
          icon: "🎬",
        },
        {
          id: 5,
          name: "Music Lovers",
          description: "Share and discuss your favorite music",
          memberCount: 98,
          icon: "🎵",
        },
        {
          id: 5,
          name: "Book Club",
          description: "Literature discussions and recommendations",
          memberCount: 53,
          icon: "📚",
        },
        {
          id: 6,
          name: "Sports",
          description: "All things sports and athletics",
          memberCount: 112,
          icon: "⚽",
        },
        {
          id: 7,
          name: "Food & Cooking",
          description: "Recipes, restaurants, and culinary adventures",
          memberCount: 67,
          icon: "🍳",
        },
      ],
    };
  },
  async mounted() {
    await this.getUserData();
  },
  methods: {
    joinGroup(groupId) {
      this.$router.push(`/chat/${groupId}`);
    },
    async getUserData() {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get("/api/user-info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.setItem("user_id", response.data.id);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("email", response.data.email);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // Token is invalid or expired - redirect to login
          this.$router.push("/login");
        } else {
          console.error("Error fetching user data:", error);
        }
      }
    },
    stringToColor(str) {
      // Simple hash function to generate consistent colors from strings
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = Math.abs(hash % 360);
      return `hsl(${hue}, 70%, 65%)`;
    },
  },
};
</script>

<style scoped>
:root {
  --primary-color: #4361ee;
  --primary-light: #e0e7ff;
  --secondary-color: #3f37c9;
  --text-color: #2b2d42;
  --text-light: #8d99ae;
  --bg-color: #f8f9fa;
  --white: #ffffff;
  --gray-light: #e9ecef;
  --gray-medium: #ced4da;
  --success-color: #4caf50;
  --error-color: #f44336;
  --warning-color: #ff9800;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --transition: all 0.2s ease;
}

.groups-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--bg-color);
  padding: 1rem;
}

.groups-container {
  width: 100%;
  max-width: 800px;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.groups-header {
  padding: 2rem 2rem 1rem;
  text-align: center;
  border-bottom: 1px solid var(--gray-light);
}

.groups-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.groups-header p {
  color: var(--text-light);
  font-size: 0.9375rem;
}

.groups-list {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}

.group-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--gray-light);
  transition: var(--transition);
  cursor: pointer;
  background-color: var(--white);
}

.group-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
  border-color: var(--primary-light);
}

.group-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.group-info {
  flex-grow: 1;
  min-width: 0;
}

.group-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.group-info p {
  font-size: 0.8125rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.group-meta {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-light);
}

.group-meta svg {
  margin-right: 0.25rem;
}

.group-actions {
  margin-left: 0.5rem;
}

.join-button {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.join-button svg {
  margin-left: 0.25rem;
}

.join-button:hover {
  background-color: var(--secondary-color);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .groups-list {
    grid-template-columns: 1fr;
  }

  .groups-header {
    padding: 1.5rem 1rem 1rem;
  }
}
</style>