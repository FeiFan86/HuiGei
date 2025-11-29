<template>
  <div class="home">
    <el-container>
      <el-header>
        <h1>惠给网 - 优惠直接给到你</h1>
        <el-menu mode="horizontal" :default-active="$route.path" router>
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/money-saving-community">省钱社区</el-menu-item>
          <el-menu-item index="/money-saving-tools">省钱工具</el-menu-item>
          <el-menu-item index="/login" v-if="!isLoggedIn">登录</el-menu-item>
          <el-menu-item index="/register" v-if="!isLoggedIn">注册</el-menu-item>
          <el-sub-menu index="user" v-if="isLoggedIn">
            <template #title>欢迎，{{ user?.username }}</template>
            <el-menu-item index="/profile">个人中心</el-menu-item>
            <el-menu-item index="/admin" v-if="isAdmin">管理后台</el-menu-item>
            <el-menu-item @click="logout">退出登录</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-header>
      
      <el-main>
        <div class="hero-section">
          <h2>发现最优惠的省钱机会</h2>
          <p>汇集全网优惠信息，让您轻松省钱</p>
          <el-button type="primary" size="large" @click="$router.push('/money-saving-community')">
            立即探索
          </el-button>
        </div>

        <div class="features-section">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card>
                <h3>省钱社区</h3>
                <p>分享省钱经验，交流优惠信息</p>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card>
                <h3>省钱工具</h3>
                <p>实用的计算工具，帮助您更好规划</p>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card>
                <h3>实时线报</h3>
                <p>第一时间获取最新优惠信息</p>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user'
import { mapState, mapActions } from 'pinia'

export default {
  name: 'Home',
  computed: {
    ...mapState(useUserStore, ['user', 'isLoggedIn', 'isAdmin'])
  },
  methods: {
    ...mapActions(useUserStore, ['logout'])
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.el-header {
  background-color: #409EFF;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.hero-section {
  text-align: center;
  padding: 60px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: -20px -20px 40px -20px;
}

.hero-section h2 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.features-section {
  margin-top: 40px;
}

.el-card {
  text-align: center;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>