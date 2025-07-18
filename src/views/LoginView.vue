<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <el-icon class="logo-icon"><User /></el-icon>
        <h1 class="logo-title">医生服务平台</h1>
        <p class="header-subtitle">专业的健康管理解决方案</p>
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
    </div>

    <!-- Error Alert -->
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
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
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

// 清空密码
const clearPassword = () => {
  form.password = ''
}

// 监听路由变化，如果从修改密码页跳转而来，则清空密码
router.afterEach((to, from) => {
  if (from.name === 'update-password') {
    clearPassword()
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.login-card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  transform: translateY(-5px);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  font-size: 48px;
  color: #1890ff; /* 主题色 */
}

.logo-title {
  margin: 12px 0 0;
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.header-subtitle {
  margin-top: 8px;
  color: #6b7280;
  font-size: 14px;
}

.login-form .el-form-item {
  margin-bottom: 22px;
}

.login-form :deep(.el-input__wrapper) {
  height: 48px;
  border-radius: 8px;
  background-color: #f9fafb;
  box-shadow: none;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  padding: 2px 15px;
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: #1890ff;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.15);
  background-color: #fff;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-password {
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background: #1890ff;
  border: none;
  font-weight: 600;
  font-size: 16px;
  color: white;
  transition: all 0.3s ease;
}

.login-button:hover {
  background: #40a9ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(24, 144, 255, 0.2);
}

.login-divider {
  text-align: center;
  margin: 24px 0;
  color: #9ca3af;
  font-size: 14px;
}

.register-button {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  color: #374151;
  background: white;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
}

.register-button:hover {
  border-color: #1890ff;
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.05);
}

.error-alert {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  max-width: 400px;
  border-radius: 8px;
}
</style>
