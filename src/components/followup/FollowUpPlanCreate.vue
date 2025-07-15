<template>
  <div class="form-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>创建新的随访计划</span>
        </div>
      </template>
      <el-steps :active="activeStep" finish-status="success" simple style="margin-bottom: 20px">
        <el-step title="基本信息" />
        <el-step title="计划详情" />
      </el-steps>

      <el-form :model="plan" :rules="rules" ref="planFormRef" label-position="top" class="plan-form">
        <div v-show="activeStep === 0">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="老人选择" prop="elderId">
                <el-select v-model="plan.elderId" placeholder="请选择老人" filterable style="width: 100%;">
                  <template #prefix>
                    <el-icon><User /></el-icon>
                  </template>
                  <el-option v-for="item in patients" :key="item.id" :label="`${item.id} - ${item.username}`" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="随访预定时间" prop="planTime">
                <el-date-picker
                  v-model="plan.planTime"
                  type="date"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  placeholder="选择日期"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="随访方式" prop="method">
            <el-select v-model="plan.method" placeholder="请选择随访方式" style="width: 100%;">
               <template #prefix>
                <el-icon><Phone /></el-icon>
              </template>
              <el-option label="视频随访" value="视频随访" />
              <el-option label="电话随访" value="电话随访" />
              <el-option label="线下随访" value="线下随访" />
            </el-select>
          </el-form-item>
        </div>

        <div v-show="activeStep === 1">
          <el-form-item label="计划内容" prop="notes">
            <el-input type="textarea" v-model="plan.notes" :rows="4" placeholder="请输入详细的随访计划内容" />
          </el-form-item>
          <el-form-item label="优先级" prop="priority">
            <el-radio-group v-model="plan.priority">
              <el-radio-button :label="0">最高</el-radio-button>
              <el-radio-button :label="1">较高</el-radio-button>
              <el-radio-button :label="2">正常</el-radio-button>
              <el-radio-button :label="3">较低</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>

        <el-form-item class="action-buttons">
          <el-button @click="prevStep" v-if="activeStep > 0">上一步</el-button>
          <el-button type="primary" @click="nextStep" v-if="activeStep < 1">下一步</el-button>
          <el-button type="primary" @click="submitPlan" v-if="activeStep === 1" :loading="isSubmitting">创建计划</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.form-container {
  padding: 20px;
}

.box-card {
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.plan-form {
  padding: 20px;
}

.action-buttons {
  margin-top: 20px;
  text-align: center;
}

.el-button {
  margin: 0 10px;
}
</style>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { User, Phone } from '@element-plus/icons-vue'
import { getPatientList } from '@/api/patient'
import { createFollowUpPlanAPI } from '@/api/followup'

import { ElMessage } from 'element-plus'

const emit = defineEmits(['plan-created'])
const planFormRef = ref(null)
const activeStep = ref(0)
const isSubmitting = ref(false)

const patients = ref([]) // This should be fetched from an API
const rules = {
  elderId: [{ required: true, message: '请选择老人', trigger: 'change' }],
  planTime: [{ required: true, message: '请选择随访预定时间', trigger: 'change' }],
  method: [{ required: true, message: '请选择随访方式', trigger: 'change' }],
  notes: [{ required: true, message: '请输入计划内容', trigger: 'blur' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }]
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

const nextStep = async () => {
  planFormRef.value.clearValidate(); // Clear previous validation messages
  const fieldsToValidate = {
    0: ['elderId', 'planTime', 'method'],
  }[activeStep.value];

  if (fieldsToValidate) {
    try {
      await Promise.all(fieldsToValidate.map(field => planFormRef.value.validateField(field)));
      if (activeStep.value < 1) {
        activeStep.value++;
      }
    } catch (invalidFields) {
        console.error('Validation failed:', invalidFields); // Log for debugging
        const errorMessages = Object.keys(invalidFields).map(field => {
            const messages = invalidFields[field].map(e => e.message).join(', ');
            return `<strong>${field}</strong>: ${messages}`;
        }).join('<br/>');
        ElMessage({
          title: '表单验证失败',
          message: `请检查以下字段：<br/>${errorMessages}`,
          type: 'error',
          dangerouslyUseHTMLString: true,
          duration: 5000
        });
      }
  } else {
    // If there are no fields to validate for the current step, just proceed
    if (activeStep.value < 1) {
      activeStep.value++;
    }
  }
};

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

const submitPlan = async () => {
  if (!planFormRef.value) return
  await planFormRef.value.validate(async (valid) => {
    if (valid) {
      isSubmitting.value = true;
      const selectedPatient = patients.value.find(p => p.id === plan.value.elderId)
      if (selectedPatient) {
        plan.value.elderName = selectedPatient.username
      }
      try {
        await createFollowUpPlanAPI(plan.value)
        ElMessage.success('计划创建成功')
        emit('plan-created')
        // Reset form
        planFormRef.value.resetFields()
        plan.value.elderName = ''
        plan.value.notes = ''
        plan.value.priority = 2
        activeStep.value = 0
      } catch (error) {
        ElMessage.error('计划创建失败，请稍后重试')
      } finally {
        isSubmitting.value = false;
      }
    } else {
      ElMessage.error('请填写所有必填项')
    }
  })
}
</script>