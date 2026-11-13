import { menuRepository, CreateMenuDto, UpdateMenuDto } from '../repositories/menu.repository.js';
import type { MenuItem } from '@silwasa/types';

export class MenuService {
  async getAllMenus() {
    return menuRepository.findMany();
  }

  async getMenuById(id: string) {
    const menu = await menuRepository.findById(id);
    if (!menu) {
      throw new Error('Menu not found');
    }
    return menu;
  }

  async getMenuByLocation(location: string) {
    const menu = await menuRepository.findByLocation(location);
    if (!menu) {
      return null;
    }
    return menu;
  }

  async createMenu(data: CreateMenuDto) {
    const existing = await menuRepository.findByLocation(data.location);
    if (existing) {
      throw new Error(`A menu with location '${data.location}' already exists`);
    }
    return menuRepository.create(data);
  }

  async updateMenu(id: string, data: UpdateMenuDto) {
    const existing = await menuRepository.findById(id);
    if (!existing) {
      throw new Error('Menu not found');
    }

    if (data.location && data.location !== existing.location) {
      const conflict = await menuRepository.findByLocation(data.location);
      if (conflict && conflict.id !== id) {
        throw new Error(`A menu with location '${data.location}' already exists`);
      }
    }

    return menuRepository.update(id, data);
  }

  async updateMenuItems(id: string, items: MenuItem[]) {
    const existing = await menuRepository.findById(id);
    if (!existing) {
      throw new Error('Menu not found');
    }

    return menuRepository.update(id, { items });
  }

  async deleteMenu(id: string) {
    const existing = await menuRepository.findById(id);
    if (!existing) {
      throw new Error('Menu not found');
    }

    return menuRepository.delete(id);
  }
}

export const menuService = new MenuService();
