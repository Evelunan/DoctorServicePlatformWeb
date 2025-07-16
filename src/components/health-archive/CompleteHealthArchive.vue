<template>
  <div class="complete-health-archive">
    <el-card class="archive-card">
      <template #header>
        <div class="card-header">
          <h2>健康档案</h2>
        </div>
      </template>

      <template #footer>
        <!-- footer内容全部移除，由父组件控制弹窗操作按钮 -->
      </template>

      <div class="archive-content">
        <!-- 个人信息 -->
        <div class="section">
          <div class="section-header">
            <h3>个人基本信息</h3>
          </div>
          <div class="section-content">
            <PersonalInfo ref="personalInfoRef" :editMode="editMode" />
          </div>
        </div>

        <!-- 基本健康信息 -->
        <div class="section">
          <div class="section-header">
            <h3>基本健康信息</h3>
          </div>
          <div class="section-content">
            <BasicHealthInfo ref="basicHealthInfoRef" :editMode="editMode" />
          </div>
        </div>

        <!-- 过往病史 -->
        <div class="section">
          <div class="section-header">
            <h3>过往病史</h3>
          </div>
          <div class="section-content">
            <DiseaseHistory ref="diseaseHistoryRef" :editMode="editMode" />
          </div>
        </div>

        <!-- 家族病史 -->
        <div class="section">
          <div class="section-header">
            <h3>家族病史</h3>
          </div>
          <div class="section-content">
            <FamilyDiseaseHistory ref="familyDiseaseHistoryRef" :editMode="editMode" />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, defineExpose, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import PersonalInfo from './PersonalInfo.vue'
import PersonalInfo from '@/components/health-archive/PersonalInfo.vue'
import BasicHealthInfo from '@/components/health-archive/BasicHealthInfo.vue'
import DiseaseHistory from '@/components/health-archive/DiseaseHistory.vue'
import FamilyDiseaseHistory from '@/components/health-archive/FamilyDiseaseHistory.vue'
import { getAllDoctor } from '@/api/user'

const props = defineProps({
  userId: {
    type: [Number, String],
    default: null
  },
  patientData: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'view'
  }
})

const emit = defineEmits(['save', 'update'])

const editMode = ref(props.mode === 'edit')

// 组件引用
const personalInfoRef = ref()
const basicHealthInfoRef = ref()
const diseaseHistoryRef = ref()
const familyDiseaseHistoryRef = ref()

// 加载档案数据
const loadArchiveData = (data) => {
  console.log('CompleteHealthArchive - loadArchiveData:', data)
  if (data) {
    // 处理从API返回的数据格式
    const personalInfo = {
      id: data.id,
      account: data.account,
      username: data.username,
      gender: data.gender,
      address: data.address,
      birthdate: data.birthdate,
      phone: data.phone,
      doctorId: data.doctorId,
      type: data.type
    }

    const basicHealthInfo = data.healthInfo || {}
    const diseaseHistory = data.diseaseHistoryList || []
    const familyDiseaseHistory = data.familyHistoryList || []

    console.log('CompleteHealthArchive - processed data:', {
      personalInfo,
      basicHealthInfo,
      diseaseHistory,
      familyDiseaseHistory
    })

    // 确保组件已经挂载后再设置数据
    setTimeout(() => {
      personalInfoRef.value?.setFormData(personalInfo)
      basicHealthInfoRef.value?.setFormData(basicHealthInfo)
      diseaseHistoryRef.value?.setFormData(diseaseHistory)
      familyDiseaseHistoryRef.value?.setFormData(familyDiseaseHistory)
    }, 100)
  }
}

// 监听mode和patientData变化，自动切换编辑/只读
watch([
  () => props.mode,
  () => props.patientData
], ([newMode, newData]) => {
  editMode.value = newMode === 'edit'
  if (newData) {
    loadArchiveData(newData)
  } else {
    resetForm()
  }
}, { immediate: true })

// 开始编辑
const startEdit = () => {
  editMode.value = true
}

// 取消编辑
const cancelEdit = async () => {
  try {
    await ElMessageBox.confirm('确定要取消编辑吗？未保存的更改将丢失。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    editMode.value = false
  } catch {
    // 用户取消
  }
}

// 保存档案
const saveArchive = async () => {
  try {
    // 验证所有表单
    await Promise.all([
      personalInfoRef.value?.validate(),
      basicHealthInfoRef.value?.validate(),
      diseaseHistoryRef.value?.validate(),
      familyDiseaseHistoryRef.value?.validate()
    ])

    // 获取所有数据
    const archiveData = {
      personalInfo: personalInfoRef.value?.getFormData(),
      basicHealthInfo: basicHealthInfoRef.value?.getFormData(),
      diseaseHistory: diseaseHistoryRef.value?.getFormData(),
      familyDiseaseHistory: familyDiseaseHistoryRef.value?.getFormData()
    }

    // 设置用户ID
    const userId = props.userId || props.patientData?.id
    if (userId) {
      archiveData.personalInfo.userId = userId
      archiveData.basicHealthInfo.userId = userId
      archiveData.diseaseHistory.forEach(item => item.userId = userId)
      archiveData.familyDiseaseHistory.forEach(item => item.userId = userId)
    }

    // 触发保存事件，由父组件决定何时切换editMode
    emit('save', archiveData)
  } catch (error) {
    ElMessage.error(error.message || '保存失败，请检查表单信息')
  }
}

// 获取档案数据
const getArchiveData = () => {
  return {
    personalInfo: personalInfoRef.value?.getFormData(),
    basicHealthInfo: basicHealthInfoRef.value?.getFormData(),
    diseaseHistory: diseaseHistoryRef.value?.getFormData(),
    familyDiseaseHistory: familyDiseaseHistoryRef.value?.getFormData()
  }
}

// 设置医生列表
const setDoctorList = (doctors) => {
  personalInfoRef.value?.setDoctorList(doctors)
}

// 重置表单
const resetForm = () => {
  personalInfoRef.value?.setFormData({})
  basicHealthInfoRef.value?.setFormData({})
  diseaseHistoryRef.value?.setFormData([])
  familyDiseaseHistoryRef.value?.setFormData([])
}

// 移除 userId 相关的 editMode 自动切换逻辑，统一由 mode 控制

onMounted(() => {
  // 获取医生列表
  getAllDoctor().then(res => {
    if (res && res.data && res.data.code === 0) {
      // 只保留 id 和 username 字段
      const doctorList = (res.data.data || []).map(d => ({ id: d.id, username: d.username }))
      setDoctorList(doctorList)
      console.log('医生列表:', doctorList)
    }
  })
})

defineExpose({
  loadArchiveData,
  getArchiveData,
  setDoctorList,
  resetForm,
  startEdit,
  cancelEdit,
  saveArchive
})
</script>

<style scoped>
.complete-health-archive {
  width: 100%;
  height: 100%;
}

.archive-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.edit-actions {
  display: flex;
  gap: 10px;
}

.archive-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.section {
  margin-bottom: 40px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

.section:last-child {
  margin-bottom: 0;
}

.section-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.section-content {
  padding: 20px;
  background: #fff;
}
</style>
