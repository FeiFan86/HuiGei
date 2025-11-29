import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加认证token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // token过期，清除本地存储并跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  }
)

// API服务类
export class ApiService {
  // 用户认证相关
  static async login(credentials) {
    return api.post('/auth/login', credentials)
  }

  static async register(userData) {
    return api.post('/auth/register', userData)
  }

  // 省钱工具相关
  static async calculateBudget(data) {
    return api.post('/tools/budget-calculation', data)
  }

  static async calculateCompoundInterest(data) {
    return api.post('/tools/compound-interest', data)
  }

  static async calculateSavingGoals(data) {
    return api.post('/tools/saving-goals', data)
  }

  static async optimizeCoupons(data) {
    return api.post('/tools/coupon-optimization', data)
  }

  static async analyzeSpending(data) {
    return api.post('/tools/spending-analysis', data)
  }

  static async comparePrices(data) {
    return api.post('/tools/price-comparison', data)
  }

  static async calculateCompoundInterest(data) {
    return api.post('/tools/compound-interest', data)
  }

  static async calculateSavingGoals(data) {
    return api.post('/tools/saving-goals', data)
  }

  static async optimizeCoupons(data) {
    return api.post('/tools/coupon-optimization', data)
  }

  static async analyzeSpending(data) {
    return api.post('/tools/spending-analysis', data)
  }

  static async comparePrices(data) {
    return api.post('/tools/price-comparison', data)
  }

  // 省钱社区相关
  static async getPosts(params = {}) {
    return api.get('/money-saving/posts', { params })
  }

  static async createPost(postData) {
    return api.post('/money-saving/posts', postData)
  }

  static async likePost(postId) {
    return api.post(`/money-saving/posts/${postId}/like`)
  }

  // 文件上传
  static async uploadFile(file, onProgress = null) {
    const formData = new FormData()
    formData.append('file', file)

    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: onProgress
    })
  }

  // 健康检查
  static async healthCheck() {
    return api.get('/health')
  }
}

export default api