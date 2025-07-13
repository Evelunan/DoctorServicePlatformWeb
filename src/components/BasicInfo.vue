<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" :disabled="!editMode" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" :disabled="!editMode" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" :disabled="!editMode" placeholder="请选择" style="width: 100%">
            <el-option label="男" :value="0" />
            <el-option label="女" :value="1" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="出生日期" prop="birthdate">
          <el-date-picker
            v-model="form.birthdate"
            type="date"
            placeholder="选择日期"
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
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" :disabled="!editMode" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="紧急联系人" prop="emergencyContact">
          <el-input v-model="form.emergencyContact" :disabled="!editMode" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="家庭住址" prop="address">
      <el-input v-model="form.address" :disabled="!editMode" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, defineExpose } from 'vue'

defineProps({
  editMode: {
    type: Boolean,
    default: false
  }
})

const formRef = ref()
const form = ref({
  name: '',
  idCard: '',
  gender: 0,
  birthdate: '',
  phone: '',
  emergencyContact: '',
  address: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号格式不正确', trigger: 'blur' }
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  birthdate: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  emergencyContact: [{ required: true, message: '请输入紧急联系人', trigger: 'blur' }],
  address: [{ required: true, message: '请输入家庭住址', trigger: 'blur' }]
}

// 设置表单数据
const setFormData = (data) => {
  Object.assign(form.value, data)
}

// 获取表单数据
const getFormData = () => {
  return form.value
}

// 验证表单
const validate = () => {
  return formRef.value.validate()
}

defineExpose({
  setFormData,
  getFormData,
  validate
})
</script>
