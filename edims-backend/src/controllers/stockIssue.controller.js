import { sequelize, Item, StockIssue, Department, User } from '../models/index.js';

// --- 1. Create a new Stock Issue (Admin & Staff) ---
export const createStockIssue = async (req, res) => {
  const { item_id, quantity_issued, dept_id, purpose, issue_date } = req.body;
  const user_id = req.user.id; // From our 'protect' middleware

  // --- Validation ---
  if (!item_id || !quantity_issued || !dept_id || !purpose || !issue_date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (parseInt(quantity_issued, 10) <= 0) {
    return res.status(400).json({ message: 'Quantity must be greater than 0' });
  }

  const t = await sequelize.transaction();

  try {
    // --- Step 1: Find the item and lock it for this transaction ---
    // This prevents two people from issuing the same stock at the same time
    const item = await Item.findByPk(item_id, { transaction: t, lock: true });

    if (!item) {
      await t.rollback();
      return res.status(404).json({ message: 'Item not found' });
    }

    // --- Step 2: Check for sufficient stock ---
    if (item.current_stock < quantity_issued) {
      await t.rollback();
      return res.status(400).json({
        message: `Not enough stock. Only ${item.current_stock} available.`,
      });
    }

    // --- Step 3: Create the StockIssue record ---
    const newStockIssue = await StockIssue.create(
      {
        item_id,
        quantity_issued,
        dept_id,
        purpose,
        issue_date,
        user_id,
      },
      { transaction: t }
    );

    // --- Step 4: Decrement the stock in the master Item table ---
    item.current_stock -= parseInt(quantity_issued, 10);
    await item.save({ transaction: t });

    // --- Step 5: Commit the transaction ---
    await t.commit();

    res.status(201).json({
      message: 'Stock issued successfully and inventory updated',
      newStockIssue,
    });
  } catch (error) {
    // If anything fails, roll back
    await t.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 2. Get All Stock Issues (Admin & Staff) ---
export const getAllStockIssues = async (req, res) => {
  try {
    const issues = await StockIssue.findAll({
      order: [['issue_date', 'DESC']],
      include: [
        { model: Item, attributes: ['item_name', 'size', 'color'], required: false },
        { model: Department, attributes: ['dept_name'], required: false },
        { model: User, attributes: ['full_name'], required: false },
      ],
    });
    res.status(200).json(issues);
  } catch (error) {
    console.error('❌ Error fetching stock issues:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};