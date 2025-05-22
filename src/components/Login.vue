<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Welcome Back</h1>
        <p>Sign in to continue to your chat</p>
      </div>

      <form @submit.prevent="login" class="auth-form">
        <div class="form-group">
          <label for="usernameOrEmail">Email or username</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
            <input
              type="text"
              id="usernameOrEmail"
              v-model="form.usernameOrEmail"
              required
              placeholder="Enter email or username"
              autocomplete="username"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
            </svg>
            <input
              type="password"
              id="password"
              v-model="form.password"
              required
              placeholder="Enter your password"
              autocomplete="current-password"
            />
            <button 
              type="button" 
              class="password-toggle"
              @click="togglePasswordVisibility"
              aria-label="Toggle password visibility"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path v-if="showPassword" fill="currentColor" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
                <path v-else fill="currentColor" d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="form-options">
          <router-link to="/forgot-password" class="forgot-password">
            Forgot password?
          </router-link>
        </div>

        <button 
          type="submit" 
          class="auth-button"
          :class="{ 'loading': loading }"
          :disabled="loading"
        >
          <span v-if="!loading">Log In</span>
          <span v-else class="loading-spinner"></span>
        </button>

        <div class="auth-footer">
          <p>Don't have an account? <router-link to="/register">Register</router-link></p>
        </div>

        <div v-if="error" class="error-message">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
          </svg>
          <span>{{ error }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        usernameOrEmail: "",
        password: ""
      },
      loading: false,
      error: "",
      showPassword: false
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
      const passwordInput = document.getElementById('password');
      if (passwordInput) {
        passwordInput.type = this.showPassword ? 'text' : 'password';
      }
    },
    async login() {
      this.loading = true;
      this.error = "";

      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        this.form.usernameOrEmail
      );

      const payload = {
        password: this.form.password,
      };

      if (isEmail) {
        payload.email = this.form.usernameOrEmail;
      } else {
        payload.username = this.form.usernameOrEmail;
      }

      try {
        const response = await axios.post(`/api/login`, payload);

        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("email", response.data.email);

        this.$router.push("/");
      } catch (err) {
        this.error =
          err.response?.data?.message || "Login failed. Please try again.";
      } finally {
        this.loading = false;
      }
    }
  }
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

.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--bg-color);
  padding: 1rem;
}

.auth-container {
  width: 100%;
  max-width: 420px;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.auth-header {
  padding: 2rem 2rem 1rem;
  text-align: center;
}

.auth-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: var(--text-light);
  font-size: 0.9375rem;
}

.auth-form {
  padding: 1.5rem 2rem 2rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.9375rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  width: 20px;
  height: 20px;
  color: var(--text-light);
}

input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  transition: var(--transition);
  background-color: var(--bg-color);
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-light);
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--text-light);
  transition: var(--transition);
}

.password-toggle:hover {
  color: var(--primary-color);
}

.form-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.forgot-password {
  color: var(--primary-color);
  font-size: 0.875rem;
  text-decoration: none;
  transition: var(--transition);
}

.forgot-password:hover {
  text-decoration: underline;
}

.auth-button {
  width: 100%;
  padding: 1rem;
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
}

.auth-button:hover:not(:disabled) {
  background-color: var(--secondary-color);
}

.auth-button:disabled {
  background-color: var(--gray-medium);
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--white);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-light);
  font-size: 0.9375rem;
}

.auth-footer a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: var(--radius-md);
  color: var(--error-color);
  font-size: 0.875rem;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .auth-container {
    border-radius: var(--radius-md);
  }
  
  .auth-header {
    padding: 1.5rem 1.5rem 0.75rem;
  }
  
  .auth-form {
    padding: 1rem 1.5rem 1.5rem;
  }
  
  .auth-header h1 {
    font-size: 1.5rem;
  }
}
</style>