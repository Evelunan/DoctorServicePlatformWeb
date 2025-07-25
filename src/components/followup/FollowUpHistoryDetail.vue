<template>
  <div class="follow-up-history-detail-container">
    <el-page-header @back="goBack" content="随访历史详情" class="page-header"></el-page-header>
    <el-card class="detail-card">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ detailedRecord.id }}</el-descriptions-item>
        <el-descriptions-item label="计划ID">{{ detailedRecord.planId }}</el-descriptions-item>
        <el-descriptions-item label="医生姓名">{{ detailedRecord.doctorName }}</el-descriptions-item>
        <el-descriptions-item label="老人姓名">{{ detailedRecord.elderName }}</el-descriptions-item>
        <el-descriptions-item label="随访时间">{{ detailedRecord.followupTime }}</el-descriptions-item>
        <el-descriptions-item label="健康状况">
          <el-tag :type="healthStatusTagType(detailedRecord.healthStatus)" effect="light">
            {{ healthStatusText(detailedRecord.healthStatus) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="生活方式">{{ detailedRecord.lifeStyle }}</el-descriptions-item>
        <el-descriptions-item label="用药情况">{{ detailedRecord.medication }}</el-descriptions-item>
        <el-descriptions-item label="随访方式">{{ detailedRecord.method }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ detailedRecord.notes }}</el-descriptions-item>
        <el-descriptions-item label="随访备注">{{ detailedRecord.remark }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFollowUpStore } from '@/stores/followup'

const emit = defineEmits(['back'])

function goBack() {
  emit('back')
}

const props = defineProps({
  recordId: [Number, String]
})

const followUpStore = useFollowUpStore()

const detailedRecord = computed(() => {
  return followUpStore.getRecordById(props.recordId) || {}
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
</script>

<style scoped>
.follow-up-history-detail-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.detail-card {
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  padding: 20px;
}
</style>