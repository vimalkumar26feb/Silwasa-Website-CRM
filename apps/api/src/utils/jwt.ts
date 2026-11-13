import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UserRole } from '@silwasa/types';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  sessionId?: string;
}

export function generateToken(payload: JwtPayload, expiresIn = env.JWT_EXPIRES_IN): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
