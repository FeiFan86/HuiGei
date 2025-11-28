import express from 'express'
import { body, validationResult, query } from 'express-validator'
import { authenticate } from '../middleware/auth.js'
import LineReport from '../models/LineReport.js'
import User from '../models/User.js'

const router = express.Router()

// 获取线报列表
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须为正整数'),
  query('size').optional().isInt({ min: 1, max: 50 }).withMessage('每页数量必须在1-50之间'),
  query('categoryId').optional().isInt().withMessage('分类ID必须为整数'),
  query('platform').optional().isString().withMessage('平台参数必须为字符串')
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
    
    const whereCondition = {
      status: 1, // 只显示正常状态的线报
      auditStatus: 1 // 只显示审核通过的线报
    }

    // 添加分类筛选
    if (req.query.categoryId) {
      whereCondition.categoryId = parseInt(req.query.categoryId)
    }

    // 添加平台筛选
    if (req.query.platform) {
      whereCondition.platform = req.query.platform
    }

    // 查询线报列表
    const { count, rows } = await LineReport.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'levelId']
        }
      ],
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
    console.error('获取线报列表错误:', error)
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    })
  }
})

// 获取线报详情
router.get('/:id', async (req, res) => {
  try {
    const lineReport = await LineReport.findOne({
      where: {
        id: req.params.id,
        status: 1,
        auditStatus: 1
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'levelId', 'experience', 'points']
        }
      ]
    })

    if (!lineReport) {
      return res.status(404).json({
        code: 404,
        message: '线报不存在'
      })
    }

    res.json({
      code: 200,
      message: '获取成功',
      data: {
        lineReport
      }
    })
  } catch (error) {
    console.error('获取线报详情错误:', error)
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    })
  }
})

// 发布线报（需要认证）
router.post('/', authenticate, [
  body('title')
    .notEmpty()
    .withMessage('标题不能为空')
    .isLength({ max: 200 })
    .withMessage('标题长度不能超过200个字符'),
  body('content')
    .notEmpty()
    .withMessage('内容不能为空'),
  body('originalUrl')
    .optional()
    .isURL()
    .withMessage('请输入有效的URL'),
  body('platform')
    .optional()
    .isString()
    .withMessage('平台参数必须为字符串'),
  body('categoryId')
    .optional()
    .isInt()
    .withMessage('分类ID必须为整数')
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

    const { title, content, originalUrl, platform, categoryId } = req.body

    // 创建线报
    const lineReport = await LineReport.create({
      title,
      content,
      originalUrl,
      cleanedUrl: originalUrl, // 这里可以添加链接清洗逻辑
      platform,
      categoryId,
      userId: req.user.id,
      sourceType: 1, // 用户发布
      auditStatus: req.user.levelId >= 3 ? 1 : 0 // 高等级用户免审
    })

    // 如果是高等级用户，直接审核通过
    if (req.user.levelId >= 3) {
      await lineReport.update({
        auditStatus: 1,
        auditAt: new Date(),
        auditUserId: req.user.id
      })
    }

    res.status(201).json({
      code: 201,
      message: req.user.levelId >= 3 ? '发布成功' : '发布成功，等待审核',
      data: {
        lineReport
      }
    })
  } catch (error) {
    console.error('发布线报错误:', error)
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    })
  }
})

// 更新线报（需要认证，且只能更新自己的线报）
router.put('/:id', authenticate, [
  body('title')
    .optional()
    .isLength({ max: 200 })
    .withMessage('标题长度不能超过200个字符'),
  body('content')
    .optional()
    .notEmpty()
    .withMessage('内容不能为空')
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

    const lineReport = await LineReport.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
        status: 1
      }
    })

    if (!lineReport) {
      return res.status(404).json({
        code: 404,
        message: '线报不存在或无权操作'
      })
    }

    // 更新线报
    await lineReport.update({
      ...req.body,
      auditStatus: 0 // 更新后需要重新审核
    })

    res.json({
      code: 200,
      message: '更新成功，等待审核',
      data: {
        lineReport
      }
    })
  } catch (error) {
    console.error('更新线报错误:', error)
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    })
  }
})

// 删除线报（需要认证，且只能删除自己的线报）
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const lineReport = await LineReport.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    })

    if (!lineReport) {
      return res.status(404).json({
        code: 404,
        message: '线报不存在或无权操作'
      })
    }

    // 软删除
    await lineReport.destroy()

    res.json({
      code: 200,
      message: '删除成功'
    })
  } catch (error) {
    console.error('删除线报错误:', error)
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    })
  }
})

export default router