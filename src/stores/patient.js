import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePatientStore = defineStore('patient', () => {
  const currentPatient = ref(null)
  const patientList = ref([])

  // 设置当前病人
  const setCurrentPatient = (patient) => {
    currentPatient.value = patient
  }

  // 设置病人列表
  const setPatientList = (list) => {
    patientList.value = list
  }

  // 添加病人到列表
  const addPatientToList = (patient) => {
    patientList.value.push(patient)
  }

  // 从列表中移除病人
  const removePatientFromList = (patientId) => {
    const index = patientList.value.findIndex(p => p.id === patientId)
    if (index > -1) {
      patientList.value.splice(index, 1)
    }
  }

  // 清空当前病人
  const clearCurrentPatient = () => {
    currentPatient.value = null
  }

  return {
    currentPatient,
    patientList,
    setCurrentPatient,
    setPatientList,
    addPatientToList,
    removePatientFromList,
    clearCurrentPatient
  }
})
