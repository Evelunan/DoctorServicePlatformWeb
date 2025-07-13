<template>
  <div>
    <el-table :data="plans" style="width: 100%">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="doctorName" label="医生" width="180"></el-table-column>
      <el-table-column prop="patientName" label="老人" width="180"></el-table-column>
      <el-table-column prop="priority" label="优先级">
        <template #default="{ row }">
          {{ priorityMap[row.priority] }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="viewDetails(row)">查看详情</el-button>
          <el-button size="small" type="primary" @click="editPlan(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deletePlan(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="随访计划详情">
      <div v-if="selectedPlan">
        <p><strong>ID:</strong> {{ selectedPlan.id }}</p>
        <p><strong>医生:</strong> {{ selectedPlan.doctorName }}</p>
        <p><strong>老人:</strong> {{ selectedPlan.patientName }}</p>
        <p><strong>随访预定时间:</strong> {{ selectedPlan.followUpTime }}</p>
        <p><strong>随访方式:</strong> {{ selectedPlan.followUpMethod }}</p>
        <p><strong>计划内容:</strong> {{ selectedPlan.followUpContent }}</p>
        <p><strong>优先级:</strong> {{ priorityMap[selectedPlan.priority] }}</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import { getFollowUpPlansAPI, deleteFollowUpPlanAPI } from '@/api/followup'

const plans = ref([])
const dialogVisible = ref(false)
const selectedPlan = ref(null)

const priorityMap = {
  1: '最高',
  2: '较高',
  3: '正常',
  4: '较低'
}

onMounted(() => {
  fetchPlans()
})

async function fetchPlans() {
  // This is a mock, replace with actual API call
  plans.value = [
    { id: 1, doctorName: '王医生', patientName: '张三', followUpTime: '2024-12-01 10:00', followUpMethod: '电话', followUpContent: '询问近况', priority: 1 },
    { id: 2, doctorName: '刘医生', patientName: '李四', followUpTime: '2024-12-02 14:00', followUpMethod: '上门', followUpContent: '测量血压', priority: 3 },
  ]
  // const response = await getFollowUpPlansAPI()
  // plans.value = response.data
}

function viewDetails(plan) {
  selectedPlan.value = plan
  dialogVisible.value = true
}

function editPlan(plan) {
  // Implement edit logic, e.g., emit an event to open an edit form
  console.log('Edit plan:', plan.id)
}

async function deletePlan(plan) {
  // await deleteFollowUpPlanAPI(plan.id)
  console.log('Delete plan:', plan.id)
  fetchPlans() // Refresh the list
}
</script>