// src/models/purchaseOrderItem.model.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class PurchaseOrderItem extends Model {}

PurchaseOrderItem.init(
  {
    po_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // po_id (FK) will be defined by associations
    // item_id (FK) will be defined by associations
    quantity_ordered: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity_received: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // created_at is handled by timestamps
  },
  {
    sequelize,
    modelName: 'PurchaseOrderItem',
    tableName: 'PurchaseOrderItems',
    timestamps: true,
    updatedAt: false,
  }
);

export default PurchaseOrderItem;