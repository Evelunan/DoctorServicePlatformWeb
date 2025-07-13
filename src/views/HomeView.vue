<script setup>
import { ref, computed } from 'vue'
import UserProfile from '../components/UserProfile.vue'
import HealthArchive from '@/components/health-archive/CompleteHealthArchive.vue'
import PatientList from '../components/PatientList.vue'
import {
  User, ArrowDown, Setting, SwitchButton,
  UserFilled, Document, Edit, DataAnalysis, FolderOpened,
  Warning, Bell, Clock, Calendar, Plus, Tools, ArrowLeft
} from '@element-plus/icons-vue'

const activeMenu = ref('1-1')
const selectedPatient = ref(null)
const showHealthArchive = ref(false)

function handleMenuSelect(index) {
  activeMenu.value = index
  // 如果切换到其他菜单，隐藏健康档案
  if (index !== '2-1') {
    showHealthArchive.value = false
    selectedPatient.value = null
  }
}

// 处理病人选择
function handlePatientSelect(patient) {
  selectedPatient.value = patient
  showHealthArchive.value = true
}

// 处理健康档案保存
function handleArchiveSave(archiveData) {
  console.log('保存健康档案:', archiveData)
  // 这里可以调用API保存数据
}

const currentComponent = computed(() => {
  if (activeMenu.value === '1-1') {
    return UserProfile
  }
  if (activeMenu.value === '2-1') {
    return PatientList
  }
  if (activeMenu.value === '2-2') {
    return HealthArchive
  }
  const map = {
    '2-3': { template: '<div>体检指标/用药/生活习惯功能区</div>' },
    '2-4': { template: '<div>附件管理/导出功能区</div>' },
    '3-1': { template: '<div>预警规则管理功能区</div>' },
    '3-2': { template: '<div>预警处理功能区</div>' },
    '3-3': { template: '<div>预警历史查询功能区</div>' },
    '4-1': { template: '<div>随访计划制定功能区</div>' },
    '4-2': { template: '<div>随访记录填写功能区</div>' },
    '4-3': { template: '<div>随访历史管理功能区</div>' },
    '5-1': { template: '<div>干预措施制定功能区</div>' },
    '5-2': { template: '<div>健康评估报告功能区</div>' },
    '5-3': { template: '<div>历史评估管理功能区</div>' },
  }
  return map[activeMenu.value] || { template: '<div>请选择左侧功能</div>' }
})
</script>

<template>
  <div class="common-layout">
    <el-container style="height: 100vh;">
      <el-header class="header">
        <div class="header-content">
          <div class="header-left">
            <el-icon class="header-icon"><User /></el-icon>
            <span class="header-title">医生服务平台</span>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                <el-avatar :size="32" src="">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <span class="username">医生</span>
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-icon><User /></el-icon>
                    个人信息
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-icon><Setting /></el-icon>
                    系统设置
                  </el-dropdown-item>
                  <el-dropdown-item divided>
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="250px" class="aside">
          <el-menu
            :default-active="activeMenu"
            class="el-menu-vertical-demo"
            @select="handleMenuSelect"
            :unique-opened="true"
            background-color="#f8f9fa"
            text-color="#2c3e50"
            active-text-color="#409eff"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon><User /></el-icon>
                <span>用户管理</span>
              </template>
              <el-menu-item index="1-1">
                <el-icon><UserFilled /></el-icon>
                用户信息
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><Document /></el-icon>
                <span>老人健康档案管理</span>
              </template>
              <el-menu-item index="2-1">
                <el-icon><UserFilled /></el-icon>
                病人管理
              </el-menu-item>
              <el-menu-item index="2-2">
                <el-icon><Edit /></el-icon>
                新建/编辑健康档案
              </el-menu-item>
              <el-menu-item index="2-3">
                <el-icon><DataAnalysis /></el-icon>
                体检指标/用药/生活习惯
              </el-menu-item>
              <el-menu-item index="2-4">
                <el-icon><FolderOpened /></el-icon>
                附件管理/导出
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon><Warning /></el-icon>
                <span>健康预警</span>
              </template>
              <el-menu-item index="3-1">
                <el-icon><Setting /></el-icon>
                预警规则管理
              </el-menu-item>
              <el-menu-item index="3-2">
                <el-icon><Bell /></el-icon>
                预警处理
              </el-menu-item>
              <el-menu-item index="3-3">
                <el-icon><Clock /></el-icon>
                预警历史查询
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="4">
              <template #title>
                <el-icon><Calendar /></el-icon>
                <span>重点人群随访管理</span>
              </template>
              <el-menu-item index="4-1">
                <el-icon><Plus /></el-icon>
                随访计划制定
              </el-menu-item>
              <el-menu-item index="4-2">
                <el-icon><Edit /></el-icon>
                随访记录填写
              </el-menu-item>
              <el-menu-item index="4-3">
                <el-icon><Document /></el-icon>
                随访历史管理
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="5">
              <template #title>
                <el-icon><DataAnalysis /></el-icon>
                <span>随访干预与健康评估</span>
              </template>
              <el-menu-item index="5-1">
                <el-icon><Tools /></el-icon>
                干预措施制定
              </el-menu-item>
              <el-menu-item index="5-2">
                <el-icon><Document /></el-icon>
                健康评估报告
              </el-menu-item>
              <el-menu-item index="5-3">
                <el-icon><Clock /></el-icon>
                历史评估管理
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <!-- 病人管理页面 -->
          <div v-if="activeMenu === '2-1' && !showHealthArchive">
            <PatientList @select-patient="handlePatientSelect" />
          </div>

          <!-- 健康档案页面 -->
          <div v-else-if="activeMenu === '2-1' && showHealthArchive">
            <div class="archive-header">
              <el-button @click="showHealthArchive = false" type="primary" plain>
                <el-icon><ArrowLeft /></el-icon>
                返回病人列表
              </el-button>
              <h2 v-if="selectedPatient">查看 {{ selectedPatient.name }} 的健康档案</h2>
            </div>
            <HealthArchive
              :userId="selectedPatient?.id"
              @save="handleArchiveSave"
            />
          </div>

          <!-- 其他页面 -->
          <component v-else :is="currentComponent" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 24px;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.username {
  font-weight: 500;
}

.aside {
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
}

.aside .el-menu {
  border-right: none;
  background: #f8f9fa;
}

.aside .el-menu-item,
.aside .el-sub-menu__title {
  color: #2c3e50;
  background: #f8f9fa;
  border-radius: 6px;
  margin: 2px 8px;
}

.aside .el-menu-item.is-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.aside .el-menu-item:hover,
.aside .el-sub-menu__title:hover {
  background: #e3f2fd;
  color: #409eff;
}

.aside .el-sub-menu .el-menu-item {
  color: #2c3e50;
  background: #f8f9fa;
  margin-left: 20px;
}

.aside .el-sub-menu .el-menu-item.is-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.main {
  background: #f5f7fa;
  padding: 24px;
  box-sizing: border-box;
  overflow: auto;
}

.archive-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.archive-header h2 {
  margin: 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .aside {
    width: 200px !important;
  }

  .header-content {
    padding: 0 16px;
  }

  .header-title {
    font-size: 18px;
  }
}
</style>
