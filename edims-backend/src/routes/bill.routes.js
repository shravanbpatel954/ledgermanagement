import { Router } from 'express';
import {
  createBill,
  getAllBills,
  getBillById,
  completeBill,
  deleteBill, // <-- 1. IMPORT THE NEW FUNCTION
} from '../controllers/bill.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// --- Define Bill Routes ---

// Create: POST /api/bills (Staff & Admin)
router.post('/', protect, createBill);

// Read All: GET /api/bills (Staff & Admin)
router.get('/', protect, getAllBills);

// Read One: GET /api/bills/:id (Staff & Admin)
router.get('/:id', protect, getBillById);

// Update (Complete): PUT /api/bills/:id/complete (Admin Only)
router.put('/:id/complete', protect, isAdmin, completeBill);

// Delete: DELETE /api/bills/:id (Staff & Admin - only if pending)
router.delete('/:id', protect, deleteBill); // <-- 2. ADD THE NEW ROUTE

export default router;