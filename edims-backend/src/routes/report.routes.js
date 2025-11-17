import { Router } from 'express';
import {
  getStockReport,
  getItemLedger,
  getVendorLedger, 
  getBillSummary, 
} from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// This is a cleaner way to protect all routes in this file
router.use(protect);

// --- Stock Reports ---
router.get('/stock', getStockReport);
router.get('/item-ledger/:id', getItemLedger);

// --- Bill & Vendor Reports ---
router.get('/bill-summary', getBillSummary); 
router.get('/vendor-ledger/:id', getVendorLedger); 
export default router;