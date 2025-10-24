const express = require('express');
const router = express.Router();
const {
  processPayroll,
  getPayrollSummary,
  getEmployeePayroll
} = require('../controllers/payrollController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// All payroll routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// POST /api/payroll/process - Process payroll for all employees
router.post('/process', processPayroll);

// GET /api/payroll/summary - Get payroll summary
router.get('/summary', getPayrollSummary);

// GET /api/payroll/employee/:id - Get employee payroll details
router.get('/employee/:id', getEmployeePayroll);

module.exports = router;