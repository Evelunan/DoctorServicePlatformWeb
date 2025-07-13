<template>
  <div class="complete-health-archive">
    <el-card class="archive-card">
      <template #header>
        <div class="card-header">
          <h2>健康档案</h2>
          <div class="header-actions">
            <el-button v-if="!editMode && props.userId" type="primary" @click="startEdit">
              <el-icon><Edit /></el-icon>
              编辑档案
            </el-button>
            <div v-else-if="props.userId" class="edit-actions">
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
import { ref, defineExpose, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Check, Close } from '@element-plus/icons-vue'
// import PersonalInfo from './PersonalInfo.vue'
import PersonalInfo from '@/components/health-archive/PersonalInfo.vue'
import BasicHealthInfo from '@/components/health-archive/BasicHealthInfo.vue'
import DiseaseHistory from '@/components/health-archive/DiseaseHistory.vue'
import FamilyDiseaseHistory from '@/components/health-archive/FamilyDiseaseHistory.vue'

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

    // 只有在查看现有档案时才退出编辑模式
    if (props.userId) {
      editMode.value = false
    }
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

// 获取病人档案数据（模拟数据）
const getPatientArchiveData = (patientId) => {
  const archiveDataMap = {
    1: {
      personalInfo: {
        id: 1,
        account: "zhangsan",
        username: "张三",
        gender: 0,
        address: "北京市朝阳区",
        birthdate: "1959-03-15",
        phone: "13800000001",
        doctorId: 1,
        type: null
      },
      basicHealthInfo: {
        id: 1,
        height: 170.0,
        weight: 75.0,
        bloodType: 1, // B型
        allergies: "对花粉过敏",
        disability: 0,
        userId: 1
      },
      diseaseHistory: [
        {
          id: 1,
          diseaseName: "高血压",
          diagnosisDate: "2015-06-20",
          status: "治疗中",
          notes: "中度高血压，需要长期服药控制",
          userId: 1
        }
      ],
      familyDiseaseHistory: [
        {
          id: 1,
          relation: "父亲",
          diseaseName: "高血压",
          notes: "父亲有高血压病史",
          userId: 1
        }
      ]
    },
    2: {
      personalInfo: {
        id: 2,
        account: "lisi",
        username: "李四",
        gender: 1,
        address: "北京市海淀区",
        birthdate: "1952-08-10",
        phone: "13800000002",
        doctorId: 1,
        type: null
      },
      basicHealthInfo: {
        id: 2,
        height: 158.0,
        weight: 62.0,
        bloodType: 3, // O型
        allergies: "无",
        disability: 0,
        userId: 2
      },
      diseaseHistory: [
        {
          id: 2,
          diseaseName: "糖尿病",
          diagnosisDate: "2010-12-05",
          status: "治疗中",
          notes: "2型糖尿病，通过饮食和药物控制",
          userId: 2
        }
      ],
      familyDiseaseHistory: [
        {
          id: 2,
          relation: "母亲",
          diseaseName: "糖尿病",
          notes: "母亲有糖尿病病史",
          userId: 2
        }
      ]
    },
    3: {
      personalInfo: {
        id: 3,
        account: "wangwu",
        username: "王五",
        gender: 0,
        address: "北京市西城区",
        birthdate: "1966-11-25",
        phone: "13800000003",
        doctorId: 1,
        type: null
      },
      basicHealthInfo: {
        id: 3,
        height: 175.0,
        weight: 80.0,
        bloodType: 0, // A型
        allergies: "对海鲜过敏",
        disability: 0,
        userId: 3
      },
      diseaseHistory: [
        {
          id: 3,
          diseaseName: "心脏病",
          diagnosisDate: "2018-03-10",
          status: "治疗中",
          notes: "冠心病，需要定期复查",
          userId: 3
        }
      ],
      familyDiseaseHistory: [
        {
          id: 3,
          relation: "祖父",
          diseaseName: "心脏病",
          notes: "祖父因心脏病去世",
          userId: 3
        }
      ]
    }
  }

  return archiveDataMap[patientId] || null
}

// 监听userId变化，自动加载对应的病人档案
watch(() => props.userId, (newUserId) => {
  if (newUserId) {
    const patientData = getPatientArchiveData(newUserId)
    if (patientData) {
      loadArchiveData(patientData)
      editMode.value = false // 查看现有档案时，默认非编辑模式
    }
  } else {
    resetForm()
    editMode.value = true // 添加新病人时，默认进入编辑模式
  }
}, { immediate: true })

// 监听编辑模式变化，在添加新病人时自动进入编辑模式
watch(() => editMode.value, (newEditMode) => {
  if (!props.userId && !newEditMode) {
    // 如果是添加新病人且不在编辑模式，自动进入编辑模式
    editMode.value = true
  }
})

onMounted(() => {
  // 设置医生列表
  const doctorList = [
    { id: 1, name: '张医生' },
    { id: 2, name: '李医生' },
    { id: 3, name: '王医生' },
    { id: 4, name: '刘医生' }
  ]
  setDoctorList(doctorList)
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
