import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import HealthArchiveView from '@/views/HealthArchiveView.vue'
import FollowUpView from '@/views/FollowUpView.vue'


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
      path: '/health-archive',
      name: 'health-archive',
      component: HealthArchiveView,
    },
    {
      path: '/follow-up',
      name: 'follow-up',
      component: FollowUpView,
    },
  ],
})

export default router
