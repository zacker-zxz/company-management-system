const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { logger } = require('../utils/logger');
const { AuthenticationError, AuthorizationError } = require('../utils/errorHandler');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m'; // 15 minutes
    this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'; // 7 days
    this.refreshTokens = new Map(); // In production, use Redis
  }

  // Generate access token
  generateAccessToken(userId, role) {
    const payload = {
      userId,
      role,
      type: 'access'
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      issuer: 'zacker-api',
      audience: 'zacker-client'
    });
  }

  // Generate refresh token
  generateRefreshToken(userId) {
    const tokenId = crypto.randomUUID();
    const payload = {
      userId,
      tokenId,
      type: 'refresh'
    };

    const token = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.refreshTokenExpiresIn,
      issuer: 'zacker-api',
      audience: 'zacker-client'
    });

    // Store refresh token
    this.refreshTokens.set(tokenId, {
      userId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    return token;
  }

  // Generate token pair
  generateTokenPair(userId, role) {
    const accessToken = this.generateAccessToken(userId, role);
    const refreshToken = this.generateRefreshToken(userId);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.jwtExpiresIn
    };
  }

  // Verify access token
  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'zacker-api',
        audience: 'zacker-client'
      });

      if (decoded.type !== 'access') {
        throw new AuthenticationError('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new AuthenticationError('Invalid token');
      }
      throw error;
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'zacker-api',
        audience: 'zacker-client'
      });

      if (decoded.type !== 'refresh') {
        throw new AuthenticationError('Invalid refresh token type');
      }

      // Check if refresh token exists in storage
      const storedToken = this.refreshTokens.get(decoded.tokenId);
      if (!storedToken) {
        throw new AuthenticationError('Refresh token not found');
      }

      // Check if refresh token is expired
      if (new Date() > storedToken.expiresAt) {
        this.refreshTokens.delete(decoded.tokenId);
        throw new AuthenticationError('Refresh token has expired');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Refresh token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new AuthenticationError('Invalid refresh token');
      }
      throw error;
    }
  }

  // Refresh access token
  refreshAccessToken(refreshToken) {
    const decoded = this.verifyRefreshToken(refreshToken);
    
    // Generate new access token
    const newAccessToken = this.generateAccessToken(decoded.userId, decoded.role);
    
    logger.info('Token refreshed', {
      userId: decoded.userId,
      tokenId: decoded.tokenId
    });

    return {
      accessToken: newAccessToken,
      expiresIn: this.jwtExpiresIn
    };
  }

  // Revoke refresh token
  revokeRefreshToken(tokenId) {
    this.refreshTokens.delete(tokenId);
    logger.info('Refresh token revoked', { tokenId });
  }

  // Revoke all refresh tokens for user
  revokeAllUserTokens(userId) {
    let revokedCount = 0;
    for (const [tokenId, tokenData] of this.refreshTokens.entries()) {
      if (tokenData.userId === userId) {
        this.refreshTokens.delete(tokenId);
        revokedCount++;
      }
    }
    
    logger.info('All user tokens revoked', { userId, revokedCount });
    return revokedCount;
  }

  // Clean expired refresh tokens
  cleanExpiredTokens() {
    const now = new Date();
    let cleanedCount = 0;
    
    for (const [tokenId, tokenData] of this.refreshTokens.entries()) {
      if (now > tokenData.expiresAt) {
        this.refreshTokens.delete(tokenId);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      logger.info('Expired tokens cleaned', { cleanedCount });
    }
    
    return cleanedCount;
  }

  // Extract token from request
  extractTokenFromRequest(req) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }
    
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }

  // Authentication middleware
  authenticate = (req, res, next) => {
    try {
      const token = this.extractTokenFromRequest(req);
      const decoded = this.verifyAccessToken(token);
      
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };

  // Authorization middleware
  authorize = (...roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return next(new AuthenticationError('Authentication required'));
      }
      
      if (!roles.includes(req.user.role)) {
        logger.warn('Authorization failed', {
          userId: req.user.userId,
          userRole: req.user.role,
          requiredRoles: roles,
          url: req.url,
          method: req.method
        });
        
        return next(new AuthorizationError(`Access denied. Required roles: ${roles.join(', ')}`));
      }
      
      next();
    };
  };

  // Optional authentication middleware
  optionalAuth = (req, res, next) => {
    try {
      const token = this.extractTokenFromRequest(req);
      const decoded = this.verifyAccessToken(token);
      req.user = decoded;
    } catch (error) {
      // Token is optional, so we don't throw an error
      req.user = null;
    }
    next();
  };

  // Generate password reset token
  generatePasswordResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Generate email verification token
  generateEmailVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Hash password reset token
  hashPasswordResetToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Verify password reset token
  verifyPasswordResetToken(token, hashedToken) {
    const tokenHash = this.hashPasswordResetToken(token);
    return tokenHash === hashedToken;
  }
}

// Create singleton instance
const authService = new AuthService();

// Clean expired tokens every hour
setInterval(() => {
  authService.cleanExpiredTokens();
}, 60 * 60 * 1000);

module.exports = authService;
