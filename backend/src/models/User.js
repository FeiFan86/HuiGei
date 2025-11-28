import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  levelId: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  },
  experience: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  certified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  avatarUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  paranoid: true
})

// 用户等级关联
User.associate = (models) => {
  User.belongsTo(models.UserLevel, {
    foreignKey: 'levelId',
    as: 'level'
  })
  
  User.hasMany(models.LineReport, {
    foreignKey: 'userId',
    as: 'lineReports'
  })
  
  User.hasMany(models.PointsLog, {
    foreignKey: 'userId',
    as: 'pointsLogs'
  })
}

export default User