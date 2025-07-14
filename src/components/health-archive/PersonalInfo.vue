<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="!editMode" placeholder="请输入用户名" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="账户" prop="account">
          <el-input v-model="form.account" :disabled="!editMode" placeholder="请输入账户" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" :disabled="!editMode" placeholder="请选择性别" style="width: 100%">
            <el-option label="男" :value="0" />
            <el-option label="女" :value="1" />
            <el-option label="其他" :value="2" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="出生日期" prop="birthdate">
          <el-date-picker
            v-model="form.birthdate"
            type="date"
            placeholder="选择出生日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled="!editMode"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" :disabled="!editMode" placeholder="请输入手机号码" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主治医生" prop="doctorId">
          <el-select v-model="form.doctorId" :disabled="!editMode" placeholder="请选择主治医生" style="width: 100%">
            <el-option
              v-for="doctor in doctorList"
              :key="doctor.id"
              :label="doctor.username"
              :value="doctor.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="家庭住址" prop="address">
      <el-input v-model="form.address" :disabled="!editMode" placeholder="请输入家庭住址" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, defineExpose } from 'vue'

// eslint-disable-next-line
const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  }
})

const formRef = ref()
const form = ref({
  id: null,
  account: '',
  password: '',
  username: '',
  gender: 0,
  address: '',
  birthdate: '',
  phone: '',
  doctorId: null,
  type: null
})

const initialForm = {
  id: null,
  account: '',
  password: '',
  username: '',
  gender: 0,
  address: '',
  birthdate: '',
  phone: '',
  doctorId: null,
  type: null
}

const doctorList = ref([
  { id: 1, name: '张医生' },
  { id: 2, name: '李医生' },
  { id: 3, name: '王医生' }
])

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  account: [{ required: true, message: '请输入账户', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  doctorId: [{ required: true, message: '请选择主治医生', trigger: 'change' }],
  address: [{ required: true, message: '请输入家庭住址', trigger: 'blur' }]
}

// 设置表单数据
const setFormData = (data) => {
  // 先重置为初始值
  Object.assign(form.value, initialForm)
  // 再赋值（如果有数据）
  if (data && Object.keys(data).length > 0) {
    Object.assign(form.value, data)
  }
}

// 获取表单数据
const getFormData = () => {
  return form.value
}

// 验证表单
const validate = () => {
  return formRef.value.validate()
}

// 设置医生列表
const setDoctorList = (doctors) => {
  doctorList.value = doctors
}

defineExpose({
  setFormData,
  getFormData,
  validate,
  setDoctorList
})
</script>

<style scoped>
.el-form-item {
  margin-bottom: 20px;
}
</style>
