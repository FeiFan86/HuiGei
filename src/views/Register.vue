<template>
  <div class="register">
    <el-container>
      <el-main>
        <div class="register-container">
          <el-card class="register-card">
            <template #header>
              <h2>注册惠给网</h2>
            </template>
            
            <el-form :model="form" :rules="rules" ref="registerForm" class="register-form">
              <el-form-item prop="username">
                <el-input 
                  v-model="form.username" 
                  placeholder="用户名"
                  prefix-icon="el-icon-user"
                  size="large">
                </el-input>
              </el-form-item>
              
              <el-form-item prop="email">
                <el-input 
                  v-model="form.email" 
                  placeholder="邮箱"
                  prefix-icon="el-icon-message"
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
              
              <el-form-item prop="confirmPassword">
                <el-input 
                  v-model="form.confirmPassword" 
                  type="password" 
                  placeholder="确认密码"
                  prefix-icon="el-icon-lock"
                  size="large"
                  show-password>
                </el-input>
              </el-form-item>
              
              <el-form-item>
                <el-button 
                  type="primary" 
                  size="large" 
                  class="register-btn"
                  :loading="loading"
                  @click="handleRegister">
                  注册
                </el-button>
              </el-form-item>
              
              <div class="register-links">
                <el-link type="primary" @click="$router.push('/login')">
                  已有账号？立即登录
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
  name: 'Register',
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    async handleRegister() {
      this.$refs.registerForm.validate(async (valid) => {
        if (!valid) return
        
        this.loading = true
        
        try {
          // 模拟注册API调用
          const response = await fetch('/api/auth/register', {
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
            
            this.$message.success('注册成功')
            this.$router.push('/')
          } else {
            this.$message.error(result.message || '注册失败')
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
.register {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.register-card {
  width: 400px;
  text-align: center;
}

.register-form {
  margin-top: 20px;
}

.register-btn {
  width: 100%;
  margin-top: 10px;
}

.register-links {
  text-align: center;
  margin-top: 20px;
}
</style>