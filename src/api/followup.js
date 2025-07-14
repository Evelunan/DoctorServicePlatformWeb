import httpInstance from '@/utils/http'

// 创建随访计划
export const createFollowUpPlanAPI = (data) => {
  return httpInstance({
    url: '/followupPlan/add',
    method: 'POST',
    data
  })
}

// 获取随访计划列表
export const getFollowUpPlansAPI = () => {
  return httpInstance.get(`/followupPlan/list`)
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

// 更新随访计划
export const updateFollowUpPlanAPI = (data) => {
  return httpInstance({
    url: `/followupPlan/update`,
    method: 'PUT',
    data
  })
}