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

// 获取随访通知
export const getNoticeAPI = () => {
  return httpInstance.get(`/followupPlan/getNotice`)
}

// 获取单个随访计划列表
export const getonePlansAPI = (id) => {
  return httpInstance.get(`/followupPlan/get/${id}`)
}

// 获取已完成的随访计划列表
export const getFollowUpCompletePlansAPI= () => {
  return httpInstance.get(`/followupPlan/getCompleteList`)
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
    url: '/followupHistory/add',
    method: 'POST',
    data
  })
}

// 获取随访记录
export const getFollowUpRecordsAPI = () => {
  return httpInstance({
    url: `/followupHistory/list`
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

// 删除随访计划
export const deleteFollowUpPlanAPI = (id) => {
  return httpInstance.delete(`/followupPlan/delete/${id}`)
}