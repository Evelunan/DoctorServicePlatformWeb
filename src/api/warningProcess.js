import httpInstance from '@/utils/http'

export const listWarningUsers = (pageNum, pageSize) => {
  return httpInstance.get('/warningProcess/listWarningUsers', {
    params: {
      pageNum,
      pageSize
    }
  })
}

export const getWarningInfo = (userId, pageNum, pageSize) => {
  return httpInstance.get(`/warningProcess/getWarningInfo/${userId}`, {
    params: {
      pageNum,
      pageSize
    }
  })
}

export const updatWarningInfo = (warningInfo) => {
  return httpInstance.put('/warningProcess/updateWarningInfo', warningInfo)
}
