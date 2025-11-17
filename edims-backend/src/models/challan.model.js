import { DataTypes, Model } from 'sequelize';
// This was the bad line, now it is fixed:
import { sequelize } from './index.js';

class Challan extends Model {}

Challan.init(
  {
    challan_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    challan_no: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    // po_id (FK) will be defined by associations
    // user_id (FK) will be defined by associations
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // created_at is handled by timestamps
  },
  {
    sequelize,
    modelName: 'Challan',
    tableName: 'Challans',
    timestamps: true,
    updatedAt: false,
  }
);

export default Challan;