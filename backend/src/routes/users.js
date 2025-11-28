import express from 'express'
import { body, validationResult, query } from 'express-validator'
import { authenticate } from '../middleware/auth.js'
import User from '../models/User.js'

const router = express.Router()

// 获取用户列表（管理员功能）
router.get('/', authenticate, [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须为正整数'),
  query('size').optional().isInt({ min: 1, max: 50 }).withMessage('每页数量必须在1-50之间')
], async (req, res) => {
  try {
    // 验证查询参数
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        message: '查询参数错误',
        errors: errors.array()
      })
    }

    const page = parseInt(req.query.page) || 1
    const size = parseInt(req.query.size) || 20
    const offset = (page - 1) * size

    // 查询用户列表
    const { count, rows } = await User.findAndCountAll({
      attributes: ['id', 'username', 'email', 'levelId', 'experience', 'points', 'certified', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: size,
      offset: offset
    })

    res.json({
      code: 200,
      message: '获取成功',
      data: {
        list: rows,
        pagination: {
          page,
          size,
          total: count,
          pages: Math.ceil(count / size)
        }
      }
    })
  } catch (error) {
    console.error('获取用户列表错误:', error)
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    })
  }
})

// 获取用户详情
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'levelId', 'experience', 'points', 'certified', 'avatarUrl', 'createdAt']
    })

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      })
    }

    res.json({
      code: 200,
      message: '获取成功',
      data: {
        user
      }
    })
  } catch (error) {
    console.error('获取用户详情错误:', error)
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    })
  }
})

// 更新用户信息（需要认证，只能更新自己的信息）
router.put('/profile', authenticate, [
  body('email')
    .optional()
    .isEmail()
    .withMessage('请输入有效的邮箱地址'),
  body('avatarUrl')
    .optional()
    .isURL()
    .withMessage('请输入有效的头像URL')
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

    const { email, avatarUrl } = req.body

    // 检查邮箱是否已被其他用户使用
    if (email) {
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: req.user.id }
        }
      })
      
      if (existingUser) {
        return res.status(400).json({
          code: 400,
          message: '邮箱已被其他用户使用'
        })
      }
    }

    // 更新用户信息
    await req.user.update({
      email: email || req.user.email,
      avatarUrl: avatarUrl || req.user.avatarUrl
    })

    res.json({
      code: 200,
      message: '更新成功',
      data: {
        user: {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email,
          levelId: req.user.levelId,
          experience: req.user.experience,
          points: req.user.points,
          certified: req.user.certified,
          avatarUrl: req.user.avatarUrl
        }
      }
    })
  } catch (error) {
    console.error('更新用户信息错误:', error)
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    })
  }
})

// 修改密码（需要认证）
router.put('/password', authenticate, [
  body('oldPassword')
    .notEmpty()
    .withMessage('原密码不能为空'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('新密码长度不能少于6个字符')
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

    const { oldPassword, newPassword } = req.body

    // 验证原密码
    const bcrypt = require('bcryptjs')
    const isOldPasswordValid = await bcrypt.compare(oldPassword, req.user.password)
    
    if (!isOldPasswordValid) {
      return res.status(400).json({
        code: 400,
        message: '原密码错误'
      })
    }

    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // 更新密码
    await req.user.update({
      password: hashedNewPassword
    })

    res.json({
      code: 200,
      message: '密码修改成功'
    })
  } catch (error) {
    console.error('修改密码错误:', error)
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    })
  }
})

// 获取用户统计数据
router.get('/:id/stats', async (req, res) => {
  try {
    const LineReport = require('../models/LineReport').default
    
    // 统计用户发布的线报数量
    const lineReportCount = await LineReport.count({
      where: {
        userId: req.params.id,
        status: 1,
        auditStatus: 1
      }
    })

    // 统计用户积分（这里可以扩展更多统计）
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'levelId', 'experience', 'points']
    })

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      })
    }

    res.json({
      code: 200,
      message: '获取成功',
      data: {
        stats: {
          lineReportCount,
          experience: user.experience,
          points: user.points,
          levelId: user.levelId
        }
      }
    })
  } catch (error) {
    console.error('获取用户统计数据错误:', error)
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    })
  }
})

export default router