<template>
  <div class="follow-up-history-list-container" v-loading="isLoading">
    <el-page-header v-if="from === 'record'" @back="goBack" content="随访历史列表" class="page-header"></el-page-header>
    
    <!-- Filters -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="医生姓名">
          <el-select v-model="filters.doctorName" placeholder="请选择或输入医生姓名" clearable filterable allow-create default-first-option>
            <el-option v-for="doctor in doctorList" :key="doctor" :label="doctor" :value="doctor"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="老人姓名">
          <el-select v-model="filters.elderName" placeholder="请选择或输入老人姓名" clearable filterable allow-create default-first-option>
            <el-option v-for="elder in elderList" :key="elder" :label="elder" :value="elder"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="健康状况" class="health-status-filter">
          <el-select v-model="filters.healthStatus" placeholder="请选择健康状况" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="健康" :value="0"></el-option>
            <el-option label="病情好转" :value="1"></el-option>
            <el-option label="病况维持" :value="2"></el-option>
            <el-option label="病情恶化" :value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" />
    <el-card class="table-card" v-if="!error">
      <el-table :data="paginatedRecords" style="width: 100%" @sort-change="handleSortChange">
        <el-table-column prop="id" label="ID" width="180"></el-table-column>
        <el-table-column prop="doctorName" label="医生姓名" width="180"></el-table-column>
        <el-table-column prop="elderName" label="老人姓名" width="180"></el-table-column>
        <el-table-column prop="followupTime" label="随访时间" sortable="custom"></el-table-column>
        <el-table-column label="健康状况">
          <template #default="{ row }">
            <el-tag :type="healthStatusTagType(row.healthStatus)" effect="light">
              {{ healthStatusText(row.healthStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetails(row)" icon="el-icon-view">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredRecords.length">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.follow-up-history-list-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.filter-card {
  margin-bottom: 20px;
  border-radius: 10px;
}

.filter-form {
  padding: 10px;
}

.table-card {
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.el-table {
  border-radius: 10px;
}

.health-status-filter .el-select {
  min-width: 180px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFollowUpStore } from '@/stores/followup'

const followUpStore = useFollowUpStore()
const { historyRecords, isLoading, error } = storeToRefs(followUpStore)

const doctorList = computed(() => {
  const names = historyRecords.value.map(r => r.doctorName)
  return [...new Set(names)]
})
const elderList = computed(() => {
  const names = historyRecords.value.map(r => r.elderName)
  return [...new Set(names)]
})

const filters = ref({
  doctorName: '',
  elderName: '',
  healthStatus: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const sortOrder = ref(null) // 'ascending' or 'descending'

const filteredRecords = computed(() => {
  let records = [...historyRecords.value]

  if (filters.value.doctorName) {
    records = records.filter(r => r.doctorName && r.doctorName.includes(filters.value.doctorName))
  }
  if (filters.value.elderName) {
    records = records.filter(r => r.elderName && r.elderName.includes(filters.value.elderName))
  }
  if (filters.value.healthStatus !== '') {
    records = records.filter(r => r.healthStatus === filters.value.healthStatus)
  }

  if (sortOrder.value) {
    records.sort((a, b) => {
      const dateA = new Date(a.followupTime)
      const dateB = new Date(b.followupTime)
      return sortOrder.value === 'ascending' ? dateA - dateB : dateB - dateA
    })
  }

  return records
})

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRecords.value.slice(start, end)
})

function handleSizeChange(val) {
  pageSize.value = val
}

function handleCurrentChange(val) {
  currentPage.value = val
}

function handleSortChange({ prop, order }) {
  if (prop === 'followupTime') {
    sortOrder.value = order
  }
}

const props = defineProps({
  from: String
})

const emit = defineEmits(['view-details', 'back'])

function goBack() {
  emit('back')
}

onMounted(() => {
  // Only fetch history if it hasn't been loaded yet
  if (!followUpStore.recordsLoaded) {
    followUpStore.fetchFollowUpHistory()
  }
})

const healthStatusMap = {
  0: '健康',
  1: '病情好转',
  2: '病况维持',
  3: '病情恶化'
};

const healthStatusTagMap = {
  0: 'success',
  1: 'primary',
  2: 'warning',
  3: 'danger'
};

const healthStatusText = (status) => {
  return healthStatusMap[status] || '未知';
};

const healthStatusTagType = (status) => {
  return healthStatusTagMap[status] || 'info';
};

function viewDetails(record) {
  emit('view-details', record)
}

</script>