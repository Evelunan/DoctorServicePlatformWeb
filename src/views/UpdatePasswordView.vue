<template>
  <div class="update-password-container">
    <div class="update-password-card">
      <div class="update-password-header">
        <el-icon class="logo-icon"><Lock /></el-icon>
        <h1 class="logo-title">修改密码</h1>
        <p class="header-subtitle">请设置您的新密码</p>
      </div>

      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        class="update-password-form"
        
      >
        <el-form-item prop="newPassword">
          <el-input
              v-model="form.newPassword"
              type="password"
              placeholder="请输入新密码"
              show-password
              size="large"
            />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              show-password
              size="large"
            />
        </el-form-item>

        <el-form-item class="form-buttons">
          <el-button size="large" class="form-button" @click="handleCancel">取消</el-button>
          <el-button
            type="primary"
            size="large"
            class="form-button"
            :loading="loading"
            @click="handleConfirmUpdate"
          >
            {{ loading ? '正在提交...' : '确认修改' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { updatePassword } from '@/api/user'



const router = useRouter()
const formRef = ref()
const loading = ref(false)
const error = ref('')

const form = reactive({
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== form.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: '密码必须包含大小写字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleCancel = () => {
  router.back()
}

const handleConfirmUpdate = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm('您确定要修改密码吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          submitForm()
        })
        .catch(() => {
          // 用户取消操作
        })
    } else {
      return false
    }
  })
}

const submitForm = async () => {
    loading.value = true
    try {
      const res = await updatePassword({ newPassword: form.newPassword })
      if (res.data.code === 0) {
        ElMessage.success('密码修改成功，请重新登录')
        router.push('/login')
      } else {
        ElMessage.error(res.data.message || '密码修改失败')
      }
    } catch (error) {
      if (error.response) {
        ElMessage.error(error.response.data.message || '密码修改失败')
      } else {
        ElMessage.error('密码修改失败')
      }
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
.update-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.update-password-card {
  width: 100%;
  max-width: 420px;
  padding: 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
}

.update-password-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-icon {
  font-size: 52px;
  color: #007bff;
}

.logo-title {
  margin: 16px 0 0;
  font-size: 32px;
  font-weight: 700;
  color: #343a40;
}

.header-subtitle {
  margin-top: 10px;
  color: #6c757d;
  font-size: 16px;
}

.update-password-form .el-form-item {
  margin-bottom: 24px;
}

.form-buttons .el-form-item__content {
  justify-content: space-between;
}

.form-button {
  width: 48%;
  height: 52px;
  border-radius: 10px;
  font-size: 18px;
}
</style>