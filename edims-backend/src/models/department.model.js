// src/models/department.model.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Department extends Model {}

Department.init(
  {
    dept_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dept_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    // created_at is handled by timestamps: true
  },
  {
    sequelize,
    modelName: 'Department',
    tableName: 'Departments',
    timestamps: true,
    updatedAt: false,
  }
);

export default Department;