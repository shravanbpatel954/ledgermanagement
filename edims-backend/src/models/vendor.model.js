import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js'; // Import from index

class Vendor extends Model {}

Vendor.init(
  {
    vendor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vendor_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    gst_no: { 
      type: DataTypes.STRING(15), // Standard GSTIN is 15 characters
      allowNull: false,
      unique: true,
    },
    contact_person: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // created_at is handled by timestamps: true
  },
  {
    sequelize,
    modelName: 'Vendor',
    tableName: 'Vendors',
    timestamps: true,
    updatedAt: false, // We only care about created_at
  }
);

export default Vendor;