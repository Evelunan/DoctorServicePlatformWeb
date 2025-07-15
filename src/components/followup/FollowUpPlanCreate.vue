<template>
  <el-form :model="plan" :rules="rules" ref="planFormRef" label-width="120px">
    <el-form-item label="老人选择" prop="elderId">
      <el-select v-model="plan.elderId" placeholder="请选择老人">
        <el-option v-for="item in patients" :key="item.id" :label="`${item.id} - ${item.username}`" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="随访预定时间" prop="planTime">
      <el-date-picker
        v-model="plan.planTime"
        type="date"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        placeholder="选择日期和时间"
      />
    </el-form-item>
    <el-form-item label="随访方式" prop="method">
      <el-select v-model="plan.method" placeholder="请选择随访方式">
        <el-option label="视频随访" value="视频随访" />
        <el-option label="电话随访" value="电话随访" />
        <el-option label="线下随访" value="线下随访" />
      </el-select>
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

import { ElMessage } from 'element-plus'

const emit = defineEmits(['plan-created'])
const planFormRef = ref(null)

const patients = ref([]) // This should be fetched from an API
const rules = {
  elderId: [{ required: true, message: '请选择老人', trigger: 'change' }],
  planTime: [{ required: true, message: '请选择随访预定时间', trigger: 'change' }],
  method: [{ required: true, message: '请选择随访方式', trigger: 'change' }]
}

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
  if (!planFormRef.value) return
  await planFormRef.value.validate(async (valid) => {
    if (valid) {
      const selectedPatient = patients.value.find(p => p.id === plan.value.elderId)
      if (selectedPatient) {
        plan.value.elderName = selectedPatient.username
      }
      await createFollowUpPlanAPI(plan.value)
      ElMessage.success('计划创建成功')
      emit('plan-created')
      // Reset form
      planFormRef.value.resetFields()
      plan.value.elderName = ''
      plan.value.notes = ''
      plan.value.priority = 2
    } else {
      ElMessage.error('请填写所有必填项')
    }
  })
}
</script>