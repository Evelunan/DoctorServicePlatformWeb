<template>
  <div>
    <el-table :data="plans" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="elderName" label="老人姓名" width="180"></el-table-column>
      <el-table-column prop="priority" label="优先级">
        <template #default="{ row }">
          <el-tag :type="priorityTagType[row.priority]">{{ priorityMap[row.priority] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="planTime" label="随访计划时间"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="statusTagType[row.status]">{{ statusMap[row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template #default="{ row }">
          <el-button size="small" @click="viewDetails(row)">查看详情</el-button>
          <el-button v-if="row.status === 0" size="small" type="primary" @click="executePlan(row)">执行</el-button>
          <el-button v-if="row.status === 1" size="small" type="success" @click="completePlan(row)">完成</el-button>
          <el-button size="small" type="danger" @click="deletePlan(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { getFollowUpPlansAPI, updateFollowUpPlanAPI, deleteFollowUpPlanAPI } from '@/api/followup'

const plans = ref([])
const emit = defineEmits(['view-details'])

const priorityMap = {
  0: '最高',
  1: '较高',
  2: '正常',
  3: '较低'
}

const priorityTagType = {
  3: 'success',
  2: 'info',
  1: 'warning',
  0: 'danger'
}

const statusMap = {
  0: '未执行',
  1: '进行中',
  2: '已完成',
  3: '已记录'
}

const statusTagType = {
  0: 'info',
  1: 'primary',
  2: 'success',
  3: 'warning'
}



onMounted(() => {
  fetchPlans()
})

async function fetchPlans() {
  const response = await getFollowUpPlansAPI()
  plans.value = response.data.data.filter(plan => plan.status < 2)
}

function viewDetails(plan) {
  emit('view-details', plan)
}

async function executePlan(plan) {
  plan.status = 1 // Set status to '进行中'
  await updateFollowUpPlanAPI(plan)
  fetchPlans() // Refresh the list
}

async function completePlan(plan) {
  await ElMessageBox.confirm('您确定要完成此计划吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    plan.status = 2 // Set status to '已完成'
    await updateFollowUpPlanAPI(plan)
    fetchPlans() // Refresh the list
  }).catch(() => {
    // 取消操作
  });
}

async function deletePlan(planId) {
  await deleteFollowUpPlanAPI(planId)
  fetchPlans() // Refresh the list
}

function tableRowClassName({ row }) {
  if (row.priority === 2) {
    return 'priority-high'
  } else if (row.priority === 1) {
    return 'priority-medium'
  }
  return ''
}
</script>

<style scoped>
.el-table .priority-high {
  background: #fef0f0;
}

.el-table .priority-medium {
  background: #fdf6ec;
}
</style>