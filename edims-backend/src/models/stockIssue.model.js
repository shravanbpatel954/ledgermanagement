import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';

class StockIssue extends Model {}

StockIssue.init(
  {
    issue_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // item_id (FK)
    quantity_issued: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // dept_id (FK) - Replaces the old 'issued_to'
    purpose: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // user_id (FK)
    issue_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // created_at is handled by timestamps
  },
  {
    sequelize,
    modelName: 'StockIssue',
    tableName: 'StockIssues',
    timestamps: true,
    updatedAt: false,
  }
);

export default StockIssue;