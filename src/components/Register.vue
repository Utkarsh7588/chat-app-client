<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Create Account</h1>
        <p>Join our chat community</p>
      </div>

      <form @submit.prevent="register" class="auth-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
            <input
              type="text"
              id="name"
              v-model="form.name"
              required
              placeholder="Enter your name"
              autocomplete="name"
              @input="validateName"
            />
          </div>
          <small v-if="errors.name" class="error-text">{{ errors.name }}</small>
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M10,5V7H12V17H10V19H14V17H12V7H14V5H10M12,1C14.76,1 17,3.24 17,6C17,8.76 14.76,11 12,11C9.24,11 7,8.76 7,6C7,3.24 9.24,1 12,1M12,3A3,3 0 0,0 9,6A3,3 0 0,0 12,9A3,3 0 0,0 15,6A3,3 0 0,0 12,3Z" />
            </svg>
            <input
              type="text"
              id="username"
              v-model="form.username"
              required
              placeholder="Choose a username"
              autocomplete="username"
              @input="validateUsername"
            />
          </div>
          <small class="hint">3-20 characters, letters, numbers, underscores only</small>
          <small v-if="errors.username" class="error-text">{{ errors.username }}</small>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z" />
            </svg>
            <input
              type="email"
              id="email"
              v-model="form.email"
              required
              placeholder="Enter your email"
              autocomplete="email"
              @input="validateEmail"
            />
          </div>
          <small v-if="errors.email" class="error-text">{{ errors.email }}</small>
        </div>

        <div class="form-group">
          <label for="age">Age</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
            </svg>
            <input
              type="number"
              id="age"
              v-model.number="form.age"
              required
              min="18"
              max="120"
              placeholder="Enter your age"
              @input="validateAge"
            />
          </div>
          <small v-if="errors.age" class="error-text">{{ errors.age }}</small>
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
              placeholder="Create a password"
              autocomplete="new-password"
              @input="validatePassword"
            />
            <button 
              type="button" 
              class="password-toggle"
              @click="togglePasswordVisibility('password')"
              aria-label="Toggle password visibility"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path v-if="showPassword.password" fill="currentColor" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
                <path v-else fill="currentColor" d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
              </svg>
            </button>
          </div>
          <small class="hint">Must be at least 8 characters with uppercase, lowercase, number, and special character</small>
          <small v-if="errors.password" class="error-text">{{ errors.password }}</small>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
            </svg>
            <input
              type="password"
              id="confirmPassword"
              v-model="form.confirmPassword"
              required
              placeholder="Confirm your password"
              autocomplete="new-password"
              @input="validatePasswordMatch"
            />
            <button 
              type="button" 
              class="password-toggle"
              @click="togglePasswordVisibility('confirmPassword')"
              aria-label="Toggle password visibility"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path v-if="showPassword.confirmPassword" fill="currentColor" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
                <path v-else fill="currentColor" d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
              </svg>
            </button>
          </div>
          <small v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</small>
        </div>

        <button 
          type="submit" 
          class="auth-button"
          :class="{ 'loading': loading }"
          :disabled="loading || !formIsValid"
        >
          <span v-if="!loading">Register</span>
          <span v-else class="loading-spinner"></span>
        </button>

        <div class="auth-footer">
          <p>Already have an account? <router-link to="/login">Log in</router-link></p>
        </div>

        <div v-if="serverError" class="error-message">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
          </svg>
          <span>{{ serverError }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      form: {
        name: '',
        username: '',
        email: '',
        age: null,
        password: '',
        confirmPassword: ''
      },
      errors: {
        name: '',
        username: '',
        email: '',
        age: '',
        password: '',
        confirmPassword: ''
      },
      loading: false,
      serverError: '',
      showPassword: {
        password: false,
        confirmPassword: false
      }
    }
  },
  computed: {
    formIsValid() {
      return (
        this.form.name &&
        this.form.username &&
        this.form.email &&
        this.form.age &&
        this.form.password &&
        this.form.confirmPassword &&
        !Object.values(this.errors).some(error => error)
      )
    }
  },
  methods: {
    togglePasswordVisibility(field) {
      this.showPassword[field] = !this.showPassword[field]
      const input = document.getElementById(field)
      if (input) {
        input.type = this.showPassword[field] ? 'text' : 'password'
      }
    },
    async register() {
      if (!this.formIsValid) return
      
      this.loading = true
      this.serverError = ''
      
      try {
        const response = await axios.post(`/api/register`, {
          name: this.form.name,
          username: this.form.username,
          password: this.form.password,
          email: this.form.email,
          age: this.form.age
        })
        
        this.$router.push('/login')
      } catch (err) {
        this.handleRegistrationError(err)
      } finally {
        this.loading = false
      }
    },
    handleRegistrationError(err) {
      if (err.response) {
        const { status, data } = err.response
        
        if (status === 409) {
          if (data.message.includes('Email')) {
            this.errors.email = data.message
          } else if (data.message.includes('Username')) {
            this.errors.username = data.message
          } else {
            this.serverError = data.message || 'Registration conflict occurred'
          }
        } else if (status === 400) {
          if (data.errors) {
            Object.keys(data.errors).forEach(field => {
              if (this.errors.hasOwnProperty(field)) {
                this.errors[field] = data.errors[field]
              }
            })
          } else {
            this.serverError = data.message || 'Invalid registration data'
          }
        } else {
          this.serverError = data.message || 'Registration failed. Please try again.'
        }
      } else {
        this.serverError = 'Network error. Please check your connection.'
      }
    },
    validateName() {
      if (!this.form.name.trim()) {
        this.errors.name = 'Name is required'
      } else if (this.form.name.length < 2) {
        this.errors.name = 'Name must be at least 2 characters'
      } else {
        this.errors.name = ''
      }
    },
    validateUsername() {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
      
      if (!this.form.username) {
        this.errors.username = 'Username is required'
      } else if (!usernameRegex.test(this.form.username)) {
        this.errors.username = '3-20 characters, letters, numbers, underscores only'
      } else {
        this.errors.username = ''
      }
    },
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.form.email) {
        this.errors.email = 'Email is required'
      } else if (!emailRegex.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email address'
      } else {
        this.errors.email = ''
      }
    },
    validateAge() {
      if (!this.form.age) {
        this.errors.age = 'Age is required'
      } else if (this.form.age < 18) {
        this.errors.age = 'You must be at least 18 years old'
      } else if (this.form.age > 120) {
        this.errors.age = 'Please enter a valid age'
      } else {
        this.errors.age = ''
      }
    },
    validatePassword() {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      
      if (!this.form.password) {
        this.errors.password = 'Password is required'
      } else if (!passwordRegex.test(this.form.password)) {
        this.errors.password = 'Password must contain uppercase, lowercase, number, and special character'
      } else {
        this.errors.password = ''
      }
      
      this.validatePasswordMatch()
    },
    validatePasswordMatch() {
      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = 'Please confirm your password'
      } else if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match'
      } else {
        this.errors.confirmPassword = ''
      }
    }
  }
}
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
  max-width: 480px;
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

.error-text {
  color: var(--error-color);
  font-size: 0.8125rem;
  margin-top: 0.25rem;
  display: block;
}

.hint {
  color: var(--text-light);
  font-size: 0.8125rem;
  margin-top: 0.25rem;
  display: block;
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
  opacity: 0.7;
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