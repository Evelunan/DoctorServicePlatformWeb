<template>
  <div class="health-archive-view">
    <div class="page-header">
      <h1>健康档案管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="loadSampleData">
          <el-icon><Refresh /></el-icon>
          加载示例数据
        </el-button>
        <el-button @click="clearData">
          <el-icon><Delete /></el-icon>
          清空数据
        </el-button>
      </div>
    </div>

    <div class="archive-container">
      <CompleteHealthArchive
        ref="archiveRef"
        :userId="currentUserId"
        @save="handleSave"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Delete } from '@element-plus/icons-vue'
import CompleteHealthArchive from '@/components/health-archive/CompleteHealthArchive.vue'

const archiveRef = ref()
const currentUserId = ref(3) // 示例用户ID

// 处理保存事件
const handleSave = (archiveData) => {
  console.log('保存的健康档案数据:', archiveData)
  ElMessage.success('健康档案保存成功！')

  // 这里可以调用API保存数据
  // saveHealthArchive(archiveData)
}

// 加载示例数据
const loadSampleData = () => {
  const sampleData = {
    personalInfo: {
      id: 3,
      account: "ljwnzs",
      password: "e10adc3949ba59abbe56e057f20f883e",
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
      bloodType: 0, // A型
      allergies: "对青霉素过敏，对海鲜过敏",
      disability: 0, // 否
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
      },
      {
        id: 2,
        diseaseName: "糖尿病",
        diagnosisDate: "2018-06-20",
        status: "治疗中",
        notes: "2型糖尿病，通过饮食控制和药物治疗，血糖控制良好",
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
      },
      {
        id: 2,
        relation: "母亲",
        diseaseName: "糖尿病",
        notes: "母亲45岁时确诊糖尿病，通过饮食控制血糖",
        userId: 3
      },
      {
        id: 3,
        relation: "祖父",
        diseaseName: "心脏病",
        notes: "祖父因心脏病去世，享年65岁",
        userId: 3
      }
    ]
  }

  archiveRef.value?.loadArchiveData(sampleData)
  ElMessage.success('示例数据加载成功！')
}

// 清空数据
const clearData = () => {
  archiveRef.value?.resetForm()
  ElMessage.success('数据已清空！')
}

onMounted(() => {
  // 页面加载时可以设置医生列表
  const doctorList = [
    { id: 1, name: '张医生' },
    { id: 2, name: '李医生' },
    { id: 3, name: '王医生' },
    { id: 4, name: '刘医生' }
  ]
  archiveRef.value?.setDoctorList(doctorList)
})
</script>

<style scoped>
.health-archive-view {
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  margin: 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.archive-container {
  flex: 1;
  overflow: hidden;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
