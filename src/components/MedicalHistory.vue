<template>
  <el-form :model="form" ref="formRef" label-width="120px">
    <el-form-item label="疾病史">
      <el-checkbox-group v-model="form.diseases" :disabled="!editMode">
        <el-checkbox label="高血压">高血压</el-checkbox>
        <el-checkbox label="糖尿病">糖尿病</el-checkbox>
        <el-checkbox label="心脏病">心脏病</el-checkbox>
        <el-checkbox label="脑血管病">脑血管病</el-checkbox>
        <el-checkbox label="慢性肾病">慢性肾病</el-checkbox>
        <el-checkbox label="慢性肺病">慢性肺病</el-checkbox>
        <el-checkbox label="肿瘤">肿瘤</el-checkbox>
        <el-checkbox label="其他">其他</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="其他疾病" v-if="form.diseases.includes('其他')">
      <el-input v-model="form.otherDiseases" :disabled="!editMode" placeholder="请详细描述其他疾病" />
    </el-form-item>
    <el-form-item label="手术史">
      <el-input
        v-model="form.surgeryHistory"
        type="textarea"
        :rows="3"
        :disabled="!editMode"
        placeholder="请描述手术史（时间、手术名称、医院等）"
      />
    </el-form-item>
    <el-form-item label="过敏史">
      <el-input
        v-model="form.allergies"
        type="textarea"
        :rows="3"
        :disabled="!editMode"
        placeholder="请描述过敏史（药物、食物等）"
      />
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
  diseases: [],
  otherDiseases: '',
  surgeryHistory: '',
  allergies: ''
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
  return Promise.resolve(true) // 既往病史不需要验证
}

defineExpose({
  setFormData,
  getFormData,
  validate
})
</script>
