import { Department } from '../models/index.js';

// --- 1. Create a new Department (Admin Only) ---
export const createDepartment = async (req, res) => {
  // Accept dept_id but ignore it (auto-increment)
  const { dept_name, dept_id } = req.body;
  
  if (!dept_name) {
    return res.status(400).json({ message: 'Department name is required' });
  }

  try {
    const newDepartment = await Department.create({ dept_name });
    
    // Return with dept_id (auto-generated)
    res.status(201).json({
      dept_id: newDepartment.dept_id,
      dept_name: newDepartment.dept_name
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Department name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 2. Get All Departments (Admin & Staff) ---
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      order: [['dept_id', 'ASC']],
    });
    
    // Return with proper field names
    const mappedDepartments = departments.map(dept => ({
      dept_id: dept.dept_id,
      dept_name: dept.dept_name
    }));
    
    res.status(200).json(mappedDepartments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 3. Get One Department by ID (Admin & Staff) ---
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 4. Update a Department (Admin Only) ---
export const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { dept_name } = req.body;

  try {
    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    department.dept_name = dept_name || department.dept_name;
    await department.save();
    res.status(200).json(department);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Department name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- 5. Delete a Department (Admin Only) ---
export const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    // TODO: Add check - don't delete if linked to a StockIssue
    // We'll add this later.
    
    await department.destroy();
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};