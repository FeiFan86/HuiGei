<template>
  <div class="login">
    <el-container>
      <el-main>
        <div class="login-container">
          <el-card class="login-card">
            <template #header>
              <h2>登录惠给网</h2>
            </template>
            
            <el-form :model="form" :rules="rules" ref="loginForm" class="login-form">
              <el-form-item prop="username">
                <el-input 
                  v-model="form.username" 
                  placeholder="用户名或邮箱"
                  prefix-icon="el-icon-user"
                  size="large">
                </el-input>
              </el-form-item>
              
              <el-form-item prop="password">
                <el-input 
                  v-model="form.password" 
                  type="password" 
                  placeholder="密码"
                  prefix-icon="el-icon-lock"
                  size="large"
                  show-password>
                </el-input>
              </el-form-item>
              
              <el-form-item>
                <el-button 
                  type="primary" 
                  size="large" 
                  class="login-btn"
                  :loading="loading"
                  @click="handleLogin">
                  登录
                </el-button>
              </el-form-item>
              
              <div class="login-links">
                <el-link type="primary" @click="$router.push('/register')">
                  没有账号？立即注册
                </el-link>
              </div>
            </el-form>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) return
        
        this.loading = true
        
        try {
          // 模拟登录API调用
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.form)
          })
          
          const result = await response.json()
          
          if (result.success) {
            const userStore = useUserStore()
            userStore.login(result.user, result.token)
            
            this.$message.success('登录成功')
            this.$router.push('/')
          } else {
            this.$message.error(result.message || '登录失败')
          }
        } catch (error) {
          this.$message.error('网络错误，请稍后重试')
        } finally {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-card {
  width: 400px;
  text-align: center;
}

.login-form {
  margin-top: 20px;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
}

.login-links {
  text-align: center;
  margin-top: 20px;
}
</style>