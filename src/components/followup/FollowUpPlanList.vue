<template>
  <div>
    <el-table :data="plans" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="elderName" label="老人姓名" width="180"></el-table-column>
      <el-table-column prop="priority" label="优先级">
        <template #default="{ row }">
          {{ priorityMap[row.priority] }}
        </template>
      </el-table-column>
      <el-table-column prop="planTime" label="随访计划时间"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="viewDetails(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style>
  .el-table .priority-0 {
    background: #f56c6c !important;
  }
  .el-table .priority-1 {
    background: #e6a23c !important;
  }
  .el-table .priority-2 {
    background: #409eff !important;
  }
  .el-table .priority-3 {
    background: #67c23a !important;
  }
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { getFollowUpPlansAPI } from '@/api/followup'

const plans = ref([])
const emit = defineEmits(['view-details'])

const priorityMap = {
  0: '最高',
  1: '较高',
  2: '正常',
  3: '较低'
}

onMounted(() => {
  fetchPlans()
})

async function fetchPlans() {
  const response = await getFollowUpPlansAPI()
  plans.value = response.data.data
}

function viewDetails(plan) {
  emit('view-details', plan)
}

const tableRowClassName = ({ row }) => {
  return `priority-${row.priority}`
}
</script>