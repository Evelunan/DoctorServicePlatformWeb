<template>
  <div class="warning-handle">
    <h3>健康预警处理</h3>
    <template v-if="!selectedUser">
      <el-table :data="warningUsers" style="width: 100%" stripe border>
        <el-table-column prop="username" label="患者姓名" width="120" />
        <el-table-column prop="unProcessed" label="未处理预警数" width="120" />
        <el-table-column prop="processed" label="已处理预警数" width="120" />
        <el-table-column prop="maxLevel" label="最高预警等级" width="140">
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.maxLevel)" style="cursor:pointer" @click.stop="showUserWarnings(scope.row)">
              {{ getLevelText(scope.row.maxLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="warningTime" label="最近预警时间" width="180">
          <template #default="scope">
            {{ scope.row.warningTime ? dayjs(scope.row.warningTime).format('YYYY-MM-DD HH:mm:ss') : '' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" size="small" @click="showUserWarnings(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-else>
      <el-button @click="backToList" type="primary" plain style="margin-bottom: 16px;">返回</el-button>
      <UserWarningList :user-id="selectedUser.userId" />
    </template>

    <!-- 处理弹窗 -->
    <el-dialog v-model="handleDialogVisible" title="预警处理" width="400px">
      <div>
        <el-form :model="currentWarning">
          <el-form-item label="处理意见">
            <el-input v-model="currentWarning.handleRemark" type="textarea" rows="3" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="handleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitHandle">提交</el-button>
      </template>
    </el-dialog>

    <!-- 查看处理方案弹窗 -->
    <el-dialog v-model="viewDialogVisible" title="处理方案" width="400px" :show-close="true">
      <div>
        <el-form>
          <el-form-item label="处理意见">
            <el-input v-model="viewRemark" type="textarea" rows="3" readonly />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import UserWarningList from './UserWarningList.vue'
import { listWarningUsers } from '@/api/warningProcess'
import dayjs from 'dayjs'

// 预警用户列表
const warningUsers = ref([])
const selectedUser = ref(null)

// 处理弹窗逻辑
const handleDialogVisible = ref(false)
const currentWarning = ref({})
function submitHandle() {
  // 这里可以根据实际业务处理预警
  ElMessage.success('处理成功')
  handleDialogVisible.value = false
}

// 查看处理方案弹窗逻辑
const viewDialogVisible = ref(false)
const viewRemark = ref('')

function showUserWarnings(row) {
  selectedUser.value = row
}
function backToList() {
  selectedUser.value = null
}

// 级别文字和标签类型映射
function getLevelText(level) {
  if (level === 0) return '极高危'
  if (level === 1) return '高危'
  if (level === 2) return '中危'
  if (level === 3) return '低危'
  if (level === 4) return '关注'
  return '未知'
}
function getTagType(level) {
  if (level === 0) return 'danger'
  if (level === 1) return 'danger'
  if (level === 2) return 'warning'
  if (level === 3) return 'info'
  if (level === 4) return 'success'
  return 'info'
}

onMounted(async () => {
  try {
    const res = await listWarningUsers()
    if (res && res.data && res.data.code === 0) {
      warningUsers.value = res.data.data || []
    } else {
      ElMessage.error(res.data?.message || '获取预警用户失败')
    }
  } catch {
    ElMessage.error('获取预警用户失败')
  }
})
</script>

<style scoped>
.warning-handle {
  background: #fff;
  padding: 24px;
  border-radius: 10px;
  min-height: 400px;
}
</style>
