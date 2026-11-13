import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { LoginSchema, ForgotPasswordSchema, ResetPasswordSchema } from '@silwasa/validation';
import { env } from '../config/env.js';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = LoginSchema.parse(req.body);
      const result = await authService.login({
        email: validated.email,
        password: validated.password,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      });

      // Set secure HTTP-only cookie
      res.cookie('silwasa_token', result.token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        signed: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.user?.token || req.signedCookies?.silwasa_token || req.cookies?.silwasa_token;
      if (token) {
        await authService.logout(token, req.user?.id, req.user?.name);
      }

      res.clearCookie('silwasa_token', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        signed: true,
      });

      res.status(200).json({
        success: true,
        message: 'Successfully logged out',
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const user = await authService.getCurrentUser(req.user.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = ForgotPasswordSchema.parse(req.body);
      await authService.requestPasswordReset(validated.email);
      res.status(200).json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been sent.',
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = ResetPasswordSchema.parse(req.body);
      await authService.resetPassword(validated.token, validated.password);
      res.status(200).json({
        success: true,
        message: 'Password reset successful. You can now log in with your new password.',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
