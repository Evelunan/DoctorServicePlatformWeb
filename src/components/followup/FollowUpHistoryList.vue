<template>
  <div v-loading="isLoading">
    <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" />
    <el-table v-if="!error" :data="historyRecords" style="width: 100%">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="doctorName" label="医生姓名" width="180"></el-table-column>
      <el-table-column prop="elderName" label="老人姓名" width="180"></el-table-column>
      <el-table-column prop="followupTime" label="随访时间"></el-table-column>
      <el-table-column label="健康状况">
        <template #default="{ row }">
          <el-tag :type="healthStatusTagType(row.healthStatus)">
            {{ healthStatusText(row.healthStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="viewDetails(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFollowUpStore } from '@/stores/followup'

const followUpStore = useFollowUpStore()
const { historyRecords, isLoading, error } = storeToRefs(followUpStore)

const emit = defineEmits(['view-details'])

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