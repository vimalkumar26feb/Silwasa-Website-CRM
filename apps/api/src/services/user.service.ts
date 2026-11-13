import { userRepository } from '../repositories/user.repository.js';
import { hashPassword } from '../utils/password.js';
import { AppError } from '../middleware/errorHandler.js';
import { UserRole } from '@silwasa/types';

export class UserService {
  async listUsers(params: {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
  }) {
    return userRepository.findAll(params);
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      const err: AppError = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    return user;
  }

  async createUser(data: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    avatarUrl?: string;
    createdById: string;
    createdByName: string;
  }) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      const err: AppError = new Error('A user with this email address already exists');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await hashPassword(data.password);
    const user = await userRepository.create({
      email: data.email,
      name: data.name,
      role: data.role,
      avatarUrl: data.avatarUrl,
      passwordHash,
    });

    await userRepository.logActivity({
      userId: data.createdById,
      userName: data.createdByName,
      action: 'CREATE_USER',
      module: 'USERS',
      entityId: user.id,
      details: { email: user.email, role: user.role },
    });

    return user;
  }

  async updateUser(
    id: string,
    data: {
      name?: string;
      email?: string;
      role?: UserRole;
      isActive?: boolean;
      password?: string;
      avatarUrl?: string;
    },
    updatedById: string,
    updatedByName: string
  ) {
    const user = await userRepository.findById(id);
    if (!user) {
      const err: AppError = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    const updatePayload: Record<string, unknown> = {
      name: data.name,
      email: data.email,
      role: data.role,
      isActive: data.isActive,
      avatarUrl: data.avatarUrl,
    };

    if (data.password) {
      updatePayload.passwordHash = await hashPassword(data.password);
      // Invalidate sessions if password updated
      await userRepository.deleteAllUserSessions(id);
    }

    const updatedUser = await userRepository.update(id, updatePayload);

    await userRepository.logActivity({
      userId: updatedById,
      userName: updatedByName,
      action: 'UPDATE_USER',
      module: 'USERS',
      entityId: id,
      details: { changes: Object.keys(data) },
    });

    return updatedUser;
  }

  async deleteUser(id: string, deletedById: string, deletedByName: string) {
    if (id === deletedById) {
      const err: AppError = new Error('You cannot delete your own account');
      err.statusCode = 400;
      throw err;
    }

    const user = await userRepository.findById(id);
    if (!user) {
      const err: AppError = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    await userRepository.deleteAllUserSessions(id);
    await userRepository.delete(id);

    await userRepository.logActivity({
      userId: deletedById,
      userName: deletedByName,
      action: 'DELETE_USER',
      module: 'USERS',
      entityId: id,
      details: { email: user.email },
    });

    return true;
  }
}

export const userService = new UserService();
