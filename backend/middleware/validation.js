const { body, param, query, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');

// Custom validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors for consistent response
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      details: formattedErrors,
      timestamp: new Date().toISOString()
    });
  };
};

// Custom validators
const isValidObjectId = (value) => {
  if (!ObjectId.isValid(value)) {
    throw new Error('Invalid ID format');
  }
  return true;
};

const isValidEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw new Error('Invalid email format');
  }
  return true;
};

const isValidPassword = (value) => {
  if (value.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  if (!/(?=.*[a-z])/.test(value)) {
    throw new Error('Password must contain at least one lowercase letter');
  }
  if (!/(?=.*[A-Z])/.test(value)) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  if (!/(?=.*\d)/.test(value)) {
    throw new Error('Password must contain at least one number');
  }
  if (!/(?=.*[@$!%*?&])/.test(value)) {
    throw new Error('Password must contain at least one special character');
  }
  return true;
};

const isValidSalary = (value) => {
  const salary = parseFloat(value);
  if (isNaN(salary) || salary < 0) {
    throw new Error('Salary must be a positive number');
  }
  if (salary > 1000000) {
    throw new Error('Salary cannot exceed $1,000,000');
  }
  return true;
};

const isValidPriority = (value) => {
  const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
  if (!validPriorities.includes(value)) {
    throw new Error('Priority must be one of: Low, Medium, High, Critical');
  }
  return true;
};

const isValidStatus = (value) => {
  const validStatuses = ['Pending', 'In Progress', 'Completed'];
  if (!validStatuses.includes(value)) {
    throw new Error('Status must be one of: Pending, In Progress, Completed');
  }
  return true;
};

const isValidRole = (value) => {
  const validRoles = ['admin', 'employee'];
  if (!validRoles.includes(value)) {
    throw new Error('Role must be either admin or employee');
  }
  return true;
};

const isValidDepartment = (value) => {
  const validDepartments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];
  if (!validDepartments.includes(value)) {
    throw new Error('Department must be one of: Engineering, Sales, Marketing, HR, Finance, Operations');
  }
  return true;
};

// Validation rules for different endpoints

// Auth validation
const validateLogin = validate([
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1 })
    .withMessage('Password cannot be empty')
]);

// Employee validation
const validateCreateEmployee = validate([
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required')
    .custom(isValidDepartment),
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must be between 2 and 100 characters'),
  body('salary')
    .notEmpty()
    .withMessage('Salary is required')
    .custom(isValidSalary)
]);

const validateUpdateEmployee = validate([
  param('id').custom(isValidObjectId),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('department')
    .optional()
    .trim()
    .custom(isValidDepartment),
  body('position')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must be between 2 and 100 characters'),
  body('salary')
    .optional()
    .custom(isValidSalary),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive'])
    .withMessage('Status must be either Active or Inactive')
]);

const validateEmployeeId = validate([
  param('id').custom(isValidObjectId)
]);

// Task validation
const validateCreateTask = validate([
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('assignedTo')
    .notEmpty()
    .withMessage('Assigned user is required')
    .custom(isValidObjectId),
  body('priority')
    .optional()
    .custom(isValidPriority),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Invalid deadline format')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Deadline cannot be in the past');
      }
      return true;
    })
]);

const validateUpdateTask = validate([
  param('id').custom(isValidObjectId),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('assignedTo')
    .optional()
    .custom(isValidObjectId),
  body('priority')
    .optional()
    .custom(isValidPriority),
  body('status')
    .optional()
    .custom(isValidStatus),
  body('progress')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Invalid deadline format')
]);

const validateTaskId = validate([
  param('id').custom(isValidObjectId)
]);

// Payroll validation
const validatePayrollEmployee = validate([
  param('id').custom(isValidObjectId)
]);

// Query validation
const validatePagination = validate([
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['name', 'email', 'department', 'position', 'salary', 'createdAt'])
    .withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be either asc or desc')
]);

module.exports = {
  validate,
  validateLogin,
  validateCreateEmployee,
  validateUpdateEmployee,
  validateEmployeeId,
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
  validatePayrollEmployee,
  validatePagination,
  isValidObjectId,
  isValidEmail,
  isValidPassword,
  isValidSalary,
  isValidPriority,
  isValidStatus,
  isValidRole,
  isValidDepartment
};
