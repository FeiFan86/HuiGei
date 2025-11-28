<template>
  <div class="home">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="container">
        <h1>惠给网</h1>
        <p>优惠直接给到你 - 专注于优惠线报分享的开放平台</p>
        <div class="header-actions">
          <el-button type="primary" size="large" @click="goToLineReports">
            浏览线报
          </el-button>
          <el-button size="large" @click="goToCreateReport" v-if="isAuthenticated">
            发布线报
          </el-button>
          <el-button size="large" @click="goToLogin" v-else>
            立即登录
          </el-button>
        </div>
      </div>
    </header>

    <!-- 功能特色 -->
    <section class="features">
      <div class="container">
        <h2>平台特色</h2>
        <div class="feature-grid">
          <div class="feature-item">
            <el-icon size="48" color="#409EFF">
              <DocumentCopy />
            </el-icon>
            <h3>海量线报</h3>
            <p>自动化采集+用户贡献，提供最新、最实用的省钱信息</p>
          </div>
          <div class="feature-item">
            <el-icon size="48" color="#67C23A">
              <User />
            </el-icon>
            <h3>用户等级</h3>
            <p>经验值和惠给币双积分系统，高等级用户享免审特权</p>
          </div>
          <div class="feature-item">
            <el-icon size="48" color="#E6A23C">
              <ChatDotRound />
            </el-icon>
            <h3>省钱社区</h3>
            <p>用户分享省钱经验和技巧，共同打造省钱达人社区</p>
          </div>
          <div class="feature-item">
            <el-icon size="48" color="#F56C6C">
              <Tools />
            </el-icon>
            <h3>省钱工具</h3>
            <p>各类实用省钱小工具，助您轻松实现省钱目标</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新线报预览 -->
    <section class="latest-reports" v-if="latestReports.length > 0">
      <div class="container">
        <h2>最新线报</h2>
        <div class="reports-grid">
          <div 
            class="report-card" 
            v-for="report in latestReports" 
            :key="report.id"
            @click="viewReport(report.id)"
          >
            <div class="report-header">
              <span class="platform-tag">{{ report.platform }}</span>
              <span class="time">{{ formatTime(report.created_at) }}</span>
            </div>
            <h4 class="report-title">{{ report.title }}</h4>
            <p class="report-content">{{ report.content }}</p>
            <div class="report-footer">
              <span class="user">by {{ report.username }}</span>
            </div>
          </div>
        </div>
        <div class="view-more">
          <el-button type="primary" @click="goToLineReports">查看更多线报</el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { DocumentCopy, User, ChatDotRound, Tools } from '@element-plus/icons-vue'

const router = useRouter()
const isAuthenticated = ref(!!localStorage.getItem('token'))
const latestReports = ref([])

// 模拟获取最新线报数据
const fetchLatestReports = async () => {
  // 这里应该是API调用，暂时使用模拟数据
  latestReports.value = [
    {
      id: 1,
      title: '京东618大促，满300减60',
      content: '京东618活动期间，部分商品满300减60，叠加优惠券更优惠',
      platform: '京东',
      username: '省钱达人',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: '淘宝双11预售开启',
      content: '淘宝双11预售活动开始，预付定金享多重优惠',
      platform: '淘宝',
      username: '购物小能手',
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 3,
      title: '美团外卖新用户优惠',
      content: '美团外卖新用户首单立减15元，配送费优惠',
      platform: '美团',
      username: '外卖达人',
      created_at: new Date(Date.now() - 7200000).toISOString()
    }
  ]
}

const formatTime = (timeStr) => {
  const time = new Date(timeStr)
  const now = new Date()
  const diff = now - time
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return `${Math.floor(diff / 86400000)}天前`
}

const goToLineReports = () => {
  if (isAuthenticated.value) {
    router.push('/line-reports')
  } else {
    router.push('/login')
  }
}

const goToCreateReport = () => {
  router.push('/line-reports/create')
}

const goToLogin = () => {
  router.push('/login')
}

const viewReport = (id) => {
  // 这里应该跳转到线报详情页
  console.log('查看线报:', id)
}

onMounted(() => {
  fetchLatestReports()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.page-header h1 {
  font-size: 3rem;
  margin-bottom: 15px;
  font-weight: 700;
}

.page-header p {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 30px;
}

.header-actions {
  margin-top: 30px;
}

.header-actions .el-button {
  margin: 0 10px;
  padding: 12px 30px;
  font-size: 1.1rem;
}

.features {
  padding: 80px 0;
  background-color: white;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: #333;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-item {
  text-align: center;
  padding: 30px 20px;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.feature-item h3 {
  margin: 20px 0 15px;
  font-size: 1.4rem;
  color: #333;
}

.feature-item p {
  color: #666;
  line-height: 1.6;
}

.latest-reports {
  padding: 80px 0;
  background-color: #f8f9fa;
}

.latest-reports h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: #333;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.report-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.report-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.platform-tag {
  background: #409EFF;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.time {
  color: #999;
  font-size: 0.9rem;
}

.report-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
  line-height: 1.4;
}

.report-content {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.report-footer {
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.user {
  color: #999;
  font-size: 0.9rem;
}

.view-more {
  text-align: center;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2.2rem;
  }
  
  .page-header p {
    font-size: 1.1rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .reports-grid {
    grid-template-columns: 1fr;
  }
}
</style>