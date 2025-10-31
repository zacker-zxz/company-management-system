const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById
} = require('../controllers/employeeController');
const authService = require('../services/authService');
const {
  validateCreateEmployee,
  validateUpdateEmployee,
  validateEmployeeId,
  validatePagination
} = require('../middleware/validation');

// All employee routes require authentication and admin role
router.use(authService.authenticate);
router.use(authService.authorize('admin'));

// GET /api/employees - Get all employees with pagination
router.get('/', validatePagination, getAllEmployees);

// POST /api/employees - Create new employee
router.post('/', validateCreateEmployee, createEmployee);

// GET /api/employees/:id - Get employee by ID
router.get('/:id', validateEmployeeId, getEmployeeById);

// PUT /api/employees/:id - Update employee
router.put('/:id', validateUpdateEmployee, updateEmployee);

// DELETE /api/employees/:id - Delete employee (soft delete)
router.delete('/:id', validateEmployeeId, deleteEmployee);

module.exports = router;