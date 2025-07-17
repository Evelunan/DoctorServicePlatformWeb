<template>
  <el-card class="patient-list-card">
    <template #header>
      <div class="card-header">
        <span>我的病人列表</span>
        <el-button v-if="!userStore.isElderly" type="primary" size="small" @click="addPatient">添加病人</el-button>
      </div>
    </template>

    <el-table :data="patientList" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="120" />
      <el-table-column prop="gender" label="性别" width="80">
        <template #default="scope">
          {{ scope.row.gender === 0 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column prop="birthdate" label="出生日期" width="120" />
      <el-table-column prop="phone" label="联系电话" width="140" />
      <el-table-column prop="address" label="地址" />
      <!-- <el-table-column prop="lastVisit" label="最近随访" width="120" /> -->
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click.stop="viewArchive(scope.row)">查看档案</el-button>
          <el-button v-if="!userStore.isElderly" size="small" type="danger" @click.stop="removePatient(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>


    <!-- 健康档案弹窗，支持查看/编辑/添加 -->
    <el-dialog
      v-model="patientArchiveDialogVisible"
      :title="archiveMode === 'view' ? '健康档案 - 只读' : (archiveMode === 'edit' && (!currentPatientArchive || Object.keys(currentPatientArchive).length === 0) ? '添加新病人' : '健康档案 - 编辑')"
      width="90%"
      :close-on-click-modal="false"
      top="5vh"
    >
      <div class="add-patient-container">
        <CompleteHealthArchive
          ref="archiveRef"
          :mode="archiveMode"
          :patientData="currentPatientArchive"
          @save="handleArchiveSave"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <!-- 添加病人时 -->
          <el-button v-if="archiveMode === 'edit' && (!currentPatientArchive || Object.keys(currentPatientArchive).length === 0)" type="primary" @click="saveNewPatient">保存病人</el-button>
          <el-button v-if="archiveMode === 'edit' && (!currentPatientArchive || Object.keys(currentPatientArchive).length === 0)" @click="patientArchiveDialogVisible = false">关闭</el-button>

          <!-- 查看档案时 -->
          <el-button v-if="archiveMode === 'view' && currentPatientArchive && Object.keys(currentPatientArchive).length > 0" type="primary" @click="archiveMode = 'edit'">编辑档案</el-button>
          <el-button v-if="archiveMode === 'view' && currentPatientArchive && Object.keys(currentPatientArchive).length > 0" @click="patientArchiveDialogVisible = false">关闭</el-button>

          <!-- 编辑档案时（已有病人） -->
          <el-button v-if="archiveMode === 'edit' && currentPatientArchive && Object.keys(currentPatientArchive).length > 0" type="primary" @click="saveNewPatient">保存</el-button>
          <el-button v-if="archiveMode === 'edit' && currentPatientArchive && Object.keys(currentPatientArchive).length > 0" @click="cancelEdit">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPatientList, removePatient as removePatientApi, getPatientArchive } from '@/api/patient'
import { savePatientArchive, updatePatientArchive } from '@/api/patient'
import CompleteHealthArchive from '@/components/health-archive/CompleteHealthArchive.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const patientList = ref([])
// const dialogVisible = ref(false)
const archiveRef = ref()

// 新增：档案弹窗相关变量
const patientArchiveDialogVisible = ref(false)
const currentPatientArchive = ref(null)
const archiveMode = ref('view') // 'view' | 'edit'

const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)


onMounted(() => {
  loadPatientList()
})

// 加载病人列表
const loadPatientList = async () => {
  try {
    const res = await getPatientList({
      doctorId: userStore.userId,
      pageNum: pageNum.value,
      pageSize: pageSize.value
    })
    if (res && res.data && res.data.code === 0) {
      patientList.value = res.data.data.list || []
      total.value = res.data.data.total || 0
    } else {
      ElMessage.error(res.data?.message || '加载病人列表失败')
    }
  } catch (error) {
    console.error('加载病人列表失败:', error)
    ElMessage.error('加载病人列表失败')
  }
}

const handleCurrentChange = (val) => {
  pageNum.value = val
  loadPatientList()
}
const handleSizeChange = (val) => {
  pageSize.value = val
  pageNum.value = 1
  loadPatientList()
}

// 修改：查看档案
const viewArchive = async (patient) => {
  try {
    const res = await getPatientArchive(patient.id)
    if (res && res.data && res.data.code === 0) {
      currentPatientArchive.value = res.data.data
      archiveMode.value = 'view'
      patientArchiveDialogVisible.value = true
    } else {
      ElMessage.error('获取档案信息失败')
    }
  } catch (error) {
    console.error('获取档案信息失败:', error)
    ElMessage.error('获取档案信息失败')
  }
}

// 修改：添加病人
const addPatient = () => {
  currentPatientArchive.value = {} // 传递空对象，表单内容为空
  archiveMode.value = 'edit'
  patientArchiveDialogVisible.value = true
  // 弹窗打开后清空表单
  setTimeout(() => {
    if (archiveRef.value) {
      archiveRef.value.resetForm()
    }
  }, 100)
}

// 保存新病人
const saveNewPatient = async () => {
  try {
    // 只通过健康档案组件的saveArchive方法收集和校验所有数据
    if (archiveRef.value) {
      await archiveRef.value.saveArchive()
      // 数据会通过@save自动回调handleArchiveSave
    }
  } catch (error) {
    console.error('保存新病人失败:', error)
    ElMessage.error('保存失败，请检查表单信息')
  }
}

// 处理健康档案保存
const handleArchiveSave = async (archiveData) => {
  try {
    // 组装后端需要的数据结构
    const data = {
      ...archiveData.personalInfo,
      healthInfo: archiveData.basicHealthInfo,
      diseaseHistoryList: archiveData.diseaseHistory,
      familyHistoryList: archiveData.familyDiseaseHistory
    }
    let res
    // 判断是添加还是编辑
    if (!currentPatientArchive.value || Object.keys(currentPatientArchive.value).length === 0) {
      // 添加新病人
      res = await savePatientArchive(data)
    } else {
      // 编辑已有病人
      res = await updatePatientArchive(data)
    }
    if (res && res.data && res.data.code === 0) {
      ElMessage.success('保存成功！')
      patientArchiveDialogVisible.value = false
      await loadPatientList()
    } else {
      ElMessage.error(res.data?.message || '保存失败，请稍后重试')
    }
  } catch (error) {
    console.error('保存病人失败:', error)
    ElMessage.error('保存失败，请稍后重试')
  }
}

// 移除病人
const removePatient = async (patient) => {
  try {
    await ElMessageBox.confirm(`确定要移除病人 ${patient.username || patient.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const doctorId = userStore.userId || 1 // 从用户store获取医生ID
    const res = await removePatientApi(patient.id, doctorId)
    if (res && res.data && res.data.code === 0) {
      await loadPatientList()
      ElMessage.success('病人移除成功！')
    } else {
      ElMessage.error(res.data?.message || '移除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('移除病人失败:', error)
      ElMessage.error('移除失败，请稍后重试')
    }
  }
}

// 新增取消编辑逻辑
const cancelEdit = () => {
  archiveMode.value = 'view'
}
</script>

<style scoped>
.patient-list-card {
  width: 100%;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.add-patient-container {
  max-height: 70vh;
  overflow-y: auto;
}

:deep(.el-dialog__body) {
  padding: 0;
  max-height: 70vh;
  overflow: hidden;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  background: #f5f7fa;
  border-top: 1px solid #e4e7ed;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
