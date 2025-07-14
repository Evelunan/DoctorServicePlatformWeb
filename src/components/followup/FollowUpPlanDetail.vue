<template>
  <div>
    <el-page-header @back="goBack" content="随访计划详情"></el-page-header>
    <el-card class="box-card">
      <div v-if="!editMode" class="detail-view">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="ID">{{ plan.id }}</el-descriptions-item>
          <el-descriptions-item label="老人姓名">{{ plan.elderName }}</el-descriptions-item>
          <el-descriptions-item label="随访计划时间">{{ plan.planTime }}</el-descriptions-item>
          <el-descriptions-item label="随访方式">{{ plan.method }}</el-descriptions-item>
          <el-descriptions-item label="计划内容">{{ plan.notes }}</el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="priorityTagType(plan.priority)">{{ priorityMap[plan.priority] }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="statusTagType(plan.status)">{{ statusMap[plan.status] }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <el-button type="primary" @click="editMode = true" style="margin-top: 20px;">编辑</el-button>
      </div>
      <div v-else>
        <el-form :model="editablePlan" label-width="120px">
          <el-form-item label="随访方式">
            <el-input v-model="editablePlan.method"></el-input>
          </el-form-item>
          <el-form-item label="计划内容">
            <el-input type="textarea" v-model="editablePlan.notes"></el-input>
          </el-form-item>
          <el-form-item label="优先级">
            <el-radio-group v-model="editablePlan.priority">
              <el-radio :label="0">最高</el-radio>
              <el-radio :label="1">较高</el-radio>
              <el-radio :label="2">正常</el-radio>
              <el-radio :label="3">较低</el-radio>
            </el-radio-group>
          </el-form-item>
           <el-form-item label="状态">
            <el-radio-group v-model="editablePlan.status">
              <el-radio :label="1">进行中</el-radio>
              <el-radio :label="2">已完成</el-radio>
              <el-radio :label="0">已取消</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="savePlan">保存</el-button>
            <el-button @click="goBack">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { updateFollowUpPlanAPI } from '@/api/followup'

const props = defineProps({
  plan: Object
})

const emit = defineEmits(['back', 'plan-updated'])

const editMode = ref(false)
const editablePlan = ref(null)

const priorityMap = {
  0: '最高',
  1: '较高',
  2: '正常',
  3: '较低'
}

const priorityTagType = (priority) => {
  const types = ['danger', 'warning', 'primary', 'success']
  return types[priority] || 'info'
}

const statusMap = {
  1: '进行中',
  2: '已完成',
  0: '未执行',
  3: '已取消'
}
const statusTagType = (status) => {
  const types = ['info', 'primary', 'success','danger']
  return types[status] || 'info'
}

watch(() => props.plan, (newPlan) => {
  if (newPlan) {
    editablePlan.value = { ...newPlan }
  }
}, { immediate: true })

function goBack() {
  if (editMode.value) {
    editablePlan.value = { ...props.plan } // Revert changes on cancel
    editMode.value = false
  } else {
    emit('back')
  }
}

async function savePlan() {
  await updateFollowUpPlanAPI(editablePlan.value)
  emit('plan-updated', editablePlan.value)
  editMode.value = false
}
</script>

<style scoped>
.box-card {
  margin-top: 20px;
}
</style>