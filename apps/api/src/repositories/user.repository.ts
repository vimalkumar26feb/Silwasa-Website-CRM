import { prisma } from '../db/client.js';
import { UserRole } from '@silwasa/types';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    name: string;
    role: UserRole;
    avatarUrl?: string;
  }) {
    return prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, data: {
    name?: string;
    email?: string;
    role?: UserRole;
    isActive?: boolean;
    passwordHash?: string;
    avatarUrl?: string;
  }) {
    const updateData = { ...data };
    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase();
    }
    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (params.role) {
      where.role = params.role;
    }
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatarUrl: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createSession(userId: string, token: string, expiresAt: Date) {
    return prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findSession(token: string) {
    return prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            avatarUrl: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async deleteSession(token: string) {
    return prisma.session.deleteMany({
      where: { token },
    });
  }

  async deleteAllUserSessions(userId: string) {
    return prisma.session.deleteMany({
      where: { userId },
    });
  }

  async logActivity(data: {
    userId: string;
    userName: string;
    action: string;
    module: string;
    entityId?: string;
    details?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      return await prisma.activityLog.create({
        data: {
          userId: data.userId,
          userName: data.userName,
          action: data.action,
          module: data.module,
          entityId: data.entityId,
          details: data.details as object,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
    } catch {
      // Never let activity log failure break core auth operations
      return null;
    }
  }
}

export const userRepository = new UserRepository();
