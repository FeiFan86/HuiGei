import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'

const router = express.Router()

// 用户注册
router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名长度必须在3-20个字符之间'),
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码长度不能少于6个字符')
], async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        message: '输入参数错误',
        errors: errors.array()
      })
    }

    const { username, email, password } = req.body

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } })
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: '用户名已存在'
      })
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ where: { email } })
    if (existingEmail) {
      return res.status(400).json({
        code: 400,
        message: '邮箱已被注册'
      })
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12)

    // 创建用户
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      levelId: 1,
      experience: 0,
      points: 0,
      certified: false
    })

    // 生成JWT Token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.status(201).json({
      code: 201,
      message: '注册成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          levelId: user.levelId,
          experience: user.experience,
          points: user.points,
          certified: user.certified
        }
      }
    })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    })
  }
})

// 用户登录
router.post('/login', [
  body('username')
    .notEmpty()
    .withMessage('用户名不能为空'),
  body('password')
    .notEmpty()
    .withMessage('密码不能为空')
], async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        message: '输入参数错误',
        errors: errors.array()
      })
    }

    const { username, password } = req.body

    // 查找用户
    const user = await User.findOne({ where: { username } })
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误'
      })
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误'
      })
    }

    // 更新最后登录时间
    await user.update({ lastLoginAt: new Date() })

    // 生成JWT Token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          levelId: user.levelId,
          experience: user.experience,
          points: user.points,
          certified: user.certified,
          avatarUrl: user.avatarUrl,
          lastLoginAt: user.lastLoginAt
        }
      }
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    })
  }
})

// 获取当前用户信息
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '未提供认证令牌'
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

    res.json({
      code: 200,
      message: '获取成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          levelId: user.levelId,
          experience: user.experience,
          points: user.points,
          certified: user.certified,
          avatarUrl: user.avatarUrl,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt
        }
      }
    })
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        code: 401,
        message: '认证令牌无效'
      })
    }
    
    console.error('获取用户信息错误:', error)
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    })
  }
})

// 刷新Token
router.post('/refresh', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '未提供认证令牌'
      })
    }

    // 验证Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret')
    
    // 生成新的Token
    const newToken = jwt.sign(
      { userId: decoded.userId, username: decoded.username },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      code: 200,
      message: 'Token刷新成功',
      data: {
        token: newToken
      }
    })
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        code: 401,
        message: '认证令牌无效'
      })
    }
    
    console.error('刷新Token错误:', error)
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    })
  }
})

export default router