<template>
  <div class="family-disease-history">
    <div class="header">
      <h3>家族病史</h3>
      <el-button v-if="editMode" type="primary" size="small" @click="addFamilyHistory">
        <el-icon><Plus /></el-icon>
        添加家族病史
      </el-button>
    </div>

    <div v-if="familyHistoryList.length === 0" class="empty-state">
      <el-empty description="暂无家族病史记录" />
    </div>

    <div v-else class="family-history-list">
      <el-card
        v-for="(history, index) in familyHistoryList"
        :key="index"
        class="family-history-item"
        shadow="hover"
      >
        <template #header>
          <div class="card-header">
            <span>家族病史 {{ index + 1 }}</span>
            <div class="actions" v-if="editMode">
              <el-button type="danger" size="small" @click="removeFamilyHistory(index)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </div>
        </template>

        <el-form :model="history" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="亲属关系" prop="relation">
                <el-input
                  v-model="history.relation"
                  :disabled="!editMode"
                  placeholder="请输入亲属关系"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="疾病名称" prop="diseaseName">
                <el-input
                  v-model="history.diseaseName"
                  :disabled="!editMode"
                  placeholder="请输入疾病名称"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="诊断日期" prop="diagnosisDate">
                <el-date-picker
                  v-model="history.diagnosisDate"
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
                  v-model="history.relapseDate"
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
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="疾病状态" prop="status">
                <el-select v-model="history.status" :disabled="!editMode" placeholder="请选择状态" style="width: 100%">
                  <el-option label="治疗中" :value="0" />
                  <el-option label="康复" :value="1" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" prop="notes">
            <el-input
              v-model="history.notes"
              type="textarea"
              :rows="3"
              :disabled="!editMode"
              placeholder="请输入备注信息（发病年龄、治疗情况、预后等）"
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

const familyHistoryList = ref([])

// 添加家族病史
const addFamilyHistory = () => {
  familyHistoryList.value.push({
    id: null,
    relation: '',
    diseaseName: '',
    diagnosisDate: '',
    relapseDate: '',
    status: 0,
    notes: '',
    userId: null
  })
}

// 删除家族病史
const removeFamilyHistory = (index) => {
  familyHistoryList.value.splice(index, 1)
}

// 设置表单数据
const setFormData = (data) => {
  familyHistoryList.value = []
  if (Array.isArray(data) && data.length > 0) {
    familyHistoryList.value = data
  }
}

// 获取表单数据
const getFormData = () => {
  return familyHistoryList.value
}

// 验证表单
const validate = () => {
  // 检查是否有家族病史记录
  if (familyHistoryList.value.length === 0) {
    return Promise.resolve(true)
  }

  // 检查每个家族病史记录是否完整
  for (let i = 0; i < familyHistoryList.value.length; i++) {
    const history = familyHistoryList.value[i]
    if (!history.relation || !history.diseaseName || history.status === null || history.status === undefined) {
      console.log(history)
      return Promise.reject(new Error(`家族病史记录 ${i + 1} 信息不完整`))
    }
  }

  return Promise.resolve(true)
}

defineExpose({
  setFormData,
  getFormData,
  validate,
  addFamilyHistory,
  removeFamilyHistory
})
</script>

<style scoped>
.family-disease-history {
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

.family-history-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.family-history-item {
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
