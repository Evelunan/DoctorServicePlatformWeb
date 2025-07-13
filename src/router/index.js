import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import { useUserStore } from '@/stores/user'
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
      path: '/follow-up',
      name: 'follow-up',
      component: FollowUpView,
    },
  ],
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 如果访问登录或注册页面，直接放行
  if (to.path === '/login' || to.path === '/register') {
    next()
    return
  }

  // 检查是否有token
  if (!userStore.token) {
    next('/login')
    return
  }

  // 检查登录状态
  const isLoggedIn = await userStore.checkAuth()

  if (!isLoggedIn) {
    // 未登录，跳转到登录页
    next('/login')
  } else {
    // 已登录，放行
    next()
  }
})

export default router
