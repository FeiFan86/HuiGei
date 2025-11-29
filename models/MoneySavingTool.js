import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const MoneySavingTool = sequelize.define('MoneySavingTool', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('calculator', 'planner', 'analyzer', 'comparison', 'tracker'),
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  componentName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00
  },
  config: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'money_saving_tools',
  timestamps: true
})

export default MoneySavingTool