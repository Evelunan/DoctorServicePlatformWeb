import httpInstance from '@/utils/http'

// 创建随访计划
export const createFollowUpPlanAPI = (data) => {
  return httpInstance({
    url: '/followup/plan',
    method: 'POST',
    data
  })
}

// 获取随访计划列表
export const getFollowUpPlansAPI = (patientId) => {
  return httpInstance({
    url: `/followup/plans/${patientId}`
  })
}

// 发送随访提醒
export const sendFollowUpReminderAPI = (planId) => {
  return httpInstance({
    url: `/followup/reminder/${planId}`,
    method: 'POST'
  })
}

// 记录随访结果
export const createFollowUpRecordAPI = (data) => {
  return httpInstance({
    url: '/followup/record',
    method: 'POST',
    data
  })
}

// 获取随访记录
export const getFollowUpRecordsAPI = (patientId) => {
  return httpInstance({
    url: `/followup/records/${patientId}`
  })
}