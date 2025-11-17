// src/models/bill.model.js
import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';

class Bill extends Model {}

Bill.init(
  {
    bill_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bill_no: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    // vendor_id (FK)
    // user_id (FK)
    bill_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    bill_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Completed'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    // created_at is handled by timestamps
  },
  {
    sequelize,
    modelName: 'Bill',
    tableName: 'Bills',
    timestamps: true,
    updatedAt: false,
  }
);

export default Bill;