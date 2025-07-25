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
//修改密码
export const updatePassword = (data) =>{
  return httpInstance.put('/user/updatePassword', null, { params: data })
}
// 获取当前用户信息（根据token获取）
export const getCurrentUser = () => {
  return httpInstance.get('/user/getCurrentUser')
}

// 更新用户信息
export const updateUser = (data) => {
  return httpInstance.put('/user/updateUser', data)
}

// 获取所有医生列表
export const getAllDoctor = () => {
  return httpInstance.get('/user/getAllDoctor')
}

// 获取某个用户（根据token获取）
export const getUser = (id) => {
  return httpInstance.get(`/user/getUser/${id}`)
}



