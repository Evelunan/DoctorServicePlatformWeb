import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getFollowUpRecordsAPI, getonePlansAPI, createFollowUpRecordAPI, updateFollowUpPlanAPI } from '@/api/followup'
import { getUser } from '@/api/user'

export const useFollowUpStore = defineStore('followup', () => {
  const historyRecords = ref([])
  const recordsLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  const fetchFollowUpHistory = async () => {
    console.log('Fetching follow-up history...')
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
            elderName,
            remark: record.remark
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

  const createFollowUpRecord = async (recordData) => {
    isLoading.value = true
    error.value = null
    try {
      // 1. Create the record and get the new record from the API response
      const res = await createFollowUpRecordAPI(recordData)
      const newRecord = res.data.data // Assuming the API returns the created record with its new ID

      // 2. Enrich the new record with names and other details locally
      let doctorName = '未知'
      let elderName = '未知'
      let method = ''
      let notes = ''

      if (newRecord.planId) {
        try {
          const planRes = await getonePlansAPI(newRecord.planId)
          const plan = planRes.data.data
          if (plan) {
            elderName = plan.elderName || '未知'
            method = plan.method
            notes = plan.notes
            if (plan.doctorId) {
              try {
                const userRes = await getUser(plan.doctorId)
                if (userRes.data && userRes.data.data) {
                  doctorName = userRes.data.data.username || '未知'
                }
              } catch (userError) {
                console.error(`获取医生信息失败 for doctorId: ${plan.doctorId}`, userError)
              }
            }
            // Update plan status
            plan.status = 3 // 3 represents 'recorded'
            await updateFollowUpPlanAPI(plan)
          }
        } catch (planError) {
          console.error(`获取或更新计划信息失败 for planId: ${newRecord.planId}`, planError)
        }
      }

      const enrichedNewRecord = {
        ...newRecord,
        doctorName,
        elderName,
        method,
        notes,
        remark: newRecord.remark
      }

      // 3. Add the new, enriched record to the end of the local list
      historyRecords.value.push(enrichedNewRecord)

    } catch (err) {
      // Log the error for debugging but don't re-throw it.
      // This prevents the UI from showing a failure message if the core creation was successful
      // but a subsequent enrichment step (like fetching doctor name) failed.
      console.error('创建随访记录或补充信息时出错', err)
      // Optionally, you could set a non-critical error message.
      error.value = '记录已创建，但部分信息可能未能完全加载。'
    } finally {
      isLoading.value = false
    }
  }

  return {
    historyRecords,
    recordsLoaded,
    isLoading,
    error,
    fetchFollowUpHistory,
    getRecordById,
    createFollowUpRecord
  }
})