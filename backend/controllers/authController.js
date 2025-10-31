const User = require('../models/User');
const authService = require('../services/authService');
const { catchAsync } = require('../utils/asyncHandler');
const { AuthenticationError, ValidationError } = require('../utils/errorHandler');
const { logger } = require('../utils/logger');

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;

  // Find user
  const user = await User.findByUsername(username);
  if (!user) {
    logger.warn('Login attempt with invalid username', { username, ip: req.ip });
    throw new AuthenticationError('Invalid credentials');
  }

  // Check if user is active
  if (!user.isActive) {
    logger.warn('Login attempt with deactivated account', { username, ip: req.ip });
    throw new AuthenticationError('Account is deactivated');
  }

  // Verify password
  const isValidPassword = await User.verifyPassword(password, user.password);
  if (!isValidPassword) {
    logger.warn('Login attempt with invalid password', { username, ip: req.ip });
    throw new AuthenticationError('Invalid credentials');
  }

  // Generate token pair
  const tokens = authService.generateTokenPair(user._id.toString(), user.role);

  // Return user data (exclude password)
  const { password: _, ...userData } = user;

  logger.info('User logged in successfully', {
    userId: user._id.toString(),
    username: user.username,
    role: user.role,
    ip: req.ip
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: userData,
      ...tokens
    }
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ValidationError('Refresh token is required');
  }

  const newTokens = authService.refreshAccessToken(refreshToken);

  logger.info('Token refreshed successfully', {
    ip: req.ip
  });

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: newTokens
  });
});

const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    try {
      const decoded = authService.verifyRefreshToken(refreshToken);
      authService.revokeRefreshToken(decoded.tokenId);
    } catch (error) {
      // Ignore errors when revoking refresh token
    }
  }

  logger.info('User logged out', {
    userId: req.user?.userId,
    ip: req.ip
  });

  res.json({
    success: true,
    message: 'Logout successful'
  });
});

const verifyToken = catchAsync(async (req, res) => {
  res.json({
    success: true,
    data: {
      valid: true,
      user: req.user
    }
  });
});

const revokeAllTokens = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const revokedCount = authService.revokeAllUserTokens(userId);

  logger.info('All user tokens revoked', {
    userId,
    revokedCount,
    ip: req.ip
  });

  res.json({
    success: true,
    message: `Revoked ${revokedCount} tokens successfully`
  });
});

module.exports = {
  login,
  refreshToken,
  logout,
  verifyToken,
  revokeAllTokens
};