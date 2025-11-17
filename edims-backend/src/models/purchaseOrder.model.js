// src/models/purchaseOrder.model.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class PurchaseOrder extends Model {}

PurchaseOrder.init(
  {
    po_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    purchase_no: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    // vendor_id (FK) will be defined by associations
    // user_id (FK) will be defined by associations
    status: {
      type: DataTypes.ENUM('Pending Delivery', 'Completed'),
      allowNull: false,
      defaultValue: 'Pending Delivery',
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // created_at is handled by timestamps
  },
  {
    sequelize,
    modelName: 'PurchaseOrder',
    tableName: 'PurchaseOrders',
    timestamps: true,
    updatedAt: false,
  }
);

export default PurchaseOrder;