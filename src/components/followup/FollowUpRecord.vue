<template>
  <el-form :model="record" label-width="120px">
    <!-- <el-form-item label="医生选择" required>
      <el-select v-model="record.doctorId" placeholder="请选择医生">
        <el-option v-for="item in doctors" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item> -->
    <el-form-item label="老人选择" required>
      <el-select v-model="record.patientId" placeholder="请选择老人">
        <el-option v-for="item in patients" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="生活习惯" required>
      <el-input type="textarea" v-model="record.lifestyle" />
    </el-form-item>
    <el-form-item label="健康状况" required>
      <el-radio-group v-model="record.healthStatus">
        <el-radio :label="0">健康</el-radio>
        <el-radio :label="1">病情好转</el-radio>
        <el-radio :label="2">病情稳定</el-radio>
        <el-radio :label="3">病情恶化</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="用药依从性" required>
      <el-input type="textarea" v-model="record.medicationAdherence" />
    </el-form-item>
    <el-form-item label="随访实际时间" required>
      <el-date-picker
        v-model="record.actualFollowUpTime"
        type="datetime"
        placeholder="选择日期和时间"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitRecord">提交记录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createFollowUpRecordAPI } from '@/api/followup'

const emit = defineEmits(['record-created'])

const doctors = ref([]) // This should be fetched from an API
const patients = ref([]) // This should be fetched from an API
const record = ref({
  doctorId: '',
  patientId: '',
  lifestyle: '',
  healthStatus: 0,
  medicationAdherence: '',
  actualFollowUpTime: ''
})

onMounted(() => {
  // Mock data
  doctors.value = [
    { id: '1', name: '王医生' },
    { id: '2', name: '刘医生' },
  ]
  patients.value = [
    { id: '1', name: '张三' },
    { id: '2', name: '李四' },
  ]
})

const handleFileUpload = (event) => {
  record.value.attachment = event.target.files[0]
}

const submitRecord = async () => {
  const formData = new FormData()
  for (const key in record.value) {
    formData.append(key, record.value[key])
  }
  await createFollowUpRecordAPI(formData)
  emit('record-created')
  // Reset form
  record.value.healthStatus = ''
  record.value.lifestyle = ''
  record.value.medicationAdherence = ''
  record.value.attachment = null
}
</script>