// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Chat from '../components/Chat.vue'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'// Renamed to match component
import Groups from '../components/Groups.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/chat/:groupId',
      name: 'chat',
      component: Chat
    },
    {
      path: '/',
      name: 'groups',
      component: Groups
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

export default router