import httpInstance from '@/utils/http'

// 登录
export const login = (account, password) => {
  return httpInstance.post('/user/login', null, {
    params: { account, password }
  })
}

// 注册
export const register = (account, password) => {
  return httpInstance.post('/user/register', null, {
    params: { account, password }
  })
}

// 获取用户信息
export const getUser = (id) => {
  return httpInstance.get(`/user/getUser/${id}`)
}

// 更新用户信息
export const updateUser = (data) => {
  return httpInstance.put('/user/updateUser', data)
}


