const express = require('express');
const router = express.Router();
const { 
  login, 
  refreshToken, 
  logout, 
  verifyToken, 
  revokeAllTokens 
} = require('../controllers/authController');
const authService = require('../services/authService');
const { validateLogin } = require('../middleware/validation');

// Public routes
router.post('/login', validateLogin, login);
router.post('/refresh', refreshToken);

// Protected routes
router.post('/logout', authService.authenticate, logout);
router.get('/verify', authService.authenticate, verifyToken);
router.post('/revoke-all', authService.authenticate, revokeAllTokens);

module.exports = router;