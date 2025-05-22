// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.BASE_URL
})

export default {
  register(userData) {
    return api.post('/auth/register', userData)
  },
  login(credentials) {
    return api.post('/auth/login', credentials)
  },
  // Add other API calls here
}