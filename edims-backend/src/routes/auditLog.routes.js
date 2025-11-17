import { Router } from 'express';
import { getAllAuditLogs } from '../controllers/auditLog.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// --- Define Audit Log Routes ---
// Must be protected by Admin and require a token
router.get('/', protect, isAdmin, getAllAuditLogs);

export default router;