import httpInstance from '@/utils/http'

export const getBaseWarningRules = () => {
  return httpInstance.get('/healthWarning/baseList')
}
export const getDiseaseList = (params) => {
  return httpInstance.get('/healthWarning/diseaseList', { params })
}
export const getFamilyList = (params) => {
  return httpInstance.get('/healthWarning/familyList', { params })
}

export const saveWarningRulesAPI = (data) => {
  return httpInstance.post('/healthWarning/save', data)
}

export const deleteWarningRulesAPI = (id) => {
  return httpInstance.delete(`/healthWarning/delete/${id}`)
}

