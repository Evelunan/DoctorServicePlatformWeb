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
      <FollowUpList ref="followUpListRef" @select-plan="handleSelectPlan" />
    </div>
    <div v-if="activeTab === 'plan-list'">
      <FollowUpPlanList />
    </div>
  </el-card>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import FollowUpPlan from '@/components/followup/FollowUpPlan.vue'
import FollowUpRecord from '@/components/followup/FollowUpRecord.vue'
import FollowUpList from '@/components/followup/FollowUpList.vue'
import FollowUpPlanList from '@/components/followup/FollowUpPlanList.vue'

const props = defineProps({
  activeSubMenu: {
    type: String,
    default: '4-1'
  }
})

const activeTab = ref('plan')
const selectedPlanId = ref(null)
const followUpListRef = ref(null)

const title = computed(() => {
  const titleMap = {
    plan: '随访计划制定',
    record: '随访记录填写',
    history: '随访历史管理',
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
  activeTab.value = 'history'
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

function handleSelectPlan(planId) {
  selectedPlanId.value = planId
  activeTab.value = 'record'
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>