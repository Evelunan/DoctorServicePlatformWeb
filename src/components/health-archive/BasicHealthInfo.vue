<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="身高(cm)" prop="height">
          <el-input-number
            v-model="form.height"
            :disabled="!editMode"
            :min="50"
            :max="250"
            :precision="1"
            placeholder="请输入身高"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="体重(kg)" prop="weight">
          <el-input-number
            v-model="form.weight"
            :disabled="!editMode"
            :min="10"
            :max="300"
            :precision="1"
            placeholder="请输入体重"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="收缩压（高压，mmHg）" prop="systolic">
          <el-input-number
            v-model="form.systolic"
            :disabled="!editMode"
            :min="50"
            :max="250"
            :precision="0"
            placeholder="请输入收缩压"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="舒张压（低压，mmHg）" prop="diastolic">
          <el-input-number
            v-model="form.diastolic"
            :disabled="!editMode"
            :min="30"
            :max="150"
            :precision="0"
            placeholder="请输入舒张压"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="空腹血糖（mmol/L）" prop="fastingGlucose">
          <el-input-number
            v-model="form.fastingGlucose"
            :disabled="!editMode"
            :min="1"
            :max="30"
            :precision="1"
            placeholder="请输入空腹血糖"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="血氧饱和度（%）" prop="spo2">
          <el-input-number
            v-model="form.spo2"
            :disabled="!editMode"
            :min="50"
            :max="100"
            :precision="0"
            placeholder="请输入血氧饱和度"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="心率（次/分）" prop="heartRate">
          <el-input-number
            v-model="form.heartRate"
            :disabled="!editMode"
            :min="30"
            :max="200"
            :precision="0"
            placeholder="请输入心率"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="体温（℃）" prop="temperature">
          <el-input-number
            v-model="form.temperature"
            :disabled="!editMode"
            :min="30"
            :max="45"
            :precision="1"
            placeholder="请输入体温"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>

        <el-form-item label="血型" prop="bloodType">
          <el-select v-model="form.bloodType" :disabled="!editMode" placeholder="请选择血型" style="width: 100%">
            <el-option label="A型" :value="0" />
            <el-option label="B型" :value="1" />
            <el-option label="AB型" :value="2" />
            <el-option label="O型" :value="3" />
            <el-option label="其他" :value="4" />
          </el-select>
        </el-form-item>

        <el-form-item label="是否残疾" prop="disability">
          <el-select v-model="form.disability" :disabled="!editMode" placeholder="请选择" style="width: 100%">
            <el-option label="否" :value="0" />
            <el-option label="是" :value="1" />
          </el-select>
        </el-form-item>

    <el-form-item label="过敏信息" prop="allergies">
      <el-input
        v-model="form.allergies"
        type="textarea"
        :rows="3"
        :disabled="!editMode"
        placeholder="请描述过敏信息（药物、食物、环境等）"
      />
    </el-form-item>

    <el-form-item label="BMI指数" v-if="form.height && form.weight">
      <el-tag :type="getBMIType()" size="large">
        {{ calculateBMI() }} ({{ getBMIDescription() }})
      </el-tag>
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
  height: null,
  weight: null,
  bloodType: null,
  allergies: '',
  disability: 0,
  userId: null,
  systolic: null,
  diastolic: null,
  fastingGlucose: null,
  spo2: null,
  heartRate: null,
  temperature: null
})

const initialForm = {
  id: null,
  height: null,
  weight: null,
  bloodType: null,
  allergies: '',
  disability: 0,
  userId: null,
  systolic: null,
  diastolic: null,
  fastingGlucose: null,
  spo2: null,
  heartRate: null,
  temperature: null
}

const rules = {
  height: [],
  weight: [],
  systolic: [],
  diastolic: [],
  fastingGlucose: [],
  spo2: [],
  heartRate: [],
  temperature: [],
  bloodType: [],
  disability: [],
  allergies: []
}

// 计算BMI
const calculateBMI = () => {
  if (!form.value.height || !form.value.weight) return null
  const heightInMeters = form.value.height / 100
  const bmi = form.value.weight / (heightInMeters * heightInMeters)
  return bmi.toFixed(1)
}

// 获取BMI类型
const getBMIType = () => {
  const bmi = calculateBMI()
  if (!bmi) return ''
  if (bmi < 18.5) return 'warning'
  if (bmi < 24) return 'success'
  if (bmi < 28) return 'warning'
  return 'danger'
}

// 获取BMI描述
const getBMIDescription = () => {
  const bmi = calculateBMI()
  if (!bmi) return ''
  if (bmi < 18.5) return '偏瘦'
  if (bmi < 24) return '正常'
  if (bmi < 28) return '偏胖'
  return '肥胖'
}

// 设置表单数据
const setFormData = (data) => {
  Object.assign(form.value, initialForm)
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

defineExpose({
  setFormData,
  getFormData,
  validate,
  calculateBMI
})
</script>

<style scoped>
.el-form-item {
  margin-bottom: 20px;
}
</style>
