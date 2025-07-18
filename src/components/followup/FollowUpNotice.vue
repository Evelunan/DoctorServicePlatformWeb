<template>
  <div class="follow-up-notice">
    <h2>随访通知</h2>
    <el-timeline>
      <el-timeline-item
        v-for="(notice, index) in notices"
        :key="index"
        :timestamp="notice.timestamp"
        placement="top"
        :type="getPriorityType(notice.priority)"
      >
        <el-card>
          <h4>{{ notice.title }}</h4>
          <p>{{ notice.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getNoticeAPI } from '@/api/followup'
import { ElMessage } from 'element-plus'

const notices = ref([])

const getPriorityType = (priority) => {
  switch (priority) {
    case 0:
      return 'danger'
    case 1:
      return 'warning'
    case 2:
      return 'primary'
    case 3:
      return 'info'
    default:
      return 'info'
  }
}

const getPriorityText = (priority) => {
  switch (priority) {
    case 0:
      return '紧急'
    case 1:
      return '重要'
    case 2:
      return '一般'
    case 3:
      return '提醒'
    default:
      return '未知'
  }
}

const fetchFollowUpNotices = async () => {
  try {
    const res = await getNoticeAPI()
    if (res.data.code === 0) {
      notices.value = res.data.data.map(plan => ({
        timestamp: plan.planTime,
        title: `【${getPriorityText(plan.priority)}】`,
        content: `医生 ${plan.doctorName} 会以 ${plan.method} 的方式来对您进行随访。`,
        priority: plan.priority
      }))
    } else {
      ElMessage.error('获取随访通知失败')
    }
  } catch (error) {
    console.error('获取随访通知时出错:', error)
    ElMessage.error('获取随访通知时出错')
  }
}

onMounted(() => {
  fetchFollowUpNotices()
})
</script>

<style scoped>
.follow-up-notice {
  padding: 20px;
}
</style>