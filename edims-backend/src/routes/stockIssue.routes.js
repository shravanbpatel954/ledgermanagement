import { Router } from 'express';
import {
  createStockIssue,
  getAllStockIssues,
} from '../controllers/stockIssue.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// --- Define Stock Issue Routes ---
// Both routes are protected for all logged-in users

// Create a new Stock Issue: POST /api/stock-issues
router.post('/', protect, createStockIssue);

// Get all Stock Issues: GET /api/stock-issues
router.get('/', protect, getAllStockIssues);

export default router;