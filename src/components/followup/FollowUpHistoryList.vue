<template>
  <div>
    <el-table :data="records" style="width: 100%">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="doctorName" label="医生姓名" width="180"></el-table-column>
      <el-table-column prop="elderName" label="老人姓名" width="180"></el-table-column>
      <el-table-column prop="followupTime" label="随访时间"></el-table-column>
      <el-table-column prop="healthStatus" label="健康状况"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="viewDetails(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFollowUpRecordsAPI, getonePlansAPI } from '@/api/followup'
import { getUser } from '@/api/user'

const records = ref([])
const emit = defineEmits(['view-details'])

onMounted(async () => {
  try {
    const res = await getFollowUpRecordsAPI()
    const historyList = res.data.data || []

    const enrichedRecords = await Promise.all(historyList.map(async (record) => {
      let elderName = 'N/A';
      let doctorName = 'N/A';
      let method = 'N/A';
      let notes = 'N/A';

      if (record.planId) {
        try {
          const planRes = await getonePlansAPI(record.planId)
          const plan = planRes.data.data
          if (plan) {
            elderName = plan.elderName;
            method = plan.method;
            notes = plan.notes;
            if (plan.doctorId) {
              try {
                const userRes = await getUser(plan.doctorId)
                doctorName = userRes.data.data.username
              } catch (e) {
                console.error(`获取医生信息失败 for doctorId: ${plan.doctorId}`, e)
              }
            }
          }
        } catch (e) {
          console.error(`获取计划信息失败 for planId: ${record.planId}`, e)
        }
      }
      return { ...record, elderName, doctorName, method, notes };
    }));

    records.value = enrichedRecords;
  } catch (error) {
    console.error("获取随访历史记录失败", error)
  }
})

function viewDetails(record) {
  emit('view-details', record)
}
</script>