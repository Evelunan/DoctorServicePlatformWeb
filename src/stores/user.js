import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCurrentUser } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  const isLoggedIn = ref(!!token.value)

  // 计算属性
  const userId = computed(() => userInfo.value?.id)
  const userName = computed(() => userInfo.value?.name || userInfo.value?.username)
  const userRole = computed(() => userInfo.value?.role)
  const isDoctor = computed(() => userInfo.value?.role === 'doctor')
  const isAdmin = computed(() => userInfo.value?.role === 'admin')

  // 设置用户信息
  const setUserInfo = (user) => {
    userInfo.value = user
  }

  // 设置token
  const setToken = (newToken) => {
    token.value = newToken
    isLoggedIn.value = true
    localStorage.setItem('token', newToken)
  }

  // 登录
  const login = (token) => {
    setToken(token)
    // 登录后立即获取用户信息
    fetchUserInfo()
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) return null

    try {
      const res = await getCurrentUser()
      if (res.data.code === 0) {
        setUserInfo(res.data.data)
        return res.data.data
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      logout()
    }
    return null
  }

  // 登出
  const logout = () => {
    userInfo.value = null
    token.value = ''
    isLoggedIn.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('rememberMe')
    localStorage.removeItem('account')
  }

  // 检查登录状态
  const checkAuth = async () => {
    if (token.value && !userInfo.value) {
      await fetchUserInfo()
    }
    return isLoggedIn.value
  }

  return {
    // 状态
    userInfo,
    token,
    isLoggedIn,

    // 计算属性
    userId,
    userName,
    userRole,
    isDoctor,
    isAdmin,

    // 方法
    setUserInfo,
    setToken,
    login,
    logout,
    fetchUserInfo,
    checkAuth
  }
})
