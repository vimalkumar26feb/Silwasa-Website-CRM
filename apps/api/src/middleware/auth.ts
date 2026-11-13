import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { userRepository } from '../repositories/user.repository.js';
import { UserRole } from '@silwasa/types';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  token: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined;

    // 1. Check signed or unsigned cookies
    if (req.signedCookies && req.signedCookies.silwasa_token) {
      token = req.signedCookies.silwasa_token;
    } else if (req.cookies && req.cookies.silwasa_token) {
      token = req.cookies.silwasa_token;
    }

    // 2. Check Authorization Bearer header
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in.',
      });
      return;
    }

    // Verify JWT signature and expiration
    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please sign in again.',
      });
      return;
    }

    // Check active session in DB
    const session = await userRepository.findSession(token);
    if (!session || new Date(session.expiresAt) < new Date()) {
      res.status(401).json({
        success: false,
        message: 'Session has expired or was revoked. Please sign in again.',
      });
      return;
    }

    if (!session.user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please contact an administrator.',
      });
      return;
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as UserRole,
      token,
    };

    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: This resource requires one of [${allowedRoles.join(', ')}] permissions.`,
      });
      return;
    }

    next();
  };
}
