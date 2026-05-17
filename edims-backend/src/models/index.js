import { Sequelize } from 'sequelize';
import sequelize from '../config/db.js';

// Import all models
import User from './user.model.js';
import Department from './department.model.js';
import AuditLog from './auditLog.model.js';
import LedgerBook from './ledgerBook.model.js';
import LedgerMovement from './ledgerMovement.model.js';

// --- 1. Initialize Models ---
const models = {
  User,
  Department,
  AuditLog,
  LedgerBook,
  LedgerMovement,
};

// --- 2. DEFINE MODEL ASSOCIATIONS ---

// User relationships
User.hasMany(AuditLog, { foreignKey: 'user_id' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });

// Exam ledger (result books) — library-style tracking
Department.hasMany(LedgerBook, { foreignKey: 'dept_id' });
LedgerBook.belongsTo(Department, { foreignKey: 'dept_id' });

LedgerBook.hasMany(LedgerMovement, { foreignKey: 'ledger_id' });
LedgerMovement.belongsTo(LedgerBook, { foreignKey: 'ledger_id' });

User.hasMany(LedgerMovement, { foreignKey: 'user_id' });
LedgerMovement.belongsTo(User, { foreignKey: 'user_id' });

// --- 3. Export ---
// Export sequelize instance and all models
export { sequelize };
export {
  User,
  Department,
  AuditLog,
  LedgerBook,
  LedgerMovement,
};