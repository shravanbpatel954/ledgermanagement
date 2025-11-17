// src/models/auditLog.model.js
import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index.js";

class AuditLog extends Model {}

AuditLog.init(
  {
    log_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    action_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    module: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    record_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "AuditLog",
    tableName: "AuditLog",
    timestamps: true,
    updatedAt: false,
  }
);

export default AuditLog;
