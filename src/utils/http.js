import axios from 'axios'

const httpInstance = axios.create({
  baseURL: '/api', // 统一前缀
  timeout: 5000
})

export default httpInstance
