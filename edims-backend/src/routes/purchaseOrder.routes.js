// src/routes/purchaseOrder.routes.js
import { Router } from 'express';
import {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
} from '../controllers/purchaseOrder.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// --- Define Purchase Order Routes ---
// All routes are protected and require a login

// Create a new PO: POST /api/purchase-orders
router.post('/', protect, createPurchaseOrder);

// Get all POs: GET /api/purchase-orders
router.get('/', protect, getAllPurchaseOrders);

// Get one PO by ID: GET /api/purchase-orders/:id
router.get('/:id', protect, getPurchaseOrderById);

export default router;