import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';
import { CreateUserSchema, UpdateUserSchema } from '@silwasa/validation';
import { UserRole } from '@silwasa/types';

export class UserController {
  async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const role = req.query.role as UserRole | undefined;
      const search = req.query.search as string | undefined;

      const result = await userService.listUsers({ page, limit, role, search });

      res.status(200).json({
        success: true,
        data: result.users,
        meta: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = CreateUserSchema.parse(req.body);
      const user = await userService.createUser({
        ...validated,
        createdById: req.user!.id,
        createdByName: req.user!.name,
      });

      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = UpdateUserSchema.parse(req.body);
      const user = await userService.updateUser(
        req.params.id,
        validated,
        req.user!.id,
        req.user!.name
      );

      res.status(200).json({
        success: true,
        data: user,
        message: 'User updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.deleteUser(
        req.params.id,
        req.user!.id,
        req.user!.name
      );

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
