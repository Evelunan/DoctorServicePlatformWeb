import httpInstance from '@/utils/http'

export const listWarningUsers = () => {
  return httpInstance.get('/warningProcess/listWarningUsers')
}

export const getWarningInfo = (userId) => {
  return httpInstance.get(`/warningProcess/getWarningInfo/${userId}`)
}

export const updatWarningInfo = (warningInfo) => {
  return httpInstance.put('/warningProcess/updateWarningInfo', warningInfo)
}
