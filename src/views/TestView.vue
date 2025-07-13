<template>
  <div class="test-page">
    <h1>测试页面</h1>
    <p>如果你能看到这个页面，说明路由工作正常。</p>
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.test-page {
  padding: 50px;
  text-align: center;
}

h1 {
  color: #409eff;
  margin-bottom: 20px;
}

p {
  margin-bottom: 30px;
  color: #666;
}
</style>
