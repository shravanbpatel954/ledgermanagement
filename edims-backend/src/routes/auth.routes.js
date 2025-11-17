// src/routes/auth.routes.js
import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, getAllUsers } from '../controllers/auth.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', resetPassword);

// GET /api/auth/users (Admin Only)
router.get('/users', protect, isAdmin, getAllUsers);

export default router;