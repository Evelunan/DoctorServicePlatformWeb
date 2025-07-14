<template>
  <el-form :model="record" label-width="120px">
    <el-form-item label="选择随访计划" required>
      <el-select v-model="record.planId" placeholder="请选择随访计划">
        <el-option v-for="item in completedPlans" :key="item.id" :label="`${item.id} - ${item.elderName}`" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="生活方式指导" required>
      <el-input type="textarea" v-model="record.lifeStyle" />
    </el-form-item>
    <el-form-item label="健康状况" required>
      <el-radio-group v-model="record.healthStatus">
        <el-radio :label="0">健康</el-radio>
        <el-radio :label="1">病情好转</el-radio>
        <el-radio :label="2">病况维持</el-radio>
        <el-radio :label="3">病情恶化</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="用药情况" required>
      <el-input type="textarea" v-model="record.medication" />
    </el-form-item>
    <el-form-item label="随访时间" required>
      <el-date-picker
        v-model="record.followupTime"
        type="date"
        placeholder="选择日期"
        value-format="YYYY-MM-DD">
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitRecord">提交记录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createFollowUpRecordAPI, getFollowUpCompletePlansAPI } from '@/api/followup'

const emit = defineEmits(['record-created'])

const completedPlans = ref([])
const record = ref({
  planId: null,
  lifeStyle: '',
  healthStatus: 0,
  medication: '',
  followupTime: ''
})

onMounted(async () => {
  try {
    const res = await getFollowUpCompletePlansAPI()
    completedPlans.value = res.data.data
  } catch (error) {
    console.error('获取已完成的随访计划失败', error)
  }
})

const handleFileUpload = (event) => {
  record.value.attachment = event.target.files[0]
}

const submitRecord = async () => {
  try {
    await createFollowUpRecordAPI(record.value)
    emit('record-created')
    // Reset form
    record.value = {
      planId: null,
      lifeStyle: '',
      healthStatus: 0,
      medication: '',
      followupTime: ''
    }
  } catch (error) {
    console.error('创建随访记录失败', error)
  }
}
</script>