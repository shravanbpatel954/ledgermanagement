// src/routes/department.routes.js
import { Router } from 'express';
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from '../controllers/department.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// --- Define Department Routes ---
// Note: Auth middleware removed for development. Add back in production.

// Create Department: POST /api/departments
router.post('/', createDepartment);

// Get All Departments: GET /api/departments
router.get('/', getAllDepartments);

// Get One Department: GET /api/departments/:id
router.get('/:id', protect, getDepartmentById);

// Update Department: PUT /api/departments/:id
router.put('/:id', protect, isAdmin, updateDepartment);

// Delete Department: DELETE /api/departments/:id
router.delete('/:id', protect, isAdmin, deleteDepartment);

export default router;