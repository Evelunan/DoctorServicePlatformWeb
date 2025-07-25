<template>
  <div>
    <el-table :data="warnings" style="width: 100%" stripe border>
      <el-table-column prop="name" label="预警项目" width="120" />
      <el-table-column prop="level" label="级别" width="100">
        <template #default="scope">
          <el-tag :type="getTagType(scope.row.level)">
            {{ getLevelText(scope.row.level) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="预警描述" width="180" />
      <el-table-column prop="warningTime" label="预警时间" width="180">
        <template #default="scope">
          {{ scope.row.warningTime ? (scope.row.warningTime.length === 19 ? scope.row.warningTime : dayjs(scope.row.warningTime).format('YYYY-MM-DD HH:mm:ss')) : '' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="处理状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status ? 'success' : 'danger'">
            {{ scope.row.status ? '已处理' : '未处理' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-tooltip
            v-if="!scope.row.status && userStore.isElderly"
            content="等待医生处理"
            placement="top"
          >
            <el-button
              type="primary"
              size="small"
              disabled
            >处理</el-button>
          </el-tooltip>
          <el-button
            v-else-if="!scope.row.status && !userStore.isElderly"
            type="primary"
            size="small"
            @click="openHandleDialog(scope.row)"
          >处理</el-button>
          <el-button
            v-else
            type="success"
            size="small"
            @click="openViewDialog(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 处理弹窗 -->
    <el-dialog v-model="handleDialogVisible" title="预警处理" width="400px">
      <div>
        <el-form :model="currentWarning">
          <el-form-item label="处理建议">
            <el-input v-model="currentWarning.suggestion" type="textarea" :rows="3" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="handleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitHandle">提交</el-button>
      </template>
    </el-dialog>

    <!-- 查看建议弹窗 -->
    <el-dialog v-model="viewDialogVisible" title="处理建议" width="400px" :show-close="true">
      <div>
        <el-form>
          <el-form-item label="处理建议">
            <el-input v-model="viewRemark" type="textarea" :rows="3" readonly />
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
import { ref, watch, onMounted } from 'vue'
import { getWarningInfo, updatWarningInfo } from '@/api/warningProcess'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const props = defineProps({
  userId: {
    type: [String, Number],
    required: true
  }
})

// 分页相关状态
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

const warnings = ref([])

const loadWarnings = async () => {
  if (!props.userId) {
    warnings.value = []
    return
  }
  try {
    const res = await getWarningInfo(props.userId, pageNum.value, pageSize.value)
    if (res && res.data && res.data.code === 0) {
      warnings.value = res.data.data.list || []
      total.value = res.data.data.total || 0
    } else {
      warnings.value = []
      ElMessage.error(res.data?.message || '获取预警信息失败')
    }
  } catch {
    warnings.value = []
    ElMessage.error('获取预警信息失败')
  }
}

// 处理页码变化
const handleCurrentChange = (val) => {
  pageNum.value = val
  loadWarnings()
}

// 处理每页条数变化
const handleSizeChange = (val) => {
  pageSize.value = val
  pageNum.value = 1
  loadWarnings()
}

onMounted(loadWarnings)
watch(() => props.userId, () => {
  pageNum.value = 1
  loadWarnings()
})

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
  return ''
}

const handleDialogVisible = ref(false)
const viewDialogVisible = ref(false)
const currentWarning = ref({})
const viewRemark = ref('')

function openHandleDialog(row) {
  currentWarning.value = { ...row }
  handleDialogVisible.value = true
}
async function submitHandle() {
  if (!currentWarning.value.suggestion) {
    ElMessage.warning('请填写处理建议')
    return
  }
  try {
    const res = await updatWarningInfo({ ...currentWarning.value, status: true })
    if (res && res.data && res.data.code === 0) {
      currentWarning.value.status = true
      ElMessage.success('处理成功')
      handleDialogVisible.value = false
      // 可选：刷新列表
      await loadWarnings()
    } else {
      ElMessage.error(res.data?.message || '处理失败')
    }
  } catch {
    ElMessage.error('处理失败')
  }
}
function openViewDialog(row) {
  viewRemark.value = row.suggestion || '无'
  viewDialogVisible.value = true
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
