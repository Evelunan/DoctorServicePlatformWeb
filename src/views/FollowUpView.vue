<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
      </div>
    </template>
    <div v-if="activeTab === 'plan'">
      <FollowUpPlan @plan-created="handlePlanCreated" />
    </div>
    <div v-if="activeTab === 'record'">
      <FollowUpRecord :plan-id="selectedPlanId" @record-created="handleRecordCreated" />
    </div>
    <div v-if="activeTab === 'history'">
      <FollowUpHistoryList v-if="currentHistoryView === 'list'" @view-details="showHistoryDetail" />
      <FollowUpHistoryDetail v-if="currentHistoryView === 'detail'" :record-id="selectedHistoryRecord.id" @back="showHistoryList" />
    </div>
    
    <div v-if="activeTab === 'plan-list'">
      <FollowUpPlanList v-if="currentView === 'list'" @view-details="showPlanDetail" />
      <FollowUpPlanDetail v-if="currentView === 'detail'" :plan="selectedPlan" @back="showPlanList" @plan-updated="handlePlanUpdated" />
    </div>
  </el-card>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import FollowUpPlan from '@/components/followup/FollowUpPlanCreate.vue'
import FollowUpRecord from '@/components/followup/FollowUpRecord.vue'
import FollowUpPlanList from '@/components/followup/FollowUpPlanList.vue'
import FollowUpPlanDetail from '@/components/followup/FollowUpPlanDetail.vue'
import FollowUpHistoryList from '@/components/followup/FollowUpHistoryList.vue'
import FollowUpHistoryDetail from '@/components/followup/FollowUpHistoryDetail.vue'

const props = defineProps({
  activeSubMenu: {
    type: String,
    default: '4-1'
  }
})

const activeTab = ref('plan')
const selectedPlanId = ref(null)
const followUpListRef = ref(null)
const currentView = ref('list')
const selectedPlan = ref(null)
const currentHistoryView = ref('list')
const selectedHistoryRecord = ref(null)

const title = computed(() => {
  const titleMap = {
    plan: '随访计划制定',
    record: '随访记录填写',
    history: '随访历史查看',
    'plan-list': '随访计划列表'
  }
  return titleMap[activeTab.value] || '重点人群随访管理'
})

const tabMap = {
  '4-2': 'plan',
  '4-3': 'record',
  '4-4': 'history',
  '4-1': 'plan-list' // Assuming a new menu item with index 4-4
}

watch(() => props.activeSubMenu, (newVal) => {
  if (tabMap[newVal]) {
    activeTab.value = tabMap[newVal]
  }
}, { immediate: true })



function handlePlanCreated() {
  activeTab.value = 'plan-list'
  if (followUpListRef.value) {
    followUpListRef.value.fetchFollowUpPlans()
  }
}

function handleRecordCreated() {
  activeTab.value = 'history'
  if (followUpListRef.value) {
    followUpListRef.value.fetchFollowUpPlans()
  }
}



function showPlanDetail(plan) {
  selectedPlan.value = plan
  currentView.value = 'detail'
}

function showPlanList() {
  currentView.value = 'list'
  selectedPlan.value = null
}

function handlePlanUpdated(updatedPlan) {
  selectedPlan.value = updatedPlan;
  // The detail view will automatically update due to the reactive nature of selectedPlan
}

function showHistoryDetail(record) {
  selectedHistoryRecord.value = record
  currentHistoryView.value = 'detail'
}

function showHistoryList() {
  currentHistoryView.value = 'list'
  selectedHistoryRecord.value = null
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>