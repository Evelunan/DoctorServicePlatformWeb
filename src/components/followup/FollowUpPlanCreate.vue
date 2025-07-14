<template>
  <el-form :model="plan" label-width="120px">
    <el-form-item label="老人选择" required>
      <el-select v-model="plan.elderId" placeholder="请选择老人">
        <el-option v-for="item in patients" :key="item.id" :label="`${item.id} - ${item.username}`" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="随访预定时间" required>
      <el-date-picker
        v-model="plan.planTime"
        type="date"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        placeholder="选择日期和时间"
      />
    </el-form-item>
    <el-form-item label="随访方式" required>
      <el-input v-model="plan.method" />
    </el-form-item>
    <el-form-item label="计划内容" required>
      <el-input type="textarea" v-model="plan.notes" />
    </el-form-item>
    <el-form-item label="优先级" required>
      <el-radio-group v-model="plan.priority">
        <el-radio :label="0">最高</el-radio>
        <el-radio :label="1">较高</el-radio>
        <el-radio :label="2">正常</el-radio>
        <el-radio :label="3">较低</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitPlan">创建计划</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPatientList } from '@/api/patient'
import { createFollowUpPlanAPI } from '@/api/followup'

const emit = defineEmits(['plan-created'])

const patients = ref([]) // This should be fetched from an API
const plan = ref({
  elderId: '',
  elderName: '',
  planTime: '',
  method: '',
  notes: '',
  priority: 2, //默认优先级正常
  status: 0 // 默认状态为0，表示计划刚创建还未执行
})

onMounted(async () => {
  const res = await getPatientList()
  patients.value = res.data.data
})

const submitPlan = async () => {
  const selectedPatient = patients.value.find(p => p.id === plan.value.elderId)
  if (selectedPatient) {
    plan.value.elderName = selectedPatient.username
  }
  await createFollowUpPlanAPI(plan.value)
  emit('plan-created')
  // Reset form
  plan.value.elderId = ''
  plan.value.elderName = ''
  plan.value.planTime = ''
  plan.value.method = ''
  plan.value.notes = ''
  plan.value.priority = 2
}
</script>