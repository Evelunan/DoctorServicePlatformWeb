import axios from 'axios'
import { useUserStore } from '@/stores/user'

const httpInstance = axios.create({
  baseURL: '/api', // 统一前缀
  timeout: 5000
})

// 请求拦截器 - 添加token
httpInstance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    // 登录和注册接口不需要添加token
    const noAuthUrls = ['/api/user/login', '/api/user/register']
    const isNoAuthUrl = noAuthUrls.some(url => config.url.includes(url))

    if (userStore.token && !isNoAuthUrl) {
      config.headers.token = userStore.token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理token过期
httpInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.data?.code === 401) {
      // token过期或无效，清除用户信息
      const userStore = useUserStore()
      userStore.logout()
      // 跳转到登录页
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default httpInstance
