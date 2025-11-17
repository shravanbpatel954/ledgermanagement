// src/models/billChallan.model.js
import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';

class BillChallan extends Model {}

BillChallan.init(
  {
    bill_challan_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // bill_id (FK)
    // challan_id (FK)
  },
  {
    sequelize,
    modelName: 'BillChallan',
    tableName: 'BillChallans',
    timestamps: false, // We don't need timestamps on a simple link table
  }
);

export default BillChallan;