import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';

class LedgerBook extends Model {}

LedgerBook.init(
  {
    ledger_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    accession_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    dept_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    academic_year: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'e.g. 2024-25',
    },
    half: {
      type: DataTypes.ENUM('First Half', 'Second Half'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Optional label e.g. B.Sc CS Sem I results',
    },
    rack_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Shelf/rack location when in store',
    },
    status: {
      type: DataTypes.ENUM('In Rack', 'Issued'),
      allowNull: false,
      defaultValue: 'In Rack',
    },
    issued_to_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    issued_to_contact: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    issued_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'LedgerBook',
    tableName: 'LedgerBooks',
    timestamps: true,
    updatedAt: true,
    indexes: [
      { fields: ['dept_id', 'academic_year', 'half'] },
      { fields: ['status'] },
      { fields: ['rack_code'] },
    ],
  }
);

export default LedgerBook;
