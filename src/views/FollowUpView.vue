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
      <FollowUpRecord :plan-id="selectedPlanId" @record-created="handleRecordCreated" @switch-tab="handleSwitchTab" />
    </div>
    <div v-if="activeTab === 'history'">
      <FollowUpHistoryList v-if="currentHistoryView === 'list'" :from="previousTab" @view-details="showHistoryDetail" @back="goBack" />
      <FollowUpHistoryDetail v-if="currentHistoryView === 'detail'" :record-id="selectedHistoryRecord.id" @back="showHistoryList" />
    </div>
    
    <div v-if="activeTab === 'plan-list'">
      <FollowUpPlanList v-if="currentView === 'list'" :from="previousTab" @view-details="showPlanDetail" @back="goBack" />
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
const previousTab = ref('')
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
  previousTab.value = 'plan'
  activeTab.value = 'plan-list'
  if (followUpListRef.value) {
    followUpListRef.value.fetchFollowUpPlans()
  }
}

function handleRecordCreated() {
  previousTab.value = 'record'
  activeTab.value = 'history'
}

function handleSwitchTab(tab) {
  previousTab.value = activeTab.value
  activeTab.value = tab
}

function goBack() {
  if (previousTab.value) {
    activeTab.value = previousTab.value
    previousTab.value = '' // Reset after going back
  } else {
    // Default back action if no previous tab is set
    // For example, go to the main list view
    if (activeTab.value === 'plan-list' || activeTab.value === 'history') {
      currentView.value = 'list'
      currentHistoryView.value = 'list'
    }
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