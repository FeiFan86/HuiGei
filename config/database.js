import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

// 数据库配置 - 如果没有环境变量则使用模拟模式
let sequelize;

if (process.env.POSTGRES_HOST) {
  // 生产环境：使用真实数据库
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  });
} else {
  // 开发/演示环境：使用SQLite（无需外部数据库）
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
  console.log('ℹ️  使用SQLite数据库（无需配置环境变量）');
}

// 测试数据库连接
const testConnection = async () => {
  try {
    await sequelize.authenticate()
    if (process.env.POSTGRES_HOST) {
      console.log('✅ PostgreSQL数据库连接成功')
    } else {
      console.log('✅ SQLite数据库连接成功')
    }
    
    // 同步数据库模型
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
    console.log('✅ 数据库模型同步完成')
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message)
    // 非生产环境下继续运行（允许无数据库运行）
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚠️  数据库不可用，但应用将继续运行（演示模式）')
    } else {
      process.exit(1)
    }
  }
}

export { sequelize, testConnection }
export default sequelize