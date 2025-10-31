const express = require('express');
const router = express.Router();
const {
  requestPasswordReset,
  resetPassword,
  changePassword,
  verifyResetToken
} = require('../controllers/passwordResetController');
const authService = require('../services/authService');
const { body } = require('express-validator');

// Validation middleware
const validateEmail = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
];

const validatePasswordReset = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
];

const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
];

// Public routes
router.post('/request', validateEmail, requestPasswordReset);
router.post('/reset', validatePasswordReset, resetPassword);
router.get('/verify/:token', verifyResetToken);

// Protected routes (require authentication)
router.post('/change', authService.authenticate, validatePasswordChange, changePassword);

module.exports = router;
