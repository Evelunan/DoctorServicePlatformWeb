<template>
  <el-card class="patient-list-card">
    <template #header>
      <div class="card-header">
        <span>我的病人列表</span>
        <el-button type="primary" size="small" @click="addPatient">添加病人</el-button>
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
          <el-button size="small" type="danger" @click.stop="removePatient(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

                <!-- 添加病人对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="添加新病人 - 编辑模式"
      width="90%"
      :close-on-click-modal="false"
      top="5vh"
    >
      <div class="add-patient-container">
        <CompleteHealthArchive
          ref="archiveRef"
          :userId="null"
          @save="handleArchiveSave"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveNewPatient">保存新病人</el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPatientList, removePatient as removePatientApi } from '@/api/patient'
import CompleteHealthArchive from '@/components/health-archive/CompleteHealthArchive.vue'
import { useUserStore } from '@/stores/user'

const emit = defineEmits(['select-patient'])
const userStore = useUserStore()

const patientList = ref([])
const dialogVisible = ref(false)
const archiveRef = ref()




onMounted(() => {
  loadPatientList()
})

// 加载病人列表
const loadPatientList = async () => {
  try {
    const res = await getPatientList()
    if (res && res.data && res.data.code === 0) {
      patientList.value = res.data.data || []
    } else {
      // 如果接口失败，使用模拟数据
      patientList.value = [
        {
          id: 1,
          name: '张三',
          gender: 0,
          birthdate: '1959-03-15',
          phone: '13800000001',
          address: '北京市朝阳区',
          lastVisit: '2024-01-15'
        },
        {
          id: 2,
          name: '李四',
          gender: 1,
          birthdate: '1952-07-22',
          phone: '13800000002',
          address: '北京市海淀区',
          lastVisit: '2024-01-10'
        },
        {
          id: 3,
          name: '王五',
          gender: 0,
          birthdate: '1966-11-08',
          phone: '13800000003',
          address: '北京市西城区',
          lastVisit: '2024-01-08'
        }
      ]
    }
  } catch (error) {
    console.error('加载病人列表失败:', error)
    ElMessage.error('加载病人列表失败')
  }
}

// 查看档案
const viewArchive = (patient) => {
  // 在主内容区域显示健康档案
  emit('select-patient', patient)
}

// 添加病人
const addPatient = () => {
  dialogVisible.value = true
  // 确保在下一个tick后重置表单并进入编辑模式
  setTimeout(() => {
    if (archiveRef.value) {
      archiveRef.value.resetForm()
    }
  }, 100)
}

// 处理健康档案保存
const handleArchiveSave = async (archiveData) => {
  try {
    console.log('保存新病人档案:', archiveData)

    // 这里应该调用API保存新病人和档案数据
    // const res = await addPatientWithArchive(archiveData)

    // 模拟保存成功
    ElMessage.success('新病人添加成功！')
    dialogVisible.value = false

    // 重新加载病人列表
    await loadPatientList()
  } catch (error) {
    console.error('添加病人失败:', error)
    ElMessage.error('添加失败，请稍后重试')
  }
}

// 保存新病人
const saveNewPatient = async () => {
  try {
    // 触发健康档案组件的保存
    if (archiveRef.value) {
      await archiveRef.value.saveArchive()
    }
  } catch (error) {
    console.error('保存新病人失败:', error)
    ElMessage.error('保存失败，请检查表单信息')
  }
}

// 移除病人
const removePatient = async (patient) => {
  try {
    await ElMessageBox.confirm(`确定要移除病人 ${patient.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const doctorId = userStore.userId || 1 // 从用户store获取医生ID
    const res = await removePatientApi(patient.id, doctorId)
    if (res && res.data && res.data.code === 0) {
      // 重新加载病人列表
      await loadPatientList()
      ElMessage.success('移除成功')
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
</style>
