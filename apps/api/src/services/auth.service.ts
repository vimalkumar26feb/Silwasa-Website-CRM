import { userRepository } from '../repositories/user.repository.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { generateToken, verifyToken } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';
import { UserRole } from '@silwasa/types';

export class AuthService {
  async login(params: {
    email: string;
    password: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const user = await userRepository.findByEmail(params.email);
    if (!user) {
      const err: AppError = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    if (!user.isActive) {
      const err: AppError = new Error('Your account has been deactivated. Please contact an administrator.');
      err.statusCode = 403;
      throw err;
    }

    const isMatch = await verifyPassword(user.passwordHash, params.password);
    if (!isMatch) {
      const err: AppError = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    await userRepository.createSession(user.id, token, expiresAt);

    await userRepository.logActivity({
      userId: user.id,
      userName: user.name,
      action: 'LOGIN',
      module: 'AUTH',
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });

    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return {
      user: userProfile,
      token,
      expiresAt: expiresAt.toISOString(),
    };
  }

  async logout(token: string, userId?: string, userName?: string) {
    if (token) {
      await userRepository.deleteSession(token);
    }
    if (userId && userName) {
      await userRepository.logActivity({
        userId,
        userName,
        action: 'LOGOUT',
        module: 'AUTH',
      });
    }
  }

  async getCurrentUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user || !user.isActive) {
      const err: AppError = new Error('User not found or inactive');
      err.statusCode = 401;
      throw err;
    }
    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async requestPasswordReset(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Return true to avoid user enumeration attacks
      return true;
    }

    const resetToken = generateToken(
      {
        userId: user.id,
        email: user.email,
        role: user.role as UserRole,
      },
      '1h'
    );

    // In a real email setup this sends an email with the link
    return { resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
      const err: AppError = new Error('Invalid or expired reset token');
      err.statusCode = 400;
      throw err;
    }

    const passwordHash = await hashPassword(newPassword);
    await userRepository.update(payload.userId, { passwordHash });

    // Invalidate all existing sessions on password change
    await userRepository.deleteAllUserSessions(payload.userId);

    return true;
  }
}

export const authService = new AuthService();
