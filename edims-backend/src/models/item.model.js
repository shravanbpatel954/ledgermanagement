// src/models/item.model.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Item extends Model {}

Item.init(
  {
    item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    item_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    current_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // created_at is handled by timestamps: true
  },
  {
    sequelize,
    modelName: 'Item',
    tableName: 'Items',
    timestamps: true,
    updatedAt: false,
    // Add a unique constraint for the combination
    indexes: [
      {
        unique: true,
        fields: ['item_name', 'size', 'color'],
      },
    ],
  }
);

export default Item;