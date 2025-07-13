<template>
  <div class="complete-health-archive">
    <el-card class="archive-card">
      <template #header>
        <div class="card-header">
          <h2>健康档案</h2>
          <div class="header-actions">
            <el-button v-if="!editMode" type="primary" @click="startEdit">
              <el-icon><Edit /></el-icon>
              编辑档案
            </el-button>
            <div v-else class="edit-actions">
              <el-button type="primary" @click="saveArchive">
                <el-icon><Check /></el-icon>
                保存
              </el-button>
              <el-button @click="cancelEdit">
                <el-icon><Close /></el-icon>
                取消
              </el-button>
            </div>
          </div>
        </div>
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
import { ref, defineExpose } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Check, Close } from '@element-plus/icons-vue'
import PersonalInfo from './PersonalInfo.vue'
import BasicHealthInfo from './BasicHealthInfo.vue'
import DiseaseHistory from './DiseaseHistory.vue'
import FamilyDiseaseHistory from './FamilyDiseaseHistory.vue'

const props = defineProps({
  userId: {
    type: [Number, String],
    default: null
  }
})

const emit = defineEmits(['save', 'update'])

const editMode = ref(false)

// 组件引用
const personalInfoRef = ref()
const basicHealthInfoRef = ref()
const diseaseHistoryRef = ref()
const familyDiseaseHistoryRef = ref()

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
    if (props.userId) {
      archiveData.personalInfo.userId = props.userId
      archiveData.basicHealthInfo.userId = props.userId
      archiveData.diseaseHistory.forEach(item => item.userId = props.userId)
      archiveData.familyDiseaseHistory.forEach(item => item.userId = props.userId)
    }

    // 触发保存事件
    emit('save', archiveData)

    editMode.value = false
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error(error.message || '保存失败，请检查表单信息')
  }
}

// 加载档案数据
const loadArchiveData = (data) => {
  if (data) {
    personalInfoRef.value?.setFormData(data.personalInfo || {})
    basicHealthInfoRef.value?.setFormData(data.basicHealthInfo || {})
    diseaseHistoryRef.value?.setFormData(data.diseaseHistory || [])
    familyDiseaseHistoryRef.value?.setFormData(data.familyDiseaseHistory || [])
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
