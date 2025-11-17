// Change all these imports:
// import sequelize from '../config/db.js';
// import PurchaseOrder from '../models/purchaseOrder.model.js';
// import PurchaseOrderItem from '../models/purchaseOrderItem.model.js';
// import Vendor from '../models/vendor.model.js';
// import User from '../models/user.model.js';
// import Item from '../models/item.model.js';
//
// To this:
import { sequelize, PurchaseOrder, PurchaseOrderItem, Vendor, User, Item } from '../models/index.js';


// --- 1. Create a new Purchase Order (Admin & Staff) ---
export const createPurchaseOrder = async (req, res) => {
  // We start a new transaction
  const t = await sequelize.transaction();
  let po_id; // Define po_id here to access it in both try/catch

  try {
    const { purchase_no, vendor_id, order_date, remarks, items } = req.body;
    const user_id = req.user.id; 

    // --- Validation ---
    if (!purchase_no || !vendor_id || !order_date || !items) {
      throw new Error('Missing required fields');
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Items must be a non-empty array');
    }

    // --- Step 1: Create the PO Header ---
    const newPurchaseOrder = await PurchaseOrder.create(
      {
        purchase_no,
        vendor_id,
        user_id,
        order_date,
        remarks,
        status: 'Pending Delivery',
      },
      { transaction: t } // Pass the transaction
    );

    po_id = newPurchaseOrder.po_id; // Store the ID

    // --- Step 2: Prepare the PO Line Items ---
    const poItems = items.map((item) => {
      if (!item.item_id || !item.quantity_ordered) {
        throw new Error('Each item must have an item_id and quantity_ordered');
      }
      return {
        po_id: po_id,
        item_id: item.item_id,
        quantity_ordered: item.quantity_ordered,
        quantity_received: 0,
      };
    });

    // --- Step 3: Bulk Create the Line Items ---
    await PurchaseOrderItem.bulkCreate(poItems, { transaction: t });

    // --- Step 4: If all good, commit the transaction ---
    await t.commit();

    // --- Step 5: (FIXED) Fetch response *after* committing ---
    // This will now work because the models know their associations
    try {
      const fullNewPO = await getFullPOById(po_id);
      res.status(201).json(fullNewPO); // <-- This is our goal
    } catch (fetchError) {
      console.error('Error fetching newly created PO:', fetchError);
      res.status(201).json({
        message: 'Purchase Order created successfully, but failed to fetch full details.',
        po_id: po_id,
      });
    }

  } catch (error) { // This catch block now *only* handles transaction errors
    // --- Step 6: If anything failed *before* commit, rollback ---
    // We must check if the transaction is still active before rolling back
    if (t.finished !== 'commit' && t.finished !== 'rollback') {
        await t.rollback();
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Purchase Order number already exists' });
    }
    // Return the specific validation error
    if (error.message.includes('Missing required fields') || error.message.includes('Items must be')) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Server error during transaction', error: error.message });
  }
};

// --- 2. Get All Purchase Orders (Admin & Staff) ---
export const getAllPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.findAll({
      order: [['order_date', 'DESC']],
      include: [
        { model: User, attributes: ['full_name'] }, 
        { model: Vendor, attributes: ['vendor_name'] },
      ],
    });
    res.status(200).json(purchaseOrders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 3. Get a Single PO by ID (Admin & Staff) ---
export const getPurchaseOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseOrder = await getFullPOById(id);

    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }
    res.status(200).json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Helper function to get a full PO with all details ---
const getFullPOById = async (id) => {
  return await PurchaseOrder.findByPk(id, {
    include: [
      { model: User, attributes: ['full_name', 'username'] },
      { model: Vendor },
      {
        model: PurchaseOrderItem,
        include: [{ model: Item }], 
      },
    ],
  });
};