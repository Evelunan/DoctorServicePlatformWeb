<template>
  <div>
    <el-page-header @back="goBack" content="随访历史详情"></el-page-header>
    <el-card class="box-card">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ record.id }}</el-descriptions-item>
        <el-descriptions-item label="计划ID">{{ record.planId }}</el-descriptions-item>
        <el-descriptions-item label="医生姓名">{{ record.doctorName }}</el-descriptions-item>
        <el-descriptions-item label="老人姓名">{{ record.elderName }}</el-descriptions-item>
        <el-descriptions-item label="随访时间">{{ record.followupTime }}</el-descriptions-item>
        <el-descriptions-item label="健康状况">{{ record.healthStatus }}</el-descriptions-item>
        <el-descriptions-item label="生活方式">{{ record.lifeStyle }}</el-descriptions-item>
        <el-descriptions-item label="用药情况">{{ record.medication }}</el-descriptions-item>
        <el-descriptions-item label="随访方式">{{ record.method }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ record.notes }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getonePlansAPI } from '@/api/followup'
import { getUser } from '@/api/user'

const props = defineProps({
  record: Object
})

const emit = defineEmits(['back'])

const detailedRecord = ref({})

watch(() => props.record, async (newRecord) => {
  if (newRecord && newRecord.id) {
    let completeRecord = { ...newRecord };

    if (!newRecord.elderName || !newRecord.doctorName) {
        if (newRecord.planId) {
            try {
                const planRes = await getonePlansAPI(newRecord.planId);
                const plan = planRes.data.data;
                if (plan) {
                    completeRecord.elderName = plan.elderName;
                    completeRecord.method = plan.method;
                    completeRecord.notes = plan.notes;
                    if (plan.doctorId) {
                        try {
                            const userRes = await getUser(plan.doctorId);
                            completeRecord.doctorName = userRes.data.data.username;
                        } catch (e) {
                            console.error(`获取医生信息失败 for doctorId: ${plan.doctorId}`, e);
                            completeRecord.doctorName = '获取失败';
                        }
                    }
                }
            } catch (e) {
                console.error(`获取计划信息失败 for planId: ${newRecord.planId}`, e);
            }
        }
    }
    detailedRecord.value = completeRecord;
  }
}, { immediate: true, deep: true });

function goBack() {
  emit('back')
}
</script>

<style scoped>
.box-card {
  margin-top: 20px;
}
</style>