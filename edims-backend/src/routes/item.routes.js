// src/routes/item.routes.js
import { Router } from 'express';
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} from '../controllers/item.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// --- Define Item Routes ---
// Note: Auth middleware removed for development. Add back in production.

// Create Item: POST /api/items
router.post('/', createItem);

// Get All Items: GET /api/items
router.get('/', getAllItems);

// Get One Item: GET /api/items/:id
router.get('/:id', protect, getItemById);

// Update Item: PUT /api/items/:id
router.put('/:id', protect, isAdmin, updateItem);

// Delete Item: DELETE /api/items/:id
router.delete('/:id', protect, isAdmin, deleteItem);

export default router;