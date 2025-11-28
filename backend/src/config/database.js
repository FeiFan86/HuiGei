import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

// 数据库连接配置
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'huigei',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  timezone: '+08:00', // 东八区
  
  // 连接池配置
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  
  // 日志配置
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  
  // 其他配置
  define: {
    timestamps: true, // 自动添加 createdAt 和 updatedAt
    underscored: true, // 使用下划线命名
    paranoid: true // 软删除
  }
})

// 测试数据库连接
const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ 数据库连接成功')
    
    // 同步数据库表结构（开发环境使用）
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true })
      console.log('✅ 数据库表结构同步完成')
    }
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message)
    process.exit(1)
  }
}

export { sequelize, testConnection }