// src/routes/vendor.routes.js
import { Router } from 'express';
import {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
} from '../controllers/vendor.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// --- Define Vendor Routes ---
// Note: Auth middleware removed for development. Add back in production.

// Create Vendor: POST /api/vendors
router.post('/', createVendor);

// Get All Vendors: GET /api/vendors
router.get('/', getAllVendors);

// Get One Vendor: GET /api/vendors/:id
// Both Staff and Admin can get a single vendor.
router.get('/:id', protect, getVendorById);

// Update Vendor: PUT /api/vendors/:id
// Only an Admin can update a vendor.
router.put('/:id', protect, isAdmin, updateVendor);

// Delete Vendor: DELETE /api/vendors/:id
// Only an Admin can delete a vendor.
router.delete('/:id', protect, isAdmin, deleteVendor);

export default router;