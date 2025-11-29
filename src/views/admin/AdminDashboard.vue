<template>
  <div class="admin-dashboard">
    <el-container>
      <el-header>
        <h1>管理员面板</h1>
        <el-menu mode="horizontal" :default-active="$route.path" router>
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/money-saving-community">省钱社区</el-menu-item>
          <el-menu-item index="/money-saving-tools">省钱工具</el-menu-item>
          <el-menu-item index="/admin">管理员</el-menu-item>
        </el-menu>
      </el-header>
      
      <el-main>
        <div class="dashboard-content">
          <h2>系统管理</h2>
          
          <el-alert
            title="管理员专属功能"
            type="warning"
            description="此功能仅限管理员访问"
            show-icon
            :closable="false"
            style="margin-bottom: 20px"
          />
          
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card class="stat-card">
                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="el-icon-user"></i>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">1,234</div>
                    <div class="stat-label">注册用户</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            
            <el-col :span="8">
              <el-card class="stat-card">
                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="el-icon-chat-dot-round"></i>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">567</div>
                    <div class="stat-label">社区帖子</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            
            <el-col :span="8">
              <el-card class="stat-card">
                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="el-icon-calculator"></i>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">8,901</div>
                    <div class="stat-label">工具使用次数</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          
          <el-card style="margin-top: 20px">
            <template #header>
              <span>系统功能</span>
            </template>
            <el-row :gutter="20">
              <el-col :span="6" v-for="feature in adminFeatures" :key="feature.id">
                <el-card shadow="hover" class="feature-card">
                  <div class="feature-icon">
                    <i :class="feature.icon"></i>
                  </div>
                  <h3>{{ feature.title }}</h3>
                  <p>{{ feature.description }}</p>
                </el-card>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      adminFeatures: [
        {
          id: 1,
          title: '用户管理',
          description: '管理用户账号和权限',
          icon: 'el-icon-user'
        },
        {
          id: 2,
          title: '内容审核',
          description: '审核社区帖子和评论',
          icon: 'el-icon-document-checked'
        },
        {
          id: 3,
          title: '数据统计',
          description: '查看系统使用数据',
          icon: 'el-icon-data-analysis'
        },
        {
          id: 4,
          title: '系统设置',
          description: '配置系统参数',
          icon: 'el-icon-setting'
        }
      ]
    }
  }
}
</script>

<style scoped>
.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

.el-header h1 {
  text-align: center;
  margin: 0;
  padding: 0;
}

.stat-card {
  text-align: center;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.stat-icon {
  font-size: 2.5em;
  color: #409EFF;
}

.stat-value {
  font-size: 1.8em;
  font-weight: bold;
  color: #333;
}

.stat-label {
  color: #666;
  font-size: 0.9em;
}

.feature-card {
  text-align: center;
  height: 180px;
}

.feature-icon {
  font-size: 2.5em;
  color: #67c23a;
  margin-bottom: 10px;
}

.feature-card h3 {
  margin: 10px 0;
  color: #333;
}

.feature-card p {
  color: #666;
  font-size: 0.9em;
}
</style>