<template>
  <el-form :model="record" :rules="rules" ref="form" label-width="120px">
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
    <el-form-item label="随访时间" prop="followupTime">
      <el-date-picker
        v-model="record.followupTime"
        type="date"
        placeholder="选择日期"
        value-format="YYYY-MM-DD">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="备注">
      <el-input type="textarea" v-model="record.remark" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitRecord" :loading="isSubmitting" :disabled="isSubmitting">提交记录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getFollowUpCompletePlansAPI } from '@/api/followup'
import { useFollowUpStore } from '@/stores/followup'

const emit = defineEmits(['record-created', 'switch-tab'])
const followUpStore = useFollowUpStore()

const form = ref(null)
const isSubmitting = ref(false)
const completedPlans = ref([])
const record = ref({
  planId: null,
  lifeStyle: '',
  healthStatus: 0,
  medication: '',
  followupTime: '',
  remark: ''
})

const rules = {
  planId: [{ required: true, message: '请选择随访计划', trigger: 'change' }],
  followupTime: [{ required: true, message: '请选择随访时间', trigger: 'change' }]
}

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
  if (!form.value || isSubmitting.value) return
  await form.value.validate(async (valid) => {
    if (valid) {
      isSubmitting.value = true
      try {
        await followUpStore.createFollowUpRecord(record.value)
        ElMessage.success('记录创建成功')
        emit('switch-tab', 'history') // Switch to history tab
        // Reset form
        record.value = {
          planId: null,
          lifeStyle: '',
          healthStatus: 0,
          medication: '',
          followupTime: '',
          remark: ''
        }
        form.value.resetFields()
      } catch (error) {
        ElMessage.error('创建记录失败，请重试')
      } finally {
        isSubmitting.value = false
      }
    } else {
      ElMessage.error('请填写所有必填项')
      return false
    }
  })
}
</script>