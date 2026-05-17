import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';

class LedgerMovement extends Model {}

LedgerMovement.init(
  {
    movement_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ledger_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM('Issue', 'Return'),
      allowNull: false,
    },
    issued_to_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    issued_to_contact: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    rack_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'LedgerMovement',
    tableName: 'LedgerMovements',
    timestamps: true,
    updatedAt: false,
  }
);

export default LedgerMovement;
