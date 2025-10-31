const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { logger } = require('../utils/logger');
const { NotFoundError, ValidationError } = require('../utils/errorHandler');

class PasswordResetService {
  constructor() {
    this.resetTokens = new Map(); // In production, use Redis
    this.tokenExpiry = 15 * 60 * 1000; // 15 minutes
    
    // Email transporter configuration
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Generate password reset token
  generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Hash reset token
  hashResetToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Store reset token
  storeResetToken(userId, token) {
    const hashedToken = this.hashResetToken(token);
    const expiresAt = new Date(Date.now() + this.tokenExpiry);

    this.resetTokens.set(hashedToken, {
      userId,
      expiresAt,
      createdAt: new Date()
    });

    console.log('Password reset token generated', {
      userId,
      expiresAt
    });
  }

  // Verify reset token
  verifyResetToken(token) {
    const hashedToken = this.hashResetToken(token);
    const tokenData = this.resetTokens.get(hashedToken);

    if (!tokenData) {
      return { userId: '', valid: false };
    }

    if (new Date() > tokenData.expiresAt) {
      this.resetTokens.delete(hashedToken);
      return { userId: '', valid: false };
    }

    return { userId: tokenData.userId, valid: true };
  }

  // Remove reset token
  removeResetToken(token) {
    const hashedToken = this.hashResetToken(token);
    this.resetTokens.delete(hashedToken);
  }

  // Send password reset email
  async sendPasswordResetEmail(email) {
    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not
      logger.warn('Password reset requested for non-existent email', { email });
      return;
    }

    const resetToken = this.generateResetToken();
    this.storeResetToken(user._id.toString(), resetToken);

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'Zacker Management System',
        address: process.env.FROM_EMAIL || 'noreply@zacker.com'
      },
      to: email,
      subject: 'Password Reset Request - Zacker Management System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Zacker Management System</h1>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1e293b; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="color: #64748b; line-height: 1.6;">
              Hello ${user.name},
            </p>
            
            <p style="color: #64748b; line-height: 1.6;">
              We received a request to reset your password for your Zacker Management System account. 
              If you made this request, click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; 
                        border-radius: 6px; display: inline-block; font-weight: 600;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #64748b; line-height: 1.6; font-size: 14px;">
              Or copy and paste this link into your browser:
            </p>
            <p style="color: #3b82f6; word-break: break-all; font-size: 14px;">
              ${resetUrl}
            </p>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong>Important:</strong> This link will expire in 15 minutes for security reasons.
              </p>
            </div>
            
            <p style="color: #64748b; line-height: 1.6;">
              If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
            </p>
            
            <p style="color: #64748b; line-height: 1.6;">
              Best regards,<br>
              The Zacker Team
            </p>
          </div>
          
          <div style="background: #1e293b; padding: 20px; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
              © 2024 Zacker Management System. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent', {
        userId: user._id.toString(),
        email: user.email
      });
    } catch (error) {
      console.error('Failed to send password reset email', {
        userId: user._id.toString(),
        email: user.email,
        error: error.message
      });
      throw new Error('Failed to send password reset email');
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    const { userId, valid } = this.verifyResetToken(token);
    
    if (!valid) {
      throw new ValidationError('Invalid or expired reset token');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    // Update password
    user.password = newPassword;
    await user.hashPassword();
    await User.updateById(userId, { password: user.password });

    // Remove used token
    this.removeResetToken(token);

    logger.info('Password reset successfully', {
      userId: user._id.toString(),
      email: user.email
    });
  }

  // Clean expired tokens
  cleanExpiredTokens() {
    const now = new Date();
    let cleanedCount = 0;

    for (const [token, tokenData] of this.resetTokens.entries()) {
      if (now > tokenData.expiresAt) {
        this.resetTokens.delete(token);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.info('Expired password reset tokens cleaned', { cleanedCount });
    }

    return cleanedCount;
  }

  // Send password change notification
  async sendPasswordChangeNotification(email, userName) {
    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'Zacker Management System',
        address: process.env.FROM_EMAIL || 'noreply@zacker.com'
      },
      to: email,
      subject: 'Password Changed - Zacker Management System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Zacker Management System</h1>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1e293b; margin-bottom: 20px;">Password Successfully Changed</h2>
            
            <p style="color: #64748b; line-height: 1.6;">
              Hello ${userName},
            </p>
            
            <p style="color: #64748b; line-height: 1.6;">
              Your password has been successfully changed for your Zacker Management System account.
            </p>
            
            <div style="background: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #065f46; margin: 0; font-size: 14px;">
                <strong>Security Notice:</strong> If you didn't make this change, please contact our support team immediately.
              </p>
            </div>
            
            <p style="color: #64748b; line-height: 1.6;">
              For your security, we recommend:
            </p>
            <ul style="color: #64748b; line-height: 1.6;">
              <li>Using a strong, unique password</li>
              <li>Not sharing your password with anyone</li>
              <li>Logging out from shared devices</li>
            </ul>
            
            <p style="color: #64748b; line-height: 1.6;">
              Best regards,<br>
              The Zacker Team
            </p>
          </div>
          
          <div style="background: #1e293b; padding: 20px; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
              © 2024 Zacker Management System. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info('Password change notification sent', { email });
    } catch (error) {
      logger.error('Failed to send password change notification', {
        email,
        error: error.message
      });
      // Don't throw error for notification failures
    }
  }
}

// Create singleton instance
const passwordResetService = new PasswordResetService();

// Clean expired tokens every 5 minutes
setInterval(() => {
  passwordResetService.cleanExpiredTokens();
}, 5 * 60 * 1000);

module.exports = passwordResetService;
