<template>
  <el-card class="user-profile-card">
    <template #header>
      <div class="card-header">
        <span class="header-title">
          <el-icon><User /></el-icon>
          个人信息
        </span>
        <el-button v-if="!editMode" type="primary" @click="editMode = true">
          <el-icon><Edit /></el-icon>
          编辑信息
        </el-button>
      </div>
    </template>

    <div class="profile-container">
      <!-- 头像区域 -->
      <div class="avatar-section">
        <el-avatar :size="120" :src="avatarUrl" class="user-avatar">
          <el-icon><User /></el-icon>
        </el-avatar>
        <div class="avatar-info">
          <h3>{{ form.username || '用户昵称' }}</h3>
          <p class="user-role">{{ userRole }}</p>
        </div>
      </div>

      <!-- 表单区域 -->
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="user-profile-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="昵称" prop="username">
              <el-input v-model="form.username" :disabled="!editMode" placeholder="请输入昵称">
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="form.gender" :disabled="!editMode" placeholder="请选择性别" style="width: 100%">
                <el-option label="男" :value="0">
                  <el-icon><Male /></el-icon>
                  男
                </el-option>
                <el-option label="女" :value="1">
                  <el-icon><Female /></el-icon>
                  女
                </el-option>
                <el-option label="私密" :value="2">
                  <el-icon><Lock /></el-icon>
                  私密
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
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
          <el-col :span="12">
            <el-form-item label="年龄">
              <el-input :value="ageDisplay" disabled>
                <template #suffix>岁</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" :disabled="!editMode" placeholder="请输入手机号">
                <template #prefix>
                  <el-icon><Phone /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号">
              <el-input v-model="form.account" disabled>
                <template #prefix>
                  <el-icon><UserFilled /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" :disabled="!editMode" placeholder="请输入详细地址">
            <template #prefix>
              <el-icon><Location /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item v-if="editMode" class="form-actions">
          <el-button type="primary" @click="onSave">
            <el-icon><Check /></el-icon>
            保存
          </el-button>
          <el-button @click="onCancel">
            <el-icon><Close /></el-icon>
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  User, Edit, Male, Female, Lock, Phone,
  UserFilled, Location, Check, Close
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { getUser, updateUser } from '../api/user'

const userId = 1 // 实际项目中应从登录信息获取
const formRef = ref()
const editMode = ref(false)
const form = ref({
  id: '',
  account: '',
  username: '',
  gender: 0,
  address: '',
  birthdate: '',
  phone: '',
  doctorId: null,
  type: null
})

const rules = {
  username: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  birthdate: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}

// 计算属性
const ageDisplay = computed(() => {
  if (!form.value.birthdate) return '--'
  const birth = dayjs(form.value.birthdate)
  const now = dayjs()
  let years = now.year() - birth.year()
  if (now.month() < birth.month() || (now.month() === birth.month() && now.date() < birth.date())) {
    years--
  }
  return years
})

const userRole = computed(() => {
  return form.value.type === 1 ? '医生' : '用户'
})

const avatarUrl = computed(() => {
  // 这里可以根据用户信息生成头像URL，暂时使用默认头像
  return ''
})

onMounted(async () => {
  try {
    const res = await getUser(userId)
    if (res && res.data && res.data.code === 0 && res.data.data) {
      const user = res.data.data
      Object.assign(form.value, user)
    } else {
      ElMessage.error('获取用户信息失败')
    }
  } catch {
    ElMessage.error('获取用户信息失败')
  }
})

async function onSave() {
  formRef.value.validate(async valid => {
    if (valid) {
      try {
        const res = await updateUser(form.value)
        if (res && res.data && res.data.code === 0) {
          editMode.value = false
          ElMessage.success('保存成功')
        } else {
          ElMessage.error(res.data.message)
        }
      } catch {
        ElMessage.error('保存失败')
      }
    }
  })
}

function onCancel() {
  editMode.value = false
}
</script>

<style scoped>
.user-profile-card {
  max-width: 100%;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.profile-container {
  padding: 20px 0;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.user-avatar {
  border: 4px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
}

.avatar-info h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.user-role {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.user-profile-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-actions {
  margin-top: 30px;
  text-align: center;
}

.form-actions .el-button {
  margin: 0 10px;
  padding: 12px 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .avatar-section {
    flex-direction: column;
    text-align: center;
  }

  .user-profile-form {
    padding: 0 10px;
  }
}
</style>
