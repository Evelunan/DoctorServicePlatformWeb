# 健康档案组件使用说明

## 概述

本项目包含了一套完整的健康档案管理组件，分为四个主要部分：

1. **个人信息组件** (`PersonalInfo.vue`)
2. **基本健康信息组件** (`BasicHealthInfo.vue`)
3. **过往病史组件** (`DiseaseHistory.vue`)
4. **家族病史组件** (`FamilyDiseaseHistory.vue`)

这四个组件可以独立使用，也可以组合成完整的健康档案组件 (`CompleteHealthArchive.vue`)。

## 组件结构

### 1. 个人信息组件 (PersonalInfo.vue)

基于 `user` 数据结构，包含以下字段：

```javascript
{
  id: 3,
  account: "ljwnzs",
  password: "e10adc3949ba59abbe56e057f20f883e",
  username: "九颖",
  gender: 2, // 0:男 1:女 2:其他
  address: "上海市 包乡县 清浦区 京栋2660号 93号院",
  birthdate: "1990-05-15",
  phone: "11997932836",
  doctorId: 1,
  type: null
}
```

**功能特性：**
- 支持编辑模式切换
- 表单验证
- 医生列表选择
- 性别选择（男/女/其他）

### 2. 基本健康信息组件 (BasicHealthInfo.vue)

基于 `HealthInfo` 数据结构，包含以下字段：

```javascript
{
  id: 1,
  height: 165.5, // 身高(cm)
  weight: 58.0,  // 体重(kg)
  bloodType: 0,  // 0:A 1:B 2:AB 3:O 4:其他
  allergies: "对青霉素过敏，对海鲜过敏",
  disability: 0, // 0:否 1:是
  userId: 3
}
```

**功能特性：**
- 身高体重输入（带数值范围限制）
- 血型选择
- 是否残疾选择
- 过敏信息文本输入
- 自动计算BMI指数并显示健康状态

### 3. 过往病史组件 (DiseaseHistory.vue)

基于 `DiseaseHistory` 数据结构，支持多个病史记录：

```javascript
{
  id: 1,
  diseaseName: "高血压",
  diagnosisDate: "2020-03-15",
  status: "治疗中", // 治疗中/康复
  notes: "轻度高血压，正在服用降压药物，定期监测血压",
  userId: 3
}
```

**功能特性：**
- 支持添加/删除多个病史记录
- 疾病名称、诊断日期、状态、备注
- 表单验证
- 卡片式布局展示

### 4. 家族病史组件 (FamilyDiseaseHistory.vue)

基于 `FamilyHistory` 数据结构，支持多个家族病史记录：

```javascript
{
  id: 1,
  relation: "父亲", // 亲属关系
  diseaseName: "高血压",
  notes: "父亲50岁时确诊高血压，需要长期服药控制",
  userId: 3
}
```

**功能特性：**
- 支持添加/删除多个家族病史记录
- 亲属关系选择（父亲、母亲、祖父等）
- 疾病名称、备注
- 表单验证
- 卡片式布局展示

## 完整健康档案组件 (CompleteHealthArchive.vue)

将四个子组件组合成一个完整的健康档案管理界面。

**功能特性：**
- 标签页切换（个人信息、基本健康信息、过往病史、家族病史）
- 统一的编辑模式控制
- 数据保存和验证
- 响应式布局

## 使用方法

### 1. 独立使用单个组件

```vue
<template>
  <div>
    <PersonalInfo ref="personalInfoRef" :editMode="editMode" />
    <el-button @click="savePersonalInfo">保存个人信息</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PersonalInfo from '@/components/PersonalInfo.vue'

const editMode = ref(false)
const personalInfoRef = ref()

const savePersonalInfo = () => {
  const data = personalInfoRef.value.getFormData()
  console.log('个人信息数据:', data)
}
</script>
```

### 2. 使用完整健康档案组件

```vue
<template>
  <div>
    <CompleteHealthArchive 
      ref="archiveRef"
      :userId="currentUserId"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CompleteHealthArchive from '@/components/CompleteHealthArchive.vue'

const archiveRef = ref()
const currentUserId = ref(3)

const handleSave = (archiveData) => {
  console.log('完整的健康档案数据:', archiveData)
  // 调用API保存数据
}

// 加载数据
const loadData = (data) => {
  archiveRef.value?.loadArchiveData(data)
}

// 设置医生列表
const setDoctors = (doctors) => {
  archiveRef.value?.setDoctorList(doctors)
}
</script>
```

### 3. 访问示例页面

在浏览器中访问 `/health-archive` 路径，可以看到完整的健康档案管理界面。

## API 接口

### 组件方法

#### PersonalInfo 组件
- `setFormData(data)` - 设置表单数据
- `getFormData()` - 获取表单数据
- `validate()` - 验证表单
- `setDoctorList(doctors)` - 设置医生列表

#### BasicHealthInfo 组件
- `setFormData(data)` - 设置表单数据
- `getFormData()` - 获取表单数据
- `validate()` - 验证表单
- `calculateBMI()` - 计算BMI指数

#### DiseaseHistory 组件
- `setFormData(data)` - 设置病史数据（数组）
- `getFormData()` - 获取病史数据
- `validate()` - 验证表单
- `addDisease()` - 添加病史记录
- `removeDisease(index)` - 删除病史记录

#### FamilyDiseaseHistory 组件
- `setFormData(data)` - 设置家族病史数据（数组）
- `getFormData()` - 获取家族病史数据
- `validate()` - 验证表单
- `addFamilyHistory()` - 添加家族病史记录
- `removeFamilyHistory(index)` - 删除家族病史记录

#### CompleteHealthArchive 组件
- `loadArchiveData(data)` - 加载完整的档案数据
- `getArchiveData()` - 获取完整的档案数据
- `setDoctorList(doctors)` - 设置医生列表
- `resetForm()` - 重置表单
- `startEdit()` - 开始编辑
- `cancelEdit()` - 取消编辑
- `saveArchive()` - 保存档案

### 事件

#### CompleteHealthArchive 组件
- `@save` - 保存事件，返回完整的档案数据
- `@update` - 更新事件

## 数据格式

### 完整的健康档案数据结构

```javascript
{
  personalInfo: {
    id: 3,
    account: "ljwnzs",
    username: "九颖",
    gender: 2,
    address: "上海市 包乡县 清浦区 京栋2660号 93号院",
    birthdate: "1990-05-15",
    phone: "11997932836",
    doctorId: 1,
    type: null
  },
  basicHealthInfo: {
    id: 1,
    height: 165.5,
    weight: 58.0,
    bloodType: 0,
    allergies: "对青霉素过敏，对海鲜过敏",
    disability: 0,
    userId: 3
  },
  diseaseHistory: [
    {
      id: 1,
      diseaseName: "高血压",
      diagnosisDate: "2020-03-15",
      status: "治疗中",
      notes: "轻度高血压，正在服用降压药物，定期监测血压",
      userId: 3
    }
  ],
  familyDiseaseHistory: [
    {
      id: 1,
      relation: "父亲",
      diseaseName: "高血压",
      notes: "父亲50岁时确诊高血压，需要长期服药控制",
      userId: 3
    }
  ]
}
```

## 注意事项

1. 所有组件都支持 `editMode` 属性来控制编辑状态
2. 表单验证会在保存时自动执行
3. 病史和家族病史支持多个记录，使用数组存储
4. BMI计算会自动显示健康状态（偏瘦/正常/偏胖/肥胖）
5. 组件使用 Element Plus UI 库，确保项目中已正确安装

## 示例数据

在 `/health-archive` 页面中，点击"加载示例数据"按钮可以查看完整的示例数据展示。 