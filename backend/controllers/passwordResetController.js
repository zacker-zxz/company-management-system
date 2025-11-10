const passwordResetService = require('../services/passwordResetService');
const { catchAsync } = require('../utils/asyncHandler');
const { ValidationError, NotFoundError } = require('../utils/errorHandler');
const { logger } = require('../utils/logger');

const requestPasswordReset = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ValidationError('Email is required');
  }

  try {
    await passwordResetService.sendPasswordResetEmail(email);
    
    logger.info('Password reset requested', {
      email,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  } catch (error) {
    logger.error('Password reset request failed', {
      email,
      error: error.message,
      ip: req.ip
    });
    
    // Still return success to prevent email enumeration
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  }
});

const resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token) {
    throw new ValidationError('Reset token is required');
  }

  if (!newPassword) {
    throw new ValidationError('New password is required');
  }

  // Validate password strength
  if (newPassword.length < 8) {
    throw new ValidationError('Password must be at least 8 characters long');
  }

  if (!/(?=.*[a-z])/.test(newPassword)) {
    throw new ValidationError('Password must contain at least one lowercase letter');
  }

  if (!/(?=.*[A-Z])/.test(newPassword)) {
    throw new ValidationError('Password must contain at least one uppercase letter');
  }

  if (!/(?=.*\d)/.test(newPassword)) {
    throw new ValidationError('Password must contain at least one number');
  }

  if (!/(?=.*[@$!%*?&])/.test(newPassword)) {
    throw new ValidationError('Password must contain at least one special character');
  }

  await passwordResetService.resetPassword(token, newPassword);

  logger.info('Password reset completed', {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    message: 'Password has been reset successfully. You can now log in with your new password.'
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.userId;

  if (!currentPassword) {
    throw new ValidationError('Current password is required');
  }

  if (!newPassword) {
    throw new ValidationError('New password is required');
  }

  // Validate password strength
  if (newPassword.length < 8) {
    throw new ValidationError('Password must be at least 8 characters long');
  }

  if (!/(?=.*[a-z])/.test(newPassword)) {
    throw new ValidationError('Password must contain at least one lowercase letter');
  }

  if (!/(?=.*[A-Z])/.test(newPassword)) {
    throw new ValidationError('Password must contain at least one uppercase letter');
  }

  if (!/(?=.*\d)/.test(newPassword)) {
    throw new ValidationError('Password must contain at least one number');
  }

  if (!/(?=.*[@$!%*?&])/.test(newPassword)) {
    throw new ValidationError('Password must contain at least one special character');
  }

  // Get user and verify current password
  const User = require('../models/User');
  const user = await User.findById(userId);
  
  if (!user) {
    throw new NotFoundError('User');
  }

  const isCurrentPasswordValid = await User.verifyPassword(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    throw new ValidationError('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.hashPassword();
  await User.updateById(userId, { password: user.password });

  // Send notification email
  try {
    await passwordResetService.sendPasswordChangeNotification(user.email, user.name);
  } catch (error) {
    logger.warn('Failed to send password change notification', {
      userId,
      error: error.message
    });
  }

  logger.info('Password changed successfully', {
    userId,
    email: user.email,
    ip: req.ip
  });

  res.json({
    success: true,
    message: 'Password has been changed successfully.'
  });
});

const verifyResetToken = catchAsync(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new ValidationError('Reset token is required');
  }

  const { valid } = passwordResetService.verifyResetToken(token);

  if (!valid) {
    throw new ValidationError('Invalid or expired reset token');
  }

  res.json({
    success: true,
    message: 'Reset token is valid'
  });
});

module.exports = {
  requestPasswordReset,
  resetPassword,
  changePassword,
  verifyResetToken
};

