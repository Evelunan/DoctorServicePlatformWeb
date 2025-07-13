<template>
  <div class="debug-page">
    <h1>调试页面</h1>
    <div class="debug-info">
      <h2>Vue 版本: {{ vueVersion }}</h2>
      <h2>Element Plus 版本: {{ elementPlusVersion }}</h2>
    </div>

    <div class="test-components">
      <h3>组件测试</h3>
      <el-button type="primary">Element Plus 按钮</el-button>
      <el-input placeholder="Element Plus 输入框" />
      <el-icon><User /></el-icon>
    </div>

    <div class="navigation">
      <h3>导航测试</h3>
      <el-button @click="goTo('/')">首页</el-button>
      <el-button @click="goTo('/login')">登录</el-button>
      <el-button @click="goTo('/register')">注册</el-button>
      <el-button @click="goTo('/test')">测试页面</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User } from '@element-plus/icons-vue'

const router = useRouter()
const vueVersion = ref('')
const elementPlusVersion = ref('')

onMounted(() => {
  // 获取版本信息
  vueVersion.value = '3.x'
  elementPlusVersion.value = '2.x'
})

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.debug-page {
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.debug-info {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.test-components {
  margin: 20px 0;
}

.test-components > * {
  margin: 10px 10px 10px 0;
}

.navigation {
  margin: 20px 0;
}

.navigation > * {
  margin: 10px 10px 10px 0;
}
</style>
