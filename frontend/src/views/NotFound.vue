<template>
  <div class="not-found">
    <div class="container">
      <div class="error-content">
        <h1>404</h1>
        <h2>页面未找到</h2>
        <p>抱歉，您访问的页面不存在或已被移除</p>
        <div class="actions">
          <el-button type="primary" @click="goHome">返回首页</el-button>
          <el-button @click="goBack">返回上一页</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.error-content {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}

.error-content h1 {
  font-size: 8rem;
  margin: 0;
  font-weight: 700;
  opacity: 0.8;
}

.error-content h2 {
  font-size: 2rem;
  margin: 20px 0;
  opacity: 0.9;
}

.error-content p {
  font-size: 1.1rem;
  margin-bottom: 30px;
  opacity: 0.8;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.actions .el-button {
  padding: 12px 30px;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .error-content h1 {
    font-size: 6rem;
  }
  
  .error-content h2 {
    font-size: 1.5rem;
  }
  
  .actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>