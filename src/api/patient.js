import httpInstance from '@/utils/http'

// 获取医生的病人列表
export const getPatientList = (params) => {
  return httpInstance.get(`/patient/list`, { params })
}

// 添加病人
export const addPatient = (data) => {
  return httpInstance.post('/patient/archive/add', data)
}

// 移除病人
export const removePatient = (patientId, doctorId) => {
  return httpInstance.delete(`/patient/archive/delete/${patientId}`, {
    params: { doctorId }
  })
}

// 获取病人健康档案
export const getPatientArchive = (patientId) => {
  return httpInstance.get(`/patient/archive/${patientId}`)
}

// 保存病人健康档案
export const savePatientArchive = (data) => {
  return httpInstance.post('/patient/archive/add', data)
}

// 更新病人健康档案
export const updatePatientArchive = (data) => {
  return httpInstance.put('/patient/archive/update', data)
}
