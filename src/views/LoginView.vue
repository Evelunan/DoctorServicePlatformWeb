<template>
  <div class="login-container">
    <div class="login-background">
      <div class="background-overlay"></div>
    </div>

    <div class="login-card">
      <div class="login-header">
        <div class="logo-section">
          <el-icon class="logo-icon"><User /></el-icon>
          <h1 class="logo-title">医生服务平台</h1>
          <p class="logo-subtitle">专业的健康管理解决方案</p>
        </div>
      </div>

      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="account">
          <el-input
            v-model="form.account"
            placeholder="请输入用户名/手机号"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <a href="#" class="forgot-password">忘记密码？</a>
        </div>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>

        <div class="login-divider">
          <span>还没有账号？</span>
        </div>

        <el-button
          type="default"
          size="large"
          class="register-button"
          @click="goRegister"
        >
          立即注册
        </el-button>
      </el-form>

      <div class="login-footer">
        <p>© 2024 医生服务平台. 保留所有权利.</p>
      </div>
    </div>

    <!-- 错误提示 -->
    <el-alert
      v-if="error"
      :title="error"
      type="error"
      show-icon
      closable
      class="error-alert"
      @close="error = ''"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { login } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)
const error = ref('')
const rememberMe = ref(false)

const form = reactive({
  account: '',
  password: ''
})

const rules = {
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    error.value = ''

    const res = await login(form.account, form.password)
    if (res.data.code === 0) {
      // 保存token
      userStore.login(res.data.data)

      ElMessage.success('登录成功')
      // 保存登录状态
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true')
        localStorage.setItem('account', form.account)
      }
      router.push('/')
    } else {
      error.value = res.data.message || '用户名或密码错误'
    }
  } catch (err) {
    error.value = '登录失败，请稍后重试'
    console.error('登录错误:', err)
  } finally {
    loading.value = false
  }
}

const goRegister = () => {
  router.push('/register')
}

// 检查是否有记住的登录信息
const checkRememberedLogin = () => {
  const remembered = localStorage.getItem('rememberMe')
  if (remembered === 'true') {
    const savedAccount = localStorage.getItem('account')
    if (savedAccount) {
      form.account = savedAccount
      rememberMe.value = true
    }
  }
}

// 页面加载时检查记住的登录信息
checkRememberedLogin()
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 48px;
  color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: -0.5px;
}

.logo-subtitle {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
  font-weight: 400;
}

.login-form {
  margin-bottom: 24px;
}

.login-form .el-form-item {
  margin-bottom: 20px;
}

.login-form .el-input {
  --el-input-border-radius: 8px;
}

.login-form .el-input__wrapper {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e1e8ed;
  transition: all 0.3s ease;
}

.login-form .el-input__wrapper:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.login-form .el-input__wrapper.is-focus {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #764ba2;
}

.login-button {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.login-divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.login-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e1e8ed;
}

.login-divider span {
  background: white;
  padding: 0 16px;
  color: #7f8c8d;
  font-size: 14px;
}

.register-button {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  border: 2px solid #667eea;
  color: #667eea;
  background: white;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
}

.register-button:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e1e8ed;
}

.login-footer p {
  margin: 0;
  color: #7f8c8d;
  font-size: 12px;
}

.error-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    margin: 20px;
    padding: 30px 24px;
  }

  .logo-title {
    font-size: 24px;
  }

  .logo-icon {
    font-size: 40px;
  }
}
</style>
