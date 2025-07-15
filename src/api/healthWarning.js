import httpInstance from '@/utils/http'

export const getBaseWarningRules = () => {
  return httpInstance.get('/healthWarning/baseList')
}
export const getDiseaseList = () => {
  return httpInstance.get('/healthWarning/diseaseList')
}
export const getFamilyList = () => {
  return httpInstance.get('/healthWarning/familyList')
}

export const saveWarningRulesAPI = (data) => {
  return httpInstance.post('/healthWarning/save', data)
}

export const deleteWarningRulesAPI = (id) => {
  return httpInstance.delete(`/healthWarning/delete/${id}`)
}

