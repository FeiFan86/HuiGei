<template>
  <div class="community">
    <el-container>
      <el-header>
        <h1>省钱社区</h1>
        <el-menu mode="horizontal" :default-active="$route.path" router>
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/money-saving-community">省钱社区</el-menu-item>
          <el-menu-item index="/money-saving-tools">省钱工具</el-menu-item>
        </el-menu>
      </el-header>
      
      <el-main>
        <div class="community-content">
          <h2>省钱经验分享</h2>
          <p>这里汇集了众多用户的省钱经验和优惠信息分享</p>
          
          <el-alert
            title="功能开发中"
            type="info"
            description="省钱社区功能正在开发中，敬请期待！"
            show-icon
            :closable="false"
            style="margin-bottom: 20px"
          />
          
          <el-card>
            <template #header>
              <span>即将推出的功能</span>
            </template>
            <ul>
              <li>用户经验分享</li>
              <li>优惠信息发布</li>
              <li>省钱技巧讨论</li>
              <li>用户互动点赞</li>
              <li>热门话题排行</li>
            </ul>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'MoneySavingCommunity'
}
</script>

<style scoped>
.community-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.el-header h1 {
  text-align: center;
  margin: 0;
  padding: 0;
}

.community-content h2 {
  color: #333;
  margin-bottom: 10px;
}

.community-content p {
  color: #666;
  margin-bottom: 30px;
}

ul {
  text-align: left;
  padding-left: 20px;
}

li {
  margin-bottom: 8px;
  color: #555;
}
</style>