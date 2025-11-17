import { Sequelize } from 'sequelize';
import sequelize from '../config/db.js';

// Import all models
import User from './user.model.js';
import Vendor from './vendor.model.js';
import Item from './item.model.js';
import Department from './department.model.js';
import PurchaseOrder from './purchaseOrder.model.js';
import PurchaseOrderItem from './purchaseOrderItem.model.js';
import Challan from './challan.model.js';
import ChallanItem from './challanItem.model.js';
import Bill from './bill.model.js';
import BillChallan from './billChallan.model.js';
import AuditLog from './auditLog.model.js';
import BillItem from './billItem.model.js'; 
import StockIssue from './stockIssue.model.js';

// --- 1. Initialize Models ---
const models = {
  User,
  Vendor,
  Item,
  Department,
  PurchaseOrder,
  PurchaseOrderItem,
  Challan,
  ChallanItem,
  Bill,
  BillChallan,
  AuditLog,
  BillItem, 
  StockIssue,
};

// --- 2. DEFINE MODEL ASSOCIATIONS ---

// User relationships
User.hasMany(PurchaseOrder, { foreignKey: 'user_id' });
User.hasMany(Challan, { foreignKey: 'user_id' });
User.hasMany(Bill, { foreignKey: 'user_id' });
User.hasMany(AuditLog, { foreignKey: 'user_id' });
User.hasMany(StockIssue, { foreignKey: 'user_id' });

PurchaseOrder.belongsTo(User, { foreignKey: 'user_id' });
Challan.belongsTo(User, { foreignKey: 'user_id' });
Bill.belongsTo(User, { foreignKey: 'user_id' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });
StockIssue.belongsTo(User, { foreignKey: 'user_id' });

// Vendor relationships
Vendor.hasMany(PurchaseOrder, { foreignKey: 'vendor_id' });
Vendor.hasMany(Bill, { foreignKey: 'vendor_id' });

PurchaseOrder.belongsTo(Vendor, { foreignKey: 'vendor_id' });
Bill.belongsTo(Vendor, { foreignKey: 'vendor_id' });

// PO -> POItem -> Item
PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: 'po_id' });
PurchaseOrderItem.belongsTo(PurchaseOrder, { foreignKey: 'po_id' });

Item.hasMany(PurchaseOrderItem, { foreignKey: 'item_id' });
PurchaseOrderItem.belongsTo(Item, { foreignKey: 'item_id' });

// PO -> Challan
PurchaseOrder.hasMany(Challan, { foreignKey: 'po_id' });
Challan.belongsTo(PurchaseOrder, { foreignKey: 'po_id' });

// Challan -> ChallanItem -> Item
Challan.hasMany(ChallanItem, { foreignKey: 'challan_id' });
ChallanItem.belongsTo(Challan, { foreignKey: 'challan_id' });

Item.hasMany(ChallanItem, { foreignKey: 'item_id' });
ChallanItem.belongsTo(Item, { foreignKey: 'item_id' });

// Bill -> Challan (Many-to-Many)
Bill.belongsToMany(Challan, {
  through: BillChallan,
  foreignKey: 'bill_id',
});
Challan.belongsToMany(Bill, {
  through: BillChallan,
  foreignKey: 'challan_id',
});

// Bill -> BillItem -> Item (NEWLY ADDED SECTION)
Bill.hasMany(BillItem, { foreignKey: 'bill_id' });
BillItem.belongsTo(Bill, { foreignKey: 'bill_id' });

Item.hasMany(BillItem, { foreignKey: 'item_id' });
BillItem.belongsTo(Item, { foreignKey: 'item_id' });

// StockIssue -> Item / Dept
StockIssue.belongsTo(Item, { foreignKey: 'item_id' });
StockIssue.belongsTo(Department, { foreignKey: 'dept_id' });

Item.hasMany(StockIssue, { foreignKey: 'item_id' });
Department.hasMany(StockIssue, { foreignKey: 'dept_id' });

// --- 3. Export ---
// Export sequelize instance and all models
export { sequelize };
export {
  User,
  Vendor,
  Item,
  Department,
  PurchaseOrder,
  PurchaseOrderItem,
  Challan,
  ChallanItem,
  Bill,
  BillChallan,
  AuditLog,
  BillItem, 
  StockIssue,
};