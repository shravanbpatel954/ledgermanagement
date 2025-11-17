import { DataTypes, Model } from 'sequelize';
// This was the bad line, now it is fixed:
import { sequelize } from './index.js';

class ChallanItem extends Model {}

ChallanItem.init(
  {
    challan_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // challan_id (FK) will be defined by associations
    // item_id (FK) will be defined by associations
    quantity_received: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // created_at is handled by timestamps
  },
  {
    sequelize,
    modelName: 'ChallanItem',
    tableName: 'ChallanItems',
    timestamps: true,
    updatedAt: false,
  }
);

export default ChallanItem;