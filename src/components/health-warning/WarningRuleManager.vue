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
        <el-table :data="historyDiseaseList" style="width: 100%" stripe border class="rule-table">
          <el-table-column prop="name" label="疾病名称">
            <template #default="scope">
              <el-input
                v-model="scope.row.name"
                size="small"
                placeholder="请输入疾病名称"
                :input-style="{ color: getLevelColor(scope.row.level), fontWeight: 500 }"
              />
            </template>
          </el-table-column>
          <el-table-column label="严重程度" width="120">
            <template #default="scope">
              <el-select v-model="scope.row.level" size="small" style="width: 90px">
                <template #value="{ value }">
                  <span :style="{ color: getLevelColor(value), fontWeight: 500 }">{{ getLevelText(value) }}</span>
                </template>
                <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="是否启用" width="100">
            <template #default="scope">
              <el-switch v-model="scope.row.enabled" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button type="danger" size="mini" @click="removeKeyword(historyDiseaseList, scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button icon="el-icon-plus" size="mini" @click="addHistoryDisease" style="margin:8px 0;">新增</el-button>
      </el-tab-pane>
      <el-tab-pane label="家族病史" name="family">
        <el-table :data="familyDiseaseList" style="width: 100%" stripe border class="rule-table">
          <el-table-column prop="name" label="疾病名称">
            <template #default="scope">
              <el-input
                v-model="scope.row.name"
                size="small"
                placeholder="请输入疾病名称"
                :input-style="{ color: getLevelColor(scope.row.level), fontWeight: 500 }"
              />
            </template>
          </el-table-column>
          <el-table-column label="严重程度" width="120">
            <template #default="scope">
              <el-select v-model="scope.row.level" size="small" style="width: 90px">
                <template #value="{ value }">
                  <span :style="{ color: getLevelColor(value), fontWeight: 500 }">{{ getLevelText(value) }}</span>
                </template>
                <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="是否启用" width="100">
            <template #default="scope">
              <el-switch v-model="scope.row.enabled" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button type="danger" size="mini" @click="removeKeyword(familyDiseaseList, scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button icon="el-icon-plus" size="mini" @click="addFamilyDisease" style="margin:8px 0;">新增</el-button>
      </el-tab-pane>
    </el-tabs>
    <div class="footer-bar">
      <el-button type="primary" @click="saveRules">保存设置</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { WarningFilled, CaretTop, CaretBottom, User, Watermelon, ColdDrink, Sugar, Odometer } from '@element-plus/icons-vue'

const activeTab = ref('param')
const levelOptions = [
  { label: '极高危', value: 'critical' },
  { label: '高危', value: 'danger' },
  { label: '中危', value: 'warning' },
  { label: '低危', value: 'info' },
  { label: '关注', value: 'primary' }
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

const allRules = ref([
  { name: 'BMI', type: 'bmi', hasLower: true, hasUpper: true, lower: 18.5, upper: 28, enabled: true, level: 'warning' },
  { name: '心率（次/分）', type: 'heartRate', hasLower: true, hasUpper: true, lower: 60, upper: 100, enabled: true, level: 'warning' },
  { name: '体温（℃）', type: 'temperature', hasLower: true, hasUpper: true, lower: 36.0, upper: 37.3, enabled: true, level: 'warning' },
  { name: '收缩压（mmHg）', type: 'systolic', hasLower: true, hasUpper: true, lower: 90, upper: 140, enabled: true, level: 'danger' },
  { name: '舒张压（mmHg）', type: 'diastolic', hasLower: true, hasUpper: true, lower: 60, upper: 90, enabled: true, level: 'danger' },
  { name: '空腹血糖（mmol/L）', type: 'fastingGlucose', hasLower: true, hasUpper: true, lower: 3.9, upper: 7.0, enabled: true, level: 'danger' },
  { name: '血氧饱和度（%）', type: 'spo2', hasLower: true, hasUpper: true, lower: 94, upper: 100, enabled: true, level: 'danger' },
])

const historyDiseaseList = ref([
  { name: '高血压', level: 'danger', enabled: true },
  { name: '糖尿病', level: 'warning', enabled: true }
])
const familyDiseaseList = ref([
  { name: '冠心病', level: 'danger', enabled: true },
  { name: '脑卒中', level: 'warning', enabled: true }
])

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

// 病史类关键字编辑
function removeKeyword(list, idx) {
  list.value.splice(idx, 1)
}

function addHistoryDisease() {
  historyDiseaseList.value.push({ name: '', level: 'danger', enabled: true })
}
function addFamilyDisease() {
  familyDiseaseList.value.push({ name: '', level: 'danger', enabled: true })
}

function getLevelText(level) {
  if (level === 'critical') return '极高危'
  if (level === 'danger') return '高危'
  if (level === 'warning') return '中危'
  if (level === 'info') return '低危'
  if (level === 'primary') return '关注'
  return '未知'
}

function getLevelColor(level) {
  if (level === 'critical') return '#c0392b'
  if (level === 'danger') return '#f56c6c'
  if (level === 'warning') return '#e6a23c'
  if (level === 'info') return '#409eff'
  if (level === 'primary') return '#67c23a'
  return '#606266'
}

function saveRules() {
  // 这里可对接后端API保存
  ElMessage.success('规则设置已保存！')
  // 示例：console.log(JSON.stringify(allRules.value), JSON.stringify(historyDiseaseList.value), JSON.stringify(familyDiseaseList.value))
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
