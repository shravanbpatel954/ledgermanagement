import { Item } from '../models/index.js';

// --- 1. Create a new Item (Admin Only) ---
export const createItem = async (req, res) => {
  try {
    // Accept both item_number (from frontend) and item_id (from backend)
    // item_number is ignored since item_id is auto-increment
    const { item_name, size, color, item_number } = req.body;

    console.log('Received item data:', { item_name, size, color, item_number });

    if (!item_name || !item_name.trim()) {
      return res.status(400).json({ message: 'Item name is required' });
    }

    const newItem = await Item.create({
      item_name: item_name.trim(),
      size: size?.trim() || null,
      color: color?.trim() || null,
      // current_stock defaults to 0
    });
    
    console.log('Item created successfully:', newItem.item_id);
    
    // Return with item_id mapped as item_number for frontend compatibility
    res.status(201).json({
      item_number: newItem.item_id,
      item_id: newItem.item_id,
      item_name: newItem.item_name,
      size: newItem.size,
      color: newItem.color,
      current_stock: newItem.current_stock
    });
  } catch (error) {
    console.error('Error creating item:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400)
        .json({ message: 'Item with this name, size, and color already exists' });
    }
    
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(e => e.message).join(', ');
      return res.status(400).json({ message: `Validation error: ${errors}` });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// --- 2. Get All Items (Admin & Staff) ---
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      order: [['item_id', 'ASC']],
    });
    
    // Map item_id to item_number for frontend compatibility
    const mappedItems = items.map(item => ({
      item_number: item.item_id,
      item_id: item.item_id,
      item_name: item.item_name,
      size: item.size,
      color: item.color,
      current_stock: item.current_stock
    }));
    
    res.status(200).json(mappedItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 3. Get One Item by ID (Admin & Staff) ---
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 4. Update an Item (Admin Only) ---
export const updateItem = async (req, res) => {
  const { id } = req.params;
  const { item_name, size, color } = req.body;

  try {
    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.item_name = item_name || item.item_name;
    item.size = size || item.size;
    item.color = color || item.color;

    await item.save();
    res.status(200).json(item);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400)
        .json({ message: 'Item with this name, size, and color already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 5. Delete an Item (Admin Only) ---
export const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // TODO: Add check - don't allow delete if item is in stock
    // or linked to a PO. We'll add this later.
    if (item.current_stock > 0) {
      return res.status(400)
        .json({ message: 'Cannot delete item with stock > 0' });
    }

    await item.destroy();
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};