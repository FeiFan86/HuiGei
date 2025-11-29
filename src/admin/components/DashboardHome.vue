<template>
  <div class="dashboard-home">
    <h2>数据概览</h2>
    
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="stat-card">
            <div class="stat-icon user-icon">
              <i class="el-icon-user"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.totalUsers }}</div>
              <div class="stat-label">总用户数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card>
          <div class="stat-card">
            <div class="stat-icon post-icon">
              <i class="el-icon-document"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.totalPosts }}</div>
              <div class="stat-label">总帖子数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card>
          <div class="stat-card">
            <div class="stat-icon active-icon">
              <i class="el-icon-data-line"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.activeUsers }}</div>
              <div class="stat-label">活跃用户</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card>
          <div class="stat-card">
            <div class="stat-icon growth-icon">
              <i class="el-icon-trend-charts"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.growthRate }}%</div>
              <div class="stat-label">增长率</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>最近活动</span>
          </template>
          <el-timeline>
            <el-timeline-item 
              v-for="activity in recentActivities" 
              :key="activity.id"
              :timestamp="activity.time">
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>快速操作</span>
          </template>
          <div class="quick-actions">
            <el-button type="primary" icon="el-icon-user" @click="$router.push('/admin/users')">
              用户管理
            </el-button>
            <el-button type="success" icon="el-icon-document" @click="$router.push('/admin/posts')">
              内容管理
            </el-button>
            <el-button type="warning" icon="el-icon-setting" @click="$router.push('/admin/settings')">
              系统设置
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'DashboardHome',
  data() {
    return {
      stats: {
        totalUsers: 1256,
        totalPosts: 3421,
        activeUsers: 289,
        growthRate: 15.2
      },
      recentActivities: [
        {
          id: 1,
          content: '用户 "省钱达人" 发布了新的省钱经验',
          time: '2024-01-15 14:30'
        },
        {
          id: 2,
          content: '新增用户注册：购物专家',
          time: '2024-01-15 13:45'
        },
        {
          id: 3,
          content: '系统维护完成，所有功能正常',
          time: '2024-01-15 10:20'
        },
        {
          id: 4,
          content: '用户 "小省钱" 获得了省钱达人称号',
          time: '2024-01-15 09:15'
        }
      ]
    }
  }
}
</script>

<style scoped>
.dashboard-home {
  padding: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  margin-right: 15px;
}

.user-icon { background: #409EFF; }
.post-icon { background: #67C23A; }
.active-icon { background: #E6A23C; }
.growth-icon { background: #F56C6C; }

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.quick-actions .el-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
}
</style>