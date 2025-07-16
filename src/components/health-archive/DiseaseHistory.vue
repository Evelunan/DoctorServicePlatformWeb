<template>
  <div class="disease-history">
    <div class="header">
      <h3>过往病史</h3>
      <el-button v-if="editMode" type="primary" size="small" @click="addDisease">
        <el-icon><Plus /></el-icon>
        添加病史
      </el-button>
    </div>

    <div v-if="diseaseList.length === 0" class="empty-state">
      <el-empty description="暂无病史记录" />
    </div>

    <div v-else class="disease-list">
      <el-card
        v-for="(disease, index) in diseaseList"
        :key="index"
        class="disease-item"
        shadow="hover"
      >
        <template #header>
          <div class="card-header">
            <span>病史 {{ index + 1 }}</span>
            <div class="actions" v-if="editMode">
              <el-button type="danger" size="small" @click="removeDisease(index)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </div>
        </template>

        <el-form :model="disease" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="疾病名称" prop="diseaseName">
                <el-input
                  v-model="disease.diseaseName"
                  :disabled="!editMode"
                  placeholder="请输入疾病名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="疾病状态" prop="status">
                <el-select v-model="disease.status" :disabled="!editMode" placeholder="请选择状态" style="width: 100%">
                  <el-option label="治疗中" :value="0" />
                  <el-option label="康复" :value="1" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="诊断日期" prop="diagnosisDate">
                <el-date-picker
                  v-model="disease.diagnosisDate"
                  type="date"
                  placeholder="选择诊断日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  :disabled="!editMode"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="复发时间" prop="relapseDate">
                <el-date-picker
                  v-model="disease.relapseDate"
                  type="date"
                  placeholder="选择复发时间"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  :disabled="!editMode"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>


          <el-form-item label="备注" prop="notes">
            <el-input
              v-model="disease.notes"
              type="textarea"
              :rows="3"
              :disabled="!editMode"
              placeholder="请输入备注信息（治疗情况、用药情况等）"
            />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'

// eslint-disable-next-line
const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  }
})

const diseaseList = ref([])

// 添加病史
const addDisease = () => {
  diseaseList.value.push({
    id: null,
    diseaseName: '',
    diagnosisDate: '',
    relapseDate: '',
    status: 0,
    notes: '',
    userId: null
  })
}

// 删除病史
const removeDisease = (index) => {
  diseaseList.value.splice(index, 1)
}

// 设置表单数据
const setFormData = (data) => {
  diseaseList.value = []
  if (Array.isArray(data) && data.length > 0) {
    diseaseList.value = data
  }
}

// 获取表单数据
const getFormData = () => {
  return diseaseList.value
}

// 验证表单
const validate = () => {
  // 检查是否有病史记录
  if (diseaseList.value.length === 0) {
    return Promise.resolve(true)
  }

  // 检查每个病史记录是否完整
  for (let i = 0; i < diseaseList.value.length; i++) {
    const disease = diseaseList.value[i]
    if (!disease.diseaseName || !disease.diagnosisDate || !disease.status) {
      return Promise.reject(new Error(`病史记录 ${i + 1} 信息不完整`))
    }
  }

  return Promise.resolve(true)
}

defineExpose({
  setFormData,
  getFormData,
  validate,
  addDisease,
  removeDisease
})
</script>

<style scoped>
.disease-history {
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h3 {
  margin: 0;
  color: #303133;
}

.empty-state {
  margin: 40px 0;
}

.disease-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.disease-item {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 10px;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>
