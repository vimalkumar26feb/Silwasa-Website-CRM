import { prisma } from '../db/client.js';

export interface CreateMenuDto {
  name: string;
  location: string;
  items?: any;
}

export interface UpdateMenuDto {
  name?: string;
  location?: string;
  items?: any;
}

export class MenuRepository {
  async findMany() {
    return prisma.menu.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.menu.findUnique({
      where: { id },
    });
  }

  async findByLocation(location: string) {
    return prisma.menu.findUnique({
      where: { location },
    });
  }

  async create(data: CreateMenuDto) {
    return prisma.menu.create({
      data: {
        name: data.name,
        location: data.location,
        items: data.items ?? [],
      },
    });
  }

  async update(id: string, data: UpdateMenuDto) {
    return prisma.menu.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.items !== undefined && { items: data.items }),
      },
    });
  }

  async delete(id: string) {
    return prisma.menu.delete({
      where: { id },
    });
  }
}

export const menuRepository = new MenuRepository();
