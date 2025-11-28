import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

const LineReport = sequelize.define('LineReport', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  originalUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  cleanedUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  platform: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1, // 1:正常 2:删除
    allowNull: false
  },
  auditStatus: {
    type: DataTypes.TINYINT,
    defaultValue: 0, // 0:待审核 1:通过 2:拒绝
    allowNull: false
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  sourceType: {
    type: DataTypes.TINYINT,
    defaultValue: 1, // 1:用户发布 2:后台采集
    allowNull: false
  },
  collectedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  auditAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  auditUserId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  auditReason: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'line_reports',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['categoryId']
    },
    {
      fields: ['status', 'auditStatus']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['createdAt']
    }
  ]
})

// 关联关系
LineReport.associate = (models) => {
  LineReport.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  })
  
  LineReport.belongsTo(models.Category, {
    foreignKey: 'categoryId',
    as: 'category'
  })
  
  LineReport.belongsTo(models.User, {
    foreignKey: 'auditUserId',
    as: 'auditUser'
  })
}

export default LineReport