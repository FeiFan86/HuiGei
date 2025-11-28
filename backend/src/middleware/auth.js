import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// 认证中间件
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '需要认证'
      })
    }

    // 验证Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret')
    
    // 查找用户
    const user = await User.findByPk(decoded.userId)
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户不存在'
      })
    }

    // 将用户信息添加到请求对象
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        code: 401,
        message: '认证令牌无效'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 401,
        message: '认证令牌已过期'
      })
    }
    
    console.error('认证中间件错误:', error)
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    })
  }
}

// 可选认证中间件（不强制要求认证）
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret')
      const user = await User.findByPk(decoded.userId)
      if (user) {
        req.user = user
      }
    }
    
    next()
  } catch (error) {
    // 可选认证不强制要求，所以即使Token无效也不报错
    next()
  }
}

// 管理员认证中间件
const adminAuth = async (req, res, next) => {
  try {
    await authenticate(req, res, () => {
      // 这里可以添加管理员权限检查逻辑
      // 例如：if (req.user.role !== 'admin') { return res.status(403)... }
      next()
    })
  } catch (error) {
    next(error)
  }
}

export { authenticate, optionalAuth, adminAuth }