<template>
  <el-card class="patient-list-card">
    <template #header>
      <div class="card-header">
        <span>我的病人列表</span>
        <el-button type="primary" size="small" @click="addPatient">添加病人</el-button>
      </div>
    </template>

    <el-table :data="patientList" style="width: 100%" @row-click="selectPatient">
      <el-table-column prop="username" label="姓名" width="120" />
      <el-table-column prop="gender" label="性别" width="80">
        <template #default="scope">
          {{ scope.row.gender === 0 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="80" />
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
    <el-dialog v-model="dialogVisible" title="添加病人" width="500px">
      <el-form :model="newPatient" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="newPatient.name" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="newPatient.idCard" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="newPatient.gender" placeholder="请选择" style="width: 100%">
            <el-option label="男" :value="0" />
            <el-option label="女" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="newPatient.phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAddPatient">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPatientList, addPatient as addPatientApi, removePatient as removePatientApi } from '@/api/patient'

const emit = defineEmits(['select-patient'])

const patientList = ref([])
const dialogVisible = ref(false)
const formRef = ref()
const newPatient = ref({
  name: '',
  idCard: '',
  gender: 0,
  phone: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号格式不正确', trigger: 'blur' }
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}

onMounted(() => {
  loadPatientList()
})

// 加载病人列表
const loadPatientList = async () => {
  try {
    const doctorId = 1 // 实际项目中应从登录信息获取
    const res = await getPatientList(doctorId)
    if (res && res.data && res.data.code === 0) {
      patientList.value = res.data.data || []
    } else {
      // 如果接口失败，使用模拟数据
      patientList.value = [
        {
          id: 1,
          name: '张三',
          gender: 0,
          age: 65,
          phone: '13800000001',
          address: '北京市朝阳区',
          lastVisit: '2024-01-15'
        },
        {
          id: 2,
          name: '李四',
          gender: 1,
          age: 72,
          phone: '13800000002',
          address: '北京市海淀区',
          lastVisit: '2024-01-10'
        },
        {
          id: 3,
          name: '王五',
          gender: 0,
          age: 58,
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

// 选择病人
const selectPatient = (row) => {
  emit('select-patient', row)
}

// 查看档案
const viewArchive = (patient) => {
  emit('select-patient', patient)
}

// 添加病人
const addPatient = () => {
  dialogVisible.value = true
  newPatient.value = {
    name: '',
    idCard: '',
    gender: 0,
    phone: ''
  }
}

// 确认添加病人
const confirmAddPatient = async () => {
  try {
    await formRef.value.validate()

    const doctorId = 1 // 实际项目中应从登录信息获取
    const patientData = {
      ...newPatient.value,
      doctorId
    }

    const res = await addPatientApi(patientData)
    if (res && res.data && res.data.code === 0) {
      // 重新加载病人列表
      await loadPatientList()
      dialogVisible.value = false
      ElMessage.success('添加成功')
    } else {
      ElMessage.error(res.data?.message || '添加失败')
    }
  } catch (error) {
    console.error('添加病人失败:', error)
    ElMessage.error('添加失败，请稍后重试')
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

    const doctorId = 1 // 实际项目中应从登录信息获取
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
</style>
