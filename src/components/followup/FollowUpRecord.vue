<template>
  <div class="form-container-enhanced">
    <el-card class="box-card-enhanced">
      <template #header>
        <div class="card-header-enhanced">
          <span>创建随访记录</span>
        </div>
      </template>

      <el-steps :active="activeStep" finish-status="success" simple class="steps-enhanced">
        <el-step title="基础信息" :icon="Edit" />
        <el-step title="健康详情" :icon="Upload" />
        <el-step title="确认提交" :icon="Picture" />
      </el-steps>

      <el-form :model="record" :rules="rules" ref="formRef" label-width="120px" class="record-form-enhanced">
        <div v-show="activeStep === 0">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="选择随访计划" prop="planId">
                <el-select v-model="record.planId" placeholder="请选择已完成的随访计划" filterable style="width: 100%;">
                  <el-option v-for="item in completedPlans" :key="item.id" :label="`${item.id} - ${item.elderName}`" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="随访时间" prop="followupTime">
                <el-date-picker
                  v-model="record.followupTime"
                  type="date"
                  placeholder="选择随访日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%;"
                  :prefix-icon="Calendar"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div v-show="activeStep === 1">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="健康状况" prop="healthStatus">
                <el-radio-group v-model="record.healthStatus">
                  <el-radio-button :label="0">健康</el-radio-button>
                  <el-radio-button :label="1">病情好转</el-radio-button>
                  <el-radio-button :label="2">病况维持</el-radio-button>
                  <el-radio-button :label="3">病情恶化</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="生活方式指导" prop="lifeStyle">
                <el-input type="textarea" v-model="record.lifeStyle" :rows="3" placeholder="例如：建议每日散步30分钟，保持低盐饮食。" :prefix-icon="Document" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="用药情况" prop="medication">
                <el-input type="textarea" v-model="record.medication" :rows="3" placeholder="例如：阿司匹林每日一次，饭后服用。" :prefix-icon="FirstAidKit" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div v-show="activeStep === 2">
          <el-form-item label="备注">
            <el-input type="textarea" v-model="record.remark" :rows="4" placeholder="请输入其他备注信息" :prefix-icon="ChatLineSquare" />
          </el-form-item>
          <el-alert
            title="确认信息"
            type="info"
            description="请在提交前核对所有信息是否准确无误。"
            show-icon
            :closable="false"
            class="alert-enhanced"
          />
        </div>

        <el-form-item class="action-buttons-enhanced">
          <el-button @click="prevStep" v-if="activeStep > 0" :icon="ArrowLeft">上一步</el-button>
          <el-button @click="nextStep" v-if="activeStep < 2" type="primary" :icon="ArrowRight">下一步</el-button>
          <el-button @click="submitRecord" v-if="activeStep === 2" type="success" :loading="isSubmitting" :disabled="isSubmitting" :icon="Check">提交记录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.form-container-enhanced {
  padding: 20px;
  background-color: #f7f8fa;
}

.box-card-enhanced {
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-header-enhanced {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.steps-enhanced {
  margin-bottom: 30px;
}

.record-form-enhanced {
  padding: 0 20px;
}

.action-buttons-enhanced {
  margin-top: 20px;
  text-align: center;
}

.action-buttons-enhanced .el-button {
  margin: 0 10px;
}

.alert-enhanced {
  margin-top: 20px;
}

.el-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.el-radio-button__inner {
  border-radius: 20px !important;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getFollowUpCompletePlansAPI } from '@/api/followup'
import { useFollowUpStore } from '@/stores/followup'
import { Edit, Upload, Picture, ArrowLeft, ArrowRight, Check, Calendar, Document, FirstAidKit, ChatLineSquare } from '@element-plus/icons-vue'

const emit = defineEmits(['record-created', 'switch-tab'])
const followUpStore = useFollowUpStore()

const formRef = ref(null)
const isSubmitting = ref(false)
const completedPlans = ref([])
const activeStep = ref(0)

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
  lifeStyle: [{ required: true, message: '请输入生活方式指导', trigger: 'blur' }],
  healthStatus: [{ required: true, message: '请选择健康状况', trigger: 'change' }],
  medication: [{ required: true, message: '请输入用药情况', trigger: 'blur' }],
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

const nextStep = async () => {
  formRef.value.clearValidate(); // Clear previous validation messages
  const fieldsToValidate = {
    0: ['planId', 'followupTime'],
    1: ['healthStatus', 'lifeStyle', 'medication'],
  }[activeStep.value];

  if (fieldsToValidate) {
    try {
      await Promise.all(fieldsToValidate.map(field => formRef.value.validateField(field)));
      if (activeStep.value < 2) {
        activeStep.value++;
      }
    } catch (invalidFields) {
       console.error('Validation failed in FollowUpRecord:', invalidFields); // Log for debugging
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
    if (activeStep.value < 2) {
      activeStep.value++;
    }
  }
};

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

const submitRecord = async () => {
  if (!formRef.value || isSubmitting.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      isSubmitting.value = true
      try {
        await followUpStore.createFollowUpRecord(record.value)
        ElMessage.success('记录创建成功')
        emit('switch-tab', 'history') // Switch to history tab
        // Reset form and step
        activeStep.value = 0
        record.value = {
          planId: null,
          lifeStyle: '',
          healthStatus: 0,
          medication: '',
          followupTime: '',
          remark: ''
        }
        formRef.value.resetFields()
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