<template>
  <el-form :model="plan" label-width="120px">
    <el-form-item label="老人选择" required>
      <el-select v-model="plan.patientId" placeholder="请选择老人">
        <el-option v-for="item in patients" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="随访预定时间" required>
      <el-date-picker
        v-model="plan.followUpTime"
        type="datetime"
        placeholder="选择日期和时间"
      />
    </el-form-item>
    <el-form-item label="随访方式" required>
      <el-input v-model="plan.followUpMethod" />
    </el-form-item>
    <el-form-item label="计划内容" required>
      <el-input type="textarea" v-model="plan.followUpContent" />
    </el-form-item>
    <el-form-item label="优先级" required>
      <el-radio-group v-model="plan.priority">
        <el-radio :label="1">最高</el-radio>
        <el-radio :label="2">较高</el-radio>
        <el-radio :label="3">正常</el-radio>
        <el-radio :label="4">较低</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitPlan">创建计划</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import { createFollowUpPlanAPI } from '@/api/followup'

const emit = defineEmits(['plan-created'])

const patients = ref([]) // This should be fetched from an API
const plan = ref({
  patientId: '',
  followUpTime: '',
  followUpMethod: '',
  followUpContent: '',
  priority: 3
})

onMounted(() => {
  // Mock patient data
  patients.value = [
    { id: '1', name: '张三' },
    { id: '2', name: '李四' },
  ]
})

const submitPlan = async () => {
  // await createFollowUpPlanAPI(plan.value)
  console.log('Mock submit plan:', plan.value)
  emit('plan-created')
  // Reset form
  plan.value.followUpTime = ''
  plan.value.followUpMethod = ''
  plan.value.followUpContent = ''
  plan.value.priority = 3
}
</script>