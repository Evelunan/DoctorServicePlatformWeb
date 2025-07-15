<template>
  <div>
    <el-page-header v-if="from === 'plan'" @back="goBack" content="随访计划列表"></el-page-header>
    <el-form :inline="true" :model="filters" class="demo-form-inline">
      <el-form-item label="老人姓名">
        <el-select v-model="filters.elderName" placeholder="请选择或输入老人姓名" clearable filterable allow-create default-first-option>
          <el-option v-for="elder in elderList" :key="elder" :label="elder" :value="elder"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="filters.status" placeholder="请选择状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="未执行" :value="0"></el-option>
          <el-option label="进行中" :value="1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="paginatedPlans" style="width: 100%" :row-class-name="tableRowClassName" @sort-change="handleSortChange">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="elderName" label="老人姓名" width="180"></el-table-column>
      <el-table-column prop="priority" label="优先级" sortable="custom">
        <template #default="{ row }">
          <el-tag :type="priorityTagType[row.priority]">{{ priorityMap[row.priority] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="planTime" label="随访计划时间" sortable="custom"></el-table-column>
      <el-table-column prop="method" label="随访方式" width="120"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="statusTagType[row.status]">{{ statusMap[row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template #default="{ row }">
          <el-button size="small" @click="viewDetails(row)">查看详情</el-button>
          <el-button v-if="row.status === 0" size="small" type="primary" @click="executePlan(row)">执行</el-button>
          <el-button v-if="row.status === 1" size="small" type="warning" @click="cancelExecution(row)">取消执行</el-button>
          <el-button v-if="row.status === 1" size="small" type="success" @click="completePlan(row)">完成</el-button>
          <el-button v-if="row.status === 0" size="small" type="danger" @click="deletePlan(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="filteredAndSortedPlans.length">
    </el-pagination>
  </div>
</template>



<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { getFollowUpPlansAPI, updateFollowUpPlanAPI, deleteFollowUpPlanAPI } from '@/api/followup'

const plans = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const filters = ref({
  elderName: '',
  status: ''
});
const sort = ref({});

const elderList = computed(() => {
  const names = plans.value.map(p => p.elderName);
  return [...new Set(names)];
});

const filteredAndSortedPlans = computed(() => {
  let result = [...plans.value];

  // Filtering
  if (filters.value.elderName) {
    result = result.filter(p => p.elderName.includes(filters.value.elderName));
  }
  if (filters.value.status !== '') {
    result = result.filter(p => p.status === filters.value.status);
  }

  // Sorting
  if (sort.value.prop) {
    result.sort((a, b) => {
      let valA = a[sort.value.prop];
      let valB = b[sort.value.prop];
      if (sort.value.prop === 'planTime') {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      if (sort.value.order === 'ascending') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
  }

  return result;
});

const paginatedPlans = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAndSortedPlans.value.slice(start, end)
})

function handleSizeChange(val) {
  pageSize.value = val
}

function handleCurrentChange(val) {
  currentPage.value = val
}

function handleSortChange({ prop, order }) {
  sort.value = { prop, order };
}
const props = defineProps({
  from: String
})

const emit = defineEmits(['view-details', 'back'])

function goBack() {
  emit('back')
}

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

async function cancelExecution(plan) {
  plan.status = 0 // Set status to '未执行'
  await updateFollowUpPlanAPI(plan)
  fetchPlans() // Refresh the list
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