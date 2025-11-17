import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';

class BillItem extends Model {}

BillItem.init(
  {
    bill_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // bill_id (FK) will be defined by associations
    // item_id (FK) will be defined by associations
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    // The total (quantity * rate) will be calculated, not stored here.
    // The Bill header will store the sum of all totals.
  },
  {
    sequelize,
    modelName: 'BillItem',
    tableName: 'BillItems',
    timestamps: false, // These are just line items, no need for timestamps
  }
);

export default BillItem;