import {
  sequelize,
  Item,
  Challan,
  ChallanItem,
  StockIssue,
  PurchaseOrder,
  PurchaseOrderItem,
  Department,
  Bill,
  Vendor,
  User,
} from '../models/index.js';

// --- 1. Get Stock Report ---
// (This function is already here, no changes)
export const getStockReport = async (req, res) => {
  try {
    const stock = await Item.findAll({
      attributes: ['item_id', 'item_name', 'size', 'color', 'current_stock'],
      order: [['item_name', 'ASC']],
    });
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 2. Get Item Ledger ---
// (This function is already here, no changes)
export const getItemLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id, {
      attributes: ['item_name', 'size', 'color'],
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Get Incoming Transactions (from Challans)
    const incoming = await ChallanItem.findAll({
      where: { item_id: id },
      include: [
        {
          model: Challan,
          attributes: ['challan_no', 'delivery_date'],
          include: [
            { model: PurchaseOrder, attributes: ['purchase_no'] },
            { model: User, attributes: ['full_name'] },
          ],
        },
      ],
    });

    // Get Outgoing Transactions (from StockIssues)
    const outgoing = await StockIssue.findAll({
      where: { item_id: id },
      include: [
        { model: Department, attributes: ['dept_name'] },
        { model: User, attributes: ['full_name'] },
      ],
    });

    // Format and combine
    const ledger = [];
    incoming.forEach((tx) => {
      ledger.push({
        date: tx.Challan.delivery_date,
        type: 'INCOMING',
        details: `Received via Challan #${tx.Challan.challan_no}`,
        quantity: `+${tx.quantity_received}`,
        receivedBy: tx.Challan.User?.full_name || '-',
      });
    });

    outgoing.forEach((tx) => {
      ledger.push({
        date: tx.issue_date,
        type: 'OUTGOING',
        details: `Issued to ${tx.Department.dept_name} for ${tx.purpose}`,
        quantity: `-${tx.quantity_issued}`,
        issuedBy: tx.User?.full_name || 'N/A',
      });
    });

    // Sort by date
    ledger.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({ item_details: item, ledger });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 3. NEW: Get Vendor Ledger ---
export const getVendorLedger = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get Vendor details
    const vendor = await Vendor.findByPk(id, {
      attributes: ['vendor_id', 'vendor_name', 'contact_person', 'phone'],
    });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // 2. Get all bills for this vendor
    const bills = await Bill.findAll({
      where: { vendor_id: id },
      attributes: ['bill_id', 'bill_no', 'bill_date', 'bill_amount', 'status'],
      order: [['bill_date', 'ASC']],
    });

    // 3. Calculate summary
    let totalBilled = 0;
    let totalPaid = 0;

    bills.forEach(bill => {
      totalBilled += parseFloat(bill.bill_amount);
      if (bill.status === 'Completed') {
        totalPaid += parseFloat(bill.bill_amount);
      }
    });

    const outstandingBalance = totalBilled - totalPaid;

    res.status(200).json({
      vendor_details: vendor,
      summary: {
        totalBilled: totalBilled.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        outstandingBalance: outstandingBalance.toFixed(2),
      },
      bills: bills,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 4. NEW: Get Bill Summary ---
export const getBillSummary = async (req, res) => {
  try {
    const bills = await Bill.findAll({
      attributes: ['bill_id', 'bill_no', 'bill_date', 'bill_amount', 'status'],
      include: [{ model: Vendor, attributes: ['vendor_name'] }],
      order: [['bill_date', 'DESC']],
    });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};