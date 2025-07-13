import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import TestView from '@/views/TestView.vue'
import DebugView from '@/views/DebugView.vue'
import HealthArchiveView from '@/views/HealthArchiveView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/test',
      name: 'test',
      component: TestView,
    },
    {
      path: '/debug',
      name: 'debug',
      component: DebugView,
    },
    {
      path: '/health-archive',
      name: 'health-archive',
      component: HealthArchiveView,
    },
  ],
})

export default router
