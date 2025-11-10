const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById
} = require('../controllers/employeeController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// All employee routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// GET /api/employees - Get all employees
router.get('/', getAllEmployees);

// POST /api/employees - Create new employee
router.post('/', createEmployee);

// GET /api/employees/:id - Get employee by ID
router.get('/:id', getEmployeeById);

// PUT /api/employees/:id - Update employee
router.put('/:id', updateEmployee);

// DELETE /api/employees/:id - Delete employee (soft delete)
router.delete('/:id', deleteEmployee);

module.exports = router;