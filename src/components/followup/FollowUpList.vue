<template>
  <el-table :data="plans" style="width: 100%">
    <el-table-column prop="followUpTime" label="随访时间" width="180">
      <template #default="scope">
        {{ new Date(scope.row.followUpTime).toLocaleString() }}
      </template>
    </el-table-column>
    <el-table-column prop="followUpMethod" label="随访方式" width="180" />
    <el-table-column prop="followUpContent" label="随访内容" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" @click="sendReminder(scope.row.id)">发送提醒</el-button>
        <el-button size="small" type="primary" @click="$emit('select-plan', scope.row.id)">填写记录</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFollowUpPlansAPI, sendFollowUpReminderAPI } from '@/api/followup'

const props = defineProps({ patientId: String })

const plans = ref([])

const fetchPlans = async () => {
  const response = await getFollowUpPlansAPI(props.patientId)
  plans.value = response.data
}

const sendReminder = async (planId) => {
  await sendFollowUpReminderAPI(planId)
  alert('提醒已发送')
}

onMounted(fetchPlans)
</script>