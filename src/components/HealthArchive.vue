<template>
  <el-card class="health-archive-card">
    <template #header>
      <div class="card-header">
        <span>健康档案</span>
        <div class="patient-selector" v-if="currentPatient">
          <el-tag type="primary">{{ currentPatient.name }}</el-tag>
          <el-button size="small" @click="changePatient">切换病人</el-button>
        </div>
      </div>
    </template>

    <div v-if="!currentPatient" class="no-patient">
      <el-empty description="请先选择病人">
        <el-button type="primary" @click="changePatient">选择病人</el-button>
      </el-empty>
    </div>

    <div v-else>
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="基本信息" name="basic">
          <BasicInfo ref="basicInfoRef" :editMode="editMode" />
        </el-tab-pane>

        <el-tab-pane label="既往病史" name="medical">
          <MedicalHistory ref="medicalHistoryRef" :editMode="editMode" />
        </el-tab-pane>

        <el-tab-pane label="家族病史" name="family">
          <FamilyHistory ref="familyHistoryRef" :editMode="editMode" />
        </el-tab-pane>
      </el-tabs>

      <div class="form-actions">
        <el-button v-if="!editMode" type="primary" @click="editMode = true">编辑</el-button>
        <el-button v-else type="primary" @click="onSave">保存</el-button>
        <el-button v-if="editMode" @click="onCancel">取消</el-button>
      </div>
    </div>

    <!-- 病人选择对话框 -->
    <el-dialog v-model="patientDialogVisible" title="选择病人" width="800px">
      <PatientList @select-patient="onSelectPatient" />
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import BasicInfo from './BasicInfo.vue'
import MedicalHistory from './MedicalHistory.vue'
import FamilyHistory from './FamilyHistory.vue'
import PatientList from './PatientList.vue'
import { getPatientArchive, savePatientArchive } from '@/api/patient'

const activeTab = ref('basic')
const editMode = ref(false)
const basicInfoRef = ref()
const medicalHistoryRef = ref()
const familyHistoryRef = ref()
const currentPatient = ref(null)
const patientDialogVisible = ref(false)

// 切换病人
const changePatient = () => {
  patientDialogVisible.value = true
}

// 选择病人
const onSelectPatient = (patient) => {
  currentPatient.value = patient
  patientDialogVisible.value = false
  editMode.value = false
  loadPatientArchive(patient.id)
}

// 加载病人档案
const loadPatientArchive = async () => {
  try {
    const res = await getPatientArchive(currentPatient.value.id)
    if (res && res.data && res.data.code === 0 && res.data.data) {
      const archiveData = res.data.data

      // 设置各组件数据
      basicInfoRef.value?.setFormData(archiveData.basicInfo || {})
      medicalHistoryRef.value?.setFormData(archiveData.medicalHistory || {})
      familyHistoryRef.value?.setFormData(archiveData.familyHistory || {})
    } else {
      // 如果接口失败，使用模拟数据
      const basicData = {
        name: currentPatient.value.name,
        idCard: '110101199001011234',
        gender: currentPatient.value.gender,
        birthdate: '1990-01-01',
        phone: currentPatient.value.phone,
        emergencyContact: '李四',
        address: currentPatient.value.address || '北京市朝阳区'
      }

      const medicalData = {
        diseases: ['高血压'],
        otherDiseases: '',
        surgeryHistory: '无',
        allergies: '无'
      }

      const familyData = {
        familyDiseases: ['高血压'],
        otherFamilyDiseases: '',
        familyHistoryDetail: '父亲有高血压病史'
      }

      // 设置各组件数据
      basicInfoRef.value?.setFormData(basicData)
      medicalHistoryRef.value?.setFormData(medicalData)
      familyHistoryRef.value?.setFormData(familyData)
    }
  } catch (error) {
    console.error('加载病人档案失败:', error)
    ElMessage.error('加载病人档案失败')
  }
}

async function onSave() {
  try {
    // 验证基本信息
    await basicInfoRef.value?.validate()

    // 获取所有表单数据
    const basicData = basicInfoRef.value?.getFormData()
    const medicalData = medicalHistoryRef.value?.getFormData()
    const familyData = familyHistoryRef.value?.getFormData()

    // 合并数据
    const archiveData = {
      patientId: currentPatient.value.id,
      basicInfo: basicData,
      medicalHistory: medicalData,
      familyHistory: familyData
    }

    // 调用接口保存健康档案
    const res = await savePatientArchive(archiveData)
    if (res && res.data && res.data.code === 0) {
      editMode.value = false
      ElMessage.success('保存成功')
    } else {
      ElMessage.error(res.data?.message || '保存失败')
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请稍后重试')
  }
}

function onCancel() {
  editMode.value = false
}
</script>

<style scoped>
.health-archive-card {
  width: 100%;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.patient-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.no-patient {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.form-actions {
  margin-top: 20px;
  text-align: center;
}
</style>
