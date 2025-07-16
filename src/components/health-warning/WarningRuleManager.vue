<template>
  <div class="warning-rule-manager">
    <div class="header">
      <div>
        <h3>预警规则管理</h3>
        <div class="desc">可根据实际需求调整各项健康参数的预警阈值，启用后将自动进行健康预警。</div>
      </div>
    </div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="一般规则" name="param">
        <el-table :data="paramRules" style="width: 100%" stripe border class="rule-table" :row-class-name="rowClassName">
          <el-table-column prop="name" label="预警项目" width="160">
            <template #default="scope">
              <el-icon
                v-if="iconMap[scope.row.type]"
                :size="18"
                :style="{ verticalAlign: 'middle', marginRight: '6px', color: getLevelColor(scope.row.level) }"
              >
                <component :is="iconMap[scope.row.type]" />
              </el-icon>
              <span :style="{ color: getLevelColor(scope.row.level), fontWeight: 500 }">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规则描述">
            <template #default="scope">
              <el-tooltip :content="getRuleDesc(scope.row)" placement="top">
                <span>{{ getRuleDesc(scope.row) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="下限">
            <template #default="scope">
              <el-input-number v-if="scope.row.hasLower" v-model="scope.row.lower" :min="-100" :max="1000" :step="getStep(scope.row.type)" size="small" style="width: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="上限">
            <template #default="scope">
              <el-input-number v-if="scope.row.hasUpper" v-model="scope.row.upper" :min="-100" :max="1000" :step="getStep(scope.row.type)" size="small" style="width: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="启用" width="80">
            <template #default="scope">
              <el-switch v-model="scope.row.enabled" />
            </template>
          </el-table-column>
          <el-table-column label="级别" width="120">
            <template #default="scope">
              <el-select v-model="scope.row.level" size="small" style="width: 90px">
                <template #value="{ value }">
                  <span :style="{ color: getLevelColor(value), fontWeight: 500 }">{{ getLevelText(value) }}</span>
                </template>
                <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="既往病史" name="history">
        <el-table :data="historyDiseaseList" row-key="id" style="width: 100%" stripe border class="rule-table">
          <el-table-column prop="name" label="疾病名称">
            <template #default="scope">
              <el-input v-model="scope.row.name" size="small" placeholder="请输入疾病名称" />
            </template>
          </el-table-column>
          <el-table-column prop="level" label="严重程度" width="120">
            <template #default="scope">
              <el-select v-model="scope.row.level" size="small" style="width: 90px">
                <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="lower" width="180">
            <template #header>
              <el-tooltip content="与复发时间差小于该值预警" placement="top">
                <span style="cursor: help; border-bottom: 1px dashed #999;">复发预警天数</span>
              </el-tooltip>
            </template>
            <template #default="scope">
              <el-input-number v-model="scope.row.lower" :min="1" :max="3650" :step="1" size="small" style="width: 120px" :placeholder="'天数'" />
            </template>
          </el-table-column>
          <el-table-column prop="enabled" label="是否启用" width="100">
            <template #default="scope">
              <el-switch v-model="scope.row.enabled" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button type="danger" size="small" @click="removeHistoryDisease(scope.row.id)">移除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <div style="color: #999;">暂无数据，请点击“新增”添加</div>
          </template>
        </el-table>
        <el-button icon="el-icon-plus" size="small" @click="addHistoryDisease" style="margin:8px 0;">新增</el-button>
      </el-tab-pane>
      <el-tab-pane label="家族病史" name="family">
        <el-table :data="familyDiseaseList" row-key="id" style="width: 100%" stripe border class="rule-table">
          <el-table-column prop="name" label="疾病名称">
            <template #default="scope">
              <el-input v-model="scope.row.name" size="small" placeholder="请输入疾病名称" />
            </template>
          </el-table-column>
          <el-table-column prop="level" label="严重程度" width="120">
            <template #default="scope">
              <el-select v-model="scope.row.level" size="small" style="width: 90px">
                <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="lower" width="180">
            <template #header>
              <el-tooltip content="与复发时间差小于该值预警" placement="top">
                <span style="cursor: help; border-bottom: 1px dashed #999;">复发预警天数</span>
              </el-tooltip>
            </template>
            <template #default="scope">
              <el-input-number v-model="scope.row.lower" :min="1" :max="3650" :step="1" size="small" style="width: 120px" :placeholder="'天数'" />
            </template>
          </el-table-column>
          <el-table-column prop="enabled" label="是否启用" width="100">
            <template #default="scope">
              <el-switch v-model="scope.row.enabled" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button type="danger" size="small" @click="removeFamilyDisease(scope.row.id)">移除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <div style="color: #999;">暂无数据，请点击“新增”添加</div>
          </template>
        </el-table>
        <el-button icon="el-icon-plus" size="small" @click="addFamilyDisease" style="margin:8px 0;">新增</el-button>
      </el-tab-pane>
    </el-tabs>
    <div class="footer-bar">
      <el-button type="primary" @click="saveRules">保存设置</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { WarningFilled, CaretTop, CaretBottom, User, Watermelon, ColdDrink, Sugar, Odometer } from '@element-plus/icons-vue'
import { getBaseWarningRules, saveWarningRulesAPI, getDiseaseList, getFamilyList, deleteWarningRulesAPI } from '@/api/healthWarning'

const activeTab = ref('param')
const currentUserId = 2 // TODO: 实际项目中应从登录信息获取

const levelOptions = [
  { label: '极高危', value: 0 },
  { label: '高危', value: 1 },
  { label: '中危', value: 2 },
  { label: '低危', value: 3 },
  { label: '关注', value: 4 }
]

const iconMap = {
  bmi: Odometer,
  heartRate: Odometer,
  temperature: ColdDrink,
  systolic: CaretTop,
  diastolic: CaretBottom,
  fastingGlucose: Sugar,
  spo2: Watermelon,
  history: User,
  familyHistory: WarningFilled
}

const allRules = ref([])

// const levelMap = {
//   0: 'critical',
//   1: 'danger',
//   2: 'warning',
//   3: 'info',
//   4: 'primary'
// }
const typeMap = {
  'BMI': 'bmi',
  '心率': 'heartRate',
  '体温': 'temperature',
  '收缩压': 'systolic',
  '舒张压': 'diastolic',
  '空腹血糖': 'fastingGlucose',
  '血氧饱和度': 'spo2'
}

onMounted(async () => {
  try {
    const res = await getBaseWarningRules()
    if (res && res.data) {
      allRules.value = res.data.data.map(item => ({
        ...item,
        type: typeMap[item.name] || 'bmi',
        // level: levelMap[item.level] ?? 'warning',
        hasLower: true,
        hasUpper: true
      }))
    }
    // 获取既往病史
    const historyRes = await getDiseaseList()
    if (historyRes && historyRes.data) {
      historyDiseaseList.value = historyRes.data.data.map(item => ({
        ...item,
        type: 1,
        lower: item.lower ?? ''
      }))
    }
    // 获取家族病史
    const familyRes = await getFamilyList()
    if (familyRes && familyRes.data) {
      familyDiseaseList.value = familyRes.data.data.map(item => ({
        ...item,
        type: 2,
        lower: item.lower ?? ''
      }))
    }
  } catch {
    ElMessage.error('获取规则数据失败')
  }
})

const historyDiseaseList = ref([])
const familyDiseaseList = ref([])

const paramRules = computed(() => allRules.value)

function getStep(type) {
  if (type === 'bmi' || type === 'temperature' || type === 'fastingGlucose') return 0.1
  return 1
}

function getRuleDesc(row) {
  if (row.type === 'bmi') return `BMI低于${row.lower}或高于${row.upper}时预警`
  if (row.type === 'heartRate') return `心率低于${row.lower}或高于${row.upper}时预警`
  if (row.type === 'temperature') return `体温低于${row.lower}或高于${row.upper}时预警`
  if (row.type === 'systolic') return `收缩压低于${row.lower}或高于${row.upper}时预警`
  if (row.type === 'diastolic') return `舒张压低于${row.lower}或高于${row.upper}时预警`
  if (row.type === 'fastingGlucose') return `空腹血糖低于${row.lower}或高于${row.upper}时预警`
  if (row.type === 'spo2') return `血氧饱和度低于${row.lower}或高于${row.upper}时预警`
  return ''
}

function rowClassName({ row }) {
  return row.enabled ? '' : 'row-disabled'
}


function removeHistoryDisease(id) {
  if (!id) {
    historyDiseaseList.value = historyDiseaseList.value.filter(item => item.index !== item.index)
    return
  }
  deleteWarningRulesAPI(id).then(res => {
    if (res && res.data) {
      historyDiseaseList.value = historyDiseaseList.value.filter(item => item.id !== id)
      ElMessage.success('删除成功')
    } else {
      ElMessage.error(res.data.message)
    }
  })
}
function removeFamilyDisease(id) {
  if (!id) {
    familyDiseaseList.value = familyDiseaseList.value.filter(item => item.index !== item.index)
    return
  }
  deleteWarningRulesAPI(id).then(res => {
    if (res && res.data) {
      familyDiseaseList.value = familyDiseaseList.value.filter(item => item.id !== id)
      ElMessage.success('删除成功')
    } else {
      ElMessage.error(res.data.message)
    }
  })
}

let tempIndex = 1

function addHistoryDisease() {
  historyDiseaseList.value.push({
    index: tempIndex++,
    name: '',
    lower: '',
    upper: null,
    level: 2,
    type: 1,
    enabled: true,
    userId: currentUserId
  })
}
function addFamilyDisease() {
  familyDiseaseList.value.push({
    index: tempIndex++,
    name: '',
    lower: '',
    upper: null,
    level: 2,
    type: 2,
    enabled: true,
    userId: currentUserId
  })
}

function getLevelText(level) {
  if (level === 0) return '极高危'
  if (level === 1) return '高危'
  if (level === 2) return '中危'
  if (level === 3) return '低危'
  if (level === 4) return '关注'
  return '未知'
}

function getLevelColor(level) {
  if (level === 0) return '#c0392b'      // CRITICAL 极高危 红色
  if (level === 1) return '#f56c6c'      // DANGER 高危 粉色
  if (level === 2) return '#e6a23c'      // WARNING 中危 橙色
  if (level === 3) return '#409eff'      // INFO 低危 蓝色
  if (level === 4) return '#67c23a'      // PRIMARY 关注 绿色
  return '#606266'
}

function saveRules() {
  let dataToSave = []
  let type = 0

  if (activeTab.value === 'history') {
    const hasEmpty = historyDiseaseList.value.some(item => !item.name || item.name.trim() === '')
    if (hasEmpty) {
      ElMessage.warning('请填写所有既往病史的疾病名称后再保存')
      return
    }
    type = 1
    dataToSave = historyDiseaseList.value.map(item => ({
      ...item,
      type
    }))
  } else if (activeTab.value === 'family') {
    const hasEmpty = familyDiseaseList.value.some(item => !item.name || item.name.trim() === '')
    if (hasEmpty) {
      ElMessage.warning('请填写所有家族病史的疾病名称后再保存')
      return
    }
    type = 2
    dataToSave = familyDiseaseList.value.map(item => ({
      ...item,
      type
    }))
  } else if (activeTab.value === 'param') {
    type = 0
    dataToSave = allRules.value.map(item => ({
      ...item,
      // level: levelReverseMap[item.level] ?? 2,
      type
    }))
  }

  if (dataToSave.length > 0) {
    saveWarningRulesAPI(dataToSave)
      .then(() => {
        ElMessage.success('规则已保存！')
      })
      .catch(() => {
        ElMessage.error('保存失败')
      })
  } else {
    ElMessage.info('当前无可保存数据')
  }
}
</script>

<style scoped>
.warning-rule-manager {
  width: 100%;
  padding: 24px 24px 0 24px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #f0f1f2;
  min-height: 480px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 18px;
}
.header h3 {
  margin: 0 0 4px 0;
  color: #303133;
}
.desc {
  font-size: 13px;
  color: #888;
  margin-bottom: 0;
}
.rule-table {
  margin-bottom: 30px;
}
.group-title {
  font-weight: bold;
  font-size: 15px;
  color: #409eff;
  margin: 18px 0 8px 0;
}
.footer-bar {
  position: sticky;
  bottom: 0;
  background: #fff;
  padding: 16px 0 16px 0;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
  z-index: 10;
}
.row-disabled {
  background: #f5f5f5 !important;
  color: #bbb !important;
}
</style>
