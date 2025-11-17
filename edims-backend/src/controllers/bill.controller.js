import {
  sequelize,
  Bill,
  BillChallan,
  BillItem,
  Vendor,
  User,
  AuditLog,
  Challan,
  ChallanItem, // <-- Now needed
  Item,
} from '../models/index.js';
import { Op } from 'sequelize'; // <-- Now needed

// --- 1. Create a new Bill (SECURE REFACTOR) ---
export const createBill = async (req, res) => {
  const { bill_no, vendor_id, bill_date, challan_ids, items } = req.body;
  const user_id = req.user.id;

  // --- Validation ---
  if (!bill_no || !vendor_id || !bill_date || !challan_ids || !items) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (!Array.isArray(challan_ids) || challan_ids.length === 0) {
    return res.status(400).json({ message: 'challan_ids must be a non-empty array' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'items must be a non-empty array' });
  }

  // Start a transaction
  const t = await sequelize.transaction();

  try {
    // --- Step 1: BACKEND SECURITY CHECK ---
    // Recalculate the *correct* quantities from the selected challans
    // to verify what the frontend sent us.
    
    const correctQuantities = await ChallanItem.findAll({
      where: {
        challan_id: { [Op.in]: challan_ids },
      },
      attributes: [
        'item_id',
        [sequelize.fn('SUM', sequelize.col('quantity_received')), 'total_quantity'],
      ],
      group: ['item_id'],
      raw: true,
    });

    // Convert to a simple map for easy lookup, e.g., { 2: 500 }
    const correctQtyMap = correctQuantities.reduce((acc, item) => {
      acc[item.item_id] = parseInt(item.total_quantity, 10);
      return acc;
    }, {});

    let calculatedAmount = 0;

    // --- Step 2: Validate submitted items against our correct data ---
    for (const item of items) {
      if (!item.item_id || !item.quantity || !item.rate) {
        throw new Error('Each item must have item_id, quantity, and rate.');
      }

      const correctQty = correctQtyMap[item.item_id];
      const submittedQty = parseInt(item.quantity, 10);

      // THE SECURITY CHECK:
      if (!correctQty || submittedQty !== correctQty) {
        // This line blocks the tampered request
        throw new Error(`Invalid quantity for item_id ${item.item_id}. Submitted ${submittedQty}, but challans only have ${correctQty || 0}.`);
      }

      // If quantities match, add to the total
      calculatedAmount += parseFloat(item.quantity) * parseFloat(item.rate);
    }
    
    // --- Step 3: Create the Bill header (all checks passed) ---
    const newBill = await Bill.create(
      {
        bill_no,
        vendor_id,
        user_id,
        bill_date,
        bill_amount: calculatedAmount.toFixed(2),
        status: 'Pending',
      },
      { transaction: t }
    );

    // --- Step 4: Create the Bill line items ---
    const billItems = items.map(item => ({
      bill_id: newBill.bill_id,
      item_id: item.item_id,
      quantity: item.quantity,
      rate: item.rate,
    }));
    await BillItem.bulkCreate(billItems, { transaction: t });

    // --- Step 5: Link the Challans ---
    const billChallans = challan_ids.map(challan_id => ({
      bill_id: newBill.bill_id,
      challan_id: challan_id,
    }));
    await BillChallan.bulkCreate(billChallans, { transaction: t });

    // --- Step 6: Commit ---
    await t.commit();

    // --- Step 7: Fetch and return the full bill ---
    const fullNewBill = await getFullBillById(newBill.bill_id);
    res.status(201).json(fullNewBill);

  } catch (error) {
    // If anything fails, roll back
    if (t.finished !== 'commit' && t.finished !== 'rollback') {
        await t.rollback();
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Bill number already exists' });
    }
    // Send our specific validation error
    if (error.message.startsWith('Invalid quantity')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 2. Get All Bills ---
export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.findAll({
      order: [['bill_date', 'DESC']],
      include: [
        { model: Vendor, attributes: ['vendor_name', 'gst_no'], required: false },
        { model: User, attributes: ['full_name'], required: false },
      ],
    });
    res.status(200).json(bills);
  } catch (error) {
    console.error('❌ Error fetching bills:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 3. Get One Bill by ID ---
// (This function is unchanged)
export const getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await getFullBillById(id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 4. Complete a Bill (Admin Only) ---
// (This function is unchanged)
export const completeBill = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const bill = await Bill.findByPk(id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    if (bill.status === 'Completed') {
      return res.status(400).json({ message: 'Bill is already completed' });
    }

    bill.status = 'Completed';
    await bill.save();

    // Create audit log
    await AuditLog.create({
      user_id: user_id,
      action_type: 'UPDATE',
      module: 'Bill',
      record_id: bill.bill_id,
      details: `Bill #${bill.bill_no} marked as 'Completed' by user_id ${user_id}.`,
    });

    res.status(200).json({
      message: 'Bill marked as completed and audit log created',
      bill,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 5. Delete a Bill (Staff & Admin) ---
// (This function is unchanged)
export const deleteBill = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const bill = await Bill.findByPk(id);

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    if (bill.status === 'Completed') {
      return res.status(400).json({
        message: 'Cannot delete a completed bill. It is locked.',
      });
    }
    
    const t = await sequelize.transaction();

    try {
      await BillItem.destroy({
        where: { bill_id: id },
        transaction: t,
      });

      await BillChallan.destroy({
        where: { bill_id: id },
        transaction: t,
      });

      await AuditLog.create(
        {
          user_id: user_id,
          action_type: 'DELETE',
          module: 'Bill',
          record_id: id,
          details: `Bill #${bill.bill_no} (Pending) was deleted by user_id ${user_id}.`,
        },
        { transaction: t }
      );

      await bill.destroy({ transaction: t });

      await t.commit();

      res.status(200).json({ message: 'Pending bill deleted successfully' });

    } catch (error) {
      await t.rollback();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// --- Helper Function (Unchanged) ---
const getFullBillById = async (id) => {
  return await Bill.findByPk(id, {
    include: [
      { model: User, attributes: ['full_name', 'username'] },
      { model: Vendor, attributes: ['vendor_name', 'gst_no'] },
      {
        model: BillItem, 
        include: [{ model: Item, attributes: ['item_name', 'size', 'color'] }],
      },
      {
        model: Challan, 
        attributes: ['challan_id', 'challan_no', 'delivery_date'],
        through: { attributes: [] },
      },
    ],
  });
};