import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getFollowUpRecordsAPI, getonePlansAPI } from '@/api/followup'
import { getUser } from '@/api/user'

export const useFollowUpStore = defineStore('followup', () => {
  const historyRecords = ref([])
  const recordsLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  const fetchFollowUpHistory = async () => {
    if (recordsLoaded.value) {
      return
    }
    isLoading.value = true
    error.value = null
    try {
      const res = await getFollowUpRecordsAPI()
      const records = res.data.data || []

      const enrichedRecords = await Promise.all(
        records.map(async (record) => {
          let doctorName = '未知'
          let elderName = '未知'

          if (record.planId) {
            try {
              const planRes = await getonePlansAPI(record.planId)
              const plan = planRes.data.data
              if (plan) {
                elderName = plan.elderName || '未知';
                record.method = plan.method;
                record.notes = plan.notes;
                if (plan.doctorId) {
                  try {
                    const userRes = await getUser(plan.doctorId)
                    if (userRes.data && userRes.data.data) {
                      doctorName = userRes.data.data.username || '未知'
                    }
                  } catch (error) {
                    console.error(`获取医生信息失败 for doctorId: ${plan.doctorId}`, error)
                  }
                }
              }
            } catch (error) {
              console.error(`获取计划信息失败 for planId: ${record.planId}`, error)
            }
          }

          return {
            ...record,
            doctorName,
            elderName
          }
        })
      )

      historyRecords.value = enrichedRecords
      recordsLoaded.value = true
    } catch (err) {
      console.error('获取随访历史记录失败', err)
      error.value = '获取随访历史记录失败，请稍后重试。'
    } finally {
      isLoading.value = false
    }
  }

  const getRecordById = (id) => {
    return historyRecords.value.find((record) => record.id === id)
  }

  return {
    historyRecords,
    recordsLoaded,
    isLoading,
    error,
    fetchFollowUpHistory,
    getRecordById
  }
})