import {
  PurchaseOrderItem,
  ChallanItem,
  BillItem,
  StockIssue,
  PurchaseOrder,
  Bill,
} from '../models/index.js';

/** Item: PO lines, challan lines, bill lines, stock issues */
export const MSG_ITEM_MASTER_TX =
  'Transactions exist for this item (purchase orders, challans, bills, or stock issues). No modification or deletion is allowed.';

export async function getItemTransactionTotal(itemId) {
  const id = parseInt(itemId, 10);
  if (Number.isNaN(id)) return 0;
  const [a, b, c, d] = await Promise.all([
    PurchaseOrderItem.count({ where: { item_id: id } }),
    ChallanItem.count({ where: { item_id: id } }),
    BillItem.count({ where: { item_id: id } }),
    StockIssue.count({ where: { item_id: id } }),
  ]);
  return a + b + c + d;
}

/** Vendor: purchase orders, bills */
export const MSG_VENDOR_MASTER_TX =
  'Transactions exist for this vendor (purchase orders or bills). No modification or deletion is allowed.';

export async function getVendorTransactionTotal(vendorId) {
  const id = parseInt(vendorId, 10);
  if (Number.isNaN(id)) return 0;
  const [po, bi] = await Promise.all([
    PurchaseOrder.count({ where: { vendor_id: id } }),
    Bill.count({ where: { vendor_id: id } }),
  ]);
  return po + bi;
}

/** Department: stock issues */
export const MSG_DEPT_MASTER_TX =
  'Transactions exist for this department (stock issues). No modification or deletion is allowed.';

export async function getDepartmentIssueTotal(deptId) {
  const id = parseInt(deptId, 10);
  if (Number.isNaN(id)) return 0;
  return StockIssue.count({ where: { dept_id: id } });
}
