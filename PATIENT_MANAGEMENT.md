# 医生多病人管理系统设计

## 概述

本系统实现了医生管理多个病人档案的功能，支持医生查看、编辑和管理其负责的所有病人的健康档案。

## 核心功能

### 1. 病人列表管理
- **位置**: `src/components/PatientList.vue`
- **功能**: 
  - 显示医生负责的所有病人列表
  - 支持添加新病人
  - 支持移除病人
  - 点击病人可查看其健康档案

### 2. 健康档案管理
- **位置**: `src/components/HealthArchive.vue`
- **功能**:
  - 支持切换不同病人查看其健康档案
  - 包含基本信息、既往病史、家族病史三个模块
  - 支持编辑和保存病人档案

### 3. 状态管理
- **位置**: `src/stores/patient.js`
- **功能**:
  - 管理当前选中的病人信息
  - 管理病人列表数据
  - 在组件间共享病人状态

## 数据结构

### 病人信息
```javascript
{
  id: 1,
  name: '张三',
  gender: 0, // 0-男, 1-女
  age: 65,
  phone: '13800000001',
  address: '北京市朝阳区',
  lastVisit: '2024-01-15'
}
```

### 健康档案
```javascript
{
  patientId: 1,
  basicInfo: {
    name: '张三',
    idCard: '110101199001011234',
    gender: 0,
    birthdate: '1990-01-01',
    phone: '13800000001',
    emergencyContact: '李四',
    address: '北京市朝阳区'
  },
  medicalHistory: {
    diseases: ['高血压'],
    otherDiseases: '',
    surgeryHistory: '无',
    allergies: '无'
  },
  familyHistory: {
    familyDiseases: ['高血压'],
    otherFamilyDiseases: '',
    familyHistoryDetail: '父亲有高血压病史'
  }
}
```

## API接口

### 病人管理接口
- `GET /api/patient/list/{doctorId}` - 获取医生的病人列表
- `POST /api/patient/add` - 添加病人
- `DELETE /api/patient/remove/{patientId}` - 移除病人

### 健康档案接口
- `GET /api/patient/archive/{patientId}` - 获取病人健康档案
- `POST /api/patient/archive/save` - 保存病人健康档案
- `PUT /api/patient/archive/update` - 更新病人健康档案

## 使用流程

1. **医生登录** → 进入首页
2. **查看病人列表** → 点击"用户管理" → "病人管理"
3. **添加病人** → 点击"添加病人"按钮，填写病人信息
4. **查看健康档案** → 点击病人列表中的"查看档案"或直接点击病人行
5. **编辑档案** → 在健康档案页面点击"编辑"按钮
6. **保存档案** → 编辑完成后点击"保存"按钮

## 技术特点

1. **组件化设计**: 将病人列表和健康档案分离为独立组件
2. **状态管理**: 使用Pinia管理病人状态，支持组件间数据共享
3. **接口封装**: 统一的API接口管理，便于维护和扩展
4. **错误处理**: 完善的错误处理和用户提示
5. **响应式设计**: 使用Element Plus组件库，界面美观且响应式

## 扩展建议

1. **权限管理**: 添加医生权限验证，确保只能管理自己的病人
2. **搜索功能**: 在病人列表中添加搜索和筛选功能
3. **批量操作**: 支持批量导入病人信息
4. **数据导出**: 支持导出病人健康档案为PDF或Excel
5. **历史记录**: 记录健康档案的修改历史
6. **消息通知**: 当病人档案有更新时，通知相关医生 