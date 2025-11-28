import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

// 路由导入
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import lineReportRoutes from './routes/lineReports.js'

// 环境变量配置
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 安全中间件
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// 限流配置
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100次请求
  message: {
    code: 429,
    message: '请求过于频繁，请稍后再试'
  }
})
app.use(limiter)

// 基础中间件
app.use(compression())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    code: 200,
    message: '服务运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// API路由
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/line-reports', lineReportRoutes)

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    path: req.originalUrl
  })
})

// 全局错误处理
app.use((error, req, res, next) => {
  console.error('全局错误:', error)
  
  // 数据库错误
  if (error.name === 'SequelizeError') {
    return res.status(500).json({
      code: 500,
      message: '数据库错误'
    })
  }
  
  // JWT错误
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      code: 401,
      message: '身份验证失败'
    })
  }
  
  // 其他错误
  res.status(error.status || 500).json({
    code: error.status || 500,
    message: error.message || '服务器内部错误'
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 惠给网后端服务已启动`)
  console.log(`📍 服务地址: http://localhost:${PORT}`)
  console.log(`⏰ 启动时间: ${new Date().toLocaleString()}`)
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 运行环境: 开发环境')
  } else {
    console.log('🏭 运行环境: 生产环境')
  }
})

export default app