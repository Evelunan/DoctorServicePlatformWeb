<template>
  <div class="health-archive-view">
    <div class="page-header">
      <div class="header-left">
        <h1>健康档案管理</h1>
        <div v-if="currentPatientName" class="patient-info">
          <el-tag type="primary" size="large">{{ currentPatientName }}</el-tag>
        </div>
      </div>
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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Refresh, Delete } from '@element-plus/icons-vue'
import CompleteHealthArchive from '@/components/health-archive/CompleteHealthArchive.vue'

const route = useRoute()
const archiveRef = ref()
const currentUserId = ref(null) // 从路由参数获取用户ID
const currentPatientName = ref('') // 当前病人姓名

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

// 监听路由参数变化
watch(() => route.query.patientId, (newPatientId) => {
  if (newPatientId) {
    currentUserId.value = parseInt(newPatientId)
    loadPatientArchive(currentUserId.value)
  } else {
    currentUserId.value = null
    currentPatientName.value = ''
  }
}, { immediate: true })

// 加载病人档案数据
const loadPatientArchive = async (patientId) => {
  try {
    // 这里应该调用API获取病人的档案数据
    // const res = await getPatientArchive(patientId)

    // 暂时使用模拟数据，根据病人ID返回不同的数据
    const patientData = getPatientArchiveData(patientId)
    if (patientData) {
      archiveRef.value?.loadArchiveData(patientData)
      currentPatientName.value = patientData.personalInfo.username
      ElMessage.success(`已加载病人 ${patientData.personalInfo.username} 的档案数据`)
    }
  } catch (error) {
    console.error('加载病人档案失败:', error)
    ElMessage.error('加载病人档案失败')
  }
}

// 获取病人档案数据（模拟数据）
const getPatientArchiveData = (patientId) => {
  const archiveDataMap = {
    1: {
      personalInfo: {
        id: 1,
        account: "zhangsan",
        username: "张三",
        gender: 0,
        address: "北京市朝阳区",
        birthdate: "1959-03-15",
        phone: "13800000001",
        doctorId: 1,
        type: null
      },
      basicHealthInfo: {
        id: 1,
        height: 170.0,
        weight: 75.0,
        bloodType: 1, // B型
        allergies: "对花粉过敏",
        disability: 0,
        userId: 1
      },
      diseaseHistory: [
        {
          id: 1,
          diseaseName: "高血压",
          diagnosisDate: "2015-06-20",
          status: "治疗中",
          notes: "中度高血压，需要长期服药控制",
          userId: 1
        }
      ],
      familyDiseaseHistory: [
        {
          id: 1,
          relation: "父亲",
          diseaseName: "高血压",
          notes: "父亲有高血压病史",
          userId: 1
        }
      ]
    },
    2: {
      personalInfo: {
        id: 2,
        account: "lisi",
        username: "李四",
        gender: 1,
        address: "北京市海淀区",
        birthdate: "1952-08-10",
        phone: "13800000002",
        doctorId: 1,
        type: null
      },
      basicHealthInfo: {
        id: 2,
        height: 158.0,
        weight: 62.0,
        bloodType: 3, // O型
        allergies: "无",
        disability: 0,
        userId: 2
      },
      diseaseHistory: [
        {
          id: 2,
          diseaseName: "糖尿病",
          diagnosisDate: "2010-12-05",
          status: "治疗中",
          notes: "2型糖尿病，通过饮食和药物控制",
          userId: 2
        }
      ],
      familyDiseaseHistory: [
        {
          id: 2,
          relation: "母亲",
          diseaseName: "糖尿病",
          notes: "母亲有糖尿病病史",
          userId: 2
        }
      ]
    },
    3: {
      personalInfo: {
        id: 3,
        account: "wangwu",
        username: "王五",
        gender: 0,
        address: "北京市西城区",
        birthdate: "1966-11-25",
        phone: "13800000003",
        doctorId: 1,
        type: null
      },
      basicHealthInfo: {
        id: 3,
        height: 175.0,
        weight: 80.0,
        bloodType: 0, // A型
        allergies: "对海鲜过敏",
        disability: 0,
        userId: 3
      },
      diseaseHistory: [
        {
          id: 3,
          diseaseName: "心脏病",
          diagnosisDate: "2018-03-10",
          status: "治疗中",
          notes: "冠心病，需要定期复查",
          userId: 3
        }
      ],
      familyDiseaseHistory: [
        {
          id: 3,
          relation: "祖父",
          diseaseName: "心脏病",
          notes: "祖父因心脏病去世",
          userId: 3
        }
      ]
    }
  }

  return archiveDataMap[patientId] || null
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

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.page-header h1 {
  margin: 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.patient-info {
  display: flex;
  align-items: center;
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
