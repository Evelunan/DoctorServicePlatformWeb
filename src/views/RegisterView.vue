<template>
  <div class="register-container">
    <div class="register-background">
      <div class="background-overlay"></div>
    </div>

    <div class="register-card">
      <div class="register-header">
        <div class="logo-section">
          <el-icon class="logo-icon"><User /></el-icon>
          <h1 class="logo-title">创建账号</h1>
          <p class="logo-subtitle">加入医生服务平台，开启专业健康管理</p>
        </div>
      </div>

      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        class="register-form"
        @submit.prevent="handleRegister"
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
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请确认密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleRegister"
          />
        </el-form-item>

        <el-form-item prop="userType">
          <el-select
            v-model="form.userType"
            placeholder="请选择用户类型"
            size="large"
            style="width: 100%"
          >
            <el-option label="医生" value="doctor">
              <el-icon><UserFilled /></el-icon>
              医生
            </el-option>
            <el-option label="患者" value="patient">
              <el-icon><User /></el-icon>
              患者
            </el-option>
          </el-select>
        </el-form-item>

        <div class="form-agreement">
          <el-checkbox v-model="agreement">
            我已阅读并同意
            <a href="#" class="agreement-link">《用户协议》</a>
            和
            <a href="#" class="agreement-link">《隐私政策》</a>
          </el-checkbox>
        </div>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="register-button"
            :loading="loading"
            @click="handleRegister"
          >
            {{ loading ? '注册中...' : '立即注册' }}
          </el-button>
        </el-form-item>

        <div class="register-divider">
          <span>已有账号？</span>
        </div>

        <el-button
          type="default"
          size="large"
          class="login-button"
          @click="goLogin"
        >
          立即登录
        </el-button>
      </el-form>

      <div class="register-footer">
        <p>© 2024 医生服务平台. 保留所有权利.</p>
      </div>
    </div>

    <!-- 成功提示 -->
    <el-alert
      v-if="success"
      :title="success"
      type="success"
      show-icon
      closable
      class="success-alert"
      @close="success = ''"
    />

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
import { User, Lock, UserFilled } from '@element-plus/icons-vue'
import { register } from '@/api/user'

const router = useRouter()
const formRef = ref()
const loading = ref(false)
const error = ref('')
const success = ref('')
const agreement = ref(false)

const form = reactive({
  account: '',
  password: '',
  confirmPassword: '',
  userType: 'doctor'
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const validateAgreement = (rule, value, callback) => {
  if (!agreement.value) {
    callback(new Error('请阅读并同意用户协议和隐私政策'))
  } else {
    callback()
  }
}

const rules = {
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少3个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: '密码必须包含大小写字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ],
  userType: [
    { required: true, message: '请选择用户类型', trigger: 'change' }
  ],
  agreement: [
    { validator: validateAgreement, trigger: 'change' }
  ]
}

const handleRegister = async () => {
  try {
    await formRef.value.validate()

    if (!agreement.value) {
      error.value = '请阅读并同意用户协议和隐私政策'
      return
    }

    loading.value = true
    error.value = ''
    success.value = ''

    const res = await register(form.account, form.password)
    if (res.data.code === 0) {
      success.value = '注册成功，正在跳转登录...'
      ElMessage.success('注册成功')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } else {
      error.value = res.data.message || '注册失败'
    }
  } catch (err) {
    error.value = '注册失败，请稍后重试'
    console.error('注册错误:', err)
  } finally {
    loading.value = false
  }
}

const goLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-background {
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

.register-card {
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

.register-header {
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

.register-form {
  margin-bottom: 24px;
}

.register-form .el-form-item {
  margin-bottom: 20px;
}

.register-form .el-input {
  --el-input-border-radius: 8px;
}

.register-form .el-input__wrapper {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e1e8ed;
  transition: all 0.3s ease;
}

.register-form .el-input__wrapper:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.register-form .el-input__wrapper.is-focus {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.form-agreement {
  margin-bottom: 24px;
  text-align: center;
}

.agreement-link {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.agreement-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.register-button {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.register-divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.register-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e1e8ed;
}

.register-divider span {
  background: white;
  padding: 0 16px;
  color: #7f8c8d;
  font-size: 14px;
}

.login-button {
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

.login-button:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.register-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e1e8ed;
}

.register-footer p {
  margin: 0;
  color: #7f8c8d;
  font-size: 12px;
}

.success-alert,
.error-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .register-card {
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
