<template>
  <el-form :model="form" ref="formRef" label-width="120px">
    <el-form-item label="家族疾病">
      <el-checkbox-group v-model="form.familyDiseases" :disabled="!editMode">
        <el-checkbox label="高血压">高血压</el-checkbox>
        <el-checkbox label="糖尿病">糖尿病</el-checkbox>
        <el-checkbox label="心脏病">心脏病</el-checkbox>
        <el-checkbox label="脑血管病">脑血管病</el-checkbox>
        <el-checkbox label="肿瘤">肿瘤</el-checkbox>
        <el-checkbox label="精神疾病">精神疾病</el-checkbox>
        <el-checkbox label="遗传病">遗传病</el-checkbox>
        <el-checkbox label="其他">其他</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="其他家族疾病" v-if="form.familyDiseases.includes('其他')">
      <el-input v-model="form.otherFamilyDiseases" :disabled="!editMode" placeholder="请详细描述其他家族疾病" />
    </el-form-item>
    <el-form-item label="家族病史详情">
      <el-input
        v-model="form.familyHistoryDetail"
        type="textarea"
        :rows="4"
        :disabled="!editMode"
        placeholder="请详细描述家族病史（包括患病亲属关系、发病年龄、治疗情况等）"
      />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, defineExpose } from 'vue'

const formRef = ref()
const form = ref({
  familyDiseases: [],
  otherFamilyDiseases: '',
  familyHistoryDetail: ''
})

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
  return Promise.resolve(true) // 家族病史不需要验证
}

defineExpose({
  setFormData,
  getFormData,
  validate
})
</script>
