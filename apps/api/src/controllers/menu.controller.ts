import { Request, Response, NextFunction } from 'express';
import { menuService } from '../services/menu.service.js';
import { CreateMenuSchema, UpdateMenuSchema } from '@silwasa/validation';

export class MenuController {
  async getPublicMenuByLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const { location } = req.params;
      const menu = await menuService.getMenuByLocation(location);

      if (!menu) {
        return res.status(404).json({
          success: false,
          message: `Menu for location '${location}' not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: menu,
      });
    } catch (err) {
      next(err);
    }
  }

  async listMenus(req: Request, res: Response, next: NextFunction) {
    try {
      const menus = await menuService.getAllMenus();
      return res.status(200).json({
        success: true,
        data: menus,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMenu(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const menu = await menuService.getMenuById(id);
      return res.status(200).json({
        success: true,
        data: menu,
      });
    } catch (err) {
      next(err);
    }
  }

  async createMenu(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = CreateMenuSchema.parse(req.body);
      const menu = await menuService.createMenu(validated);
      return res.status(201).json({
        success: true,
        data: menu,
        message: 'Menu created successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async updateMenu(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = UpdateMenuSchema.parse(req.body);
      const menu = await menuService.updateMenu(id, validated);
      return res.status(200).json({
        success: true,
        data: menu,
        message: 'Menu updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async updateMenuItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { items } = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          message: 'Items must be an array',
        });
      }

      const menu = await menuService.updateMenuItems(id, items);
      return res.status(200).json({
        success: true,
        data: menu,
        message: 'Menu items updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteMenu(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await menuService.deleteMenu(id);
      return res.status(200).json({
        success: true,
        message: 'Menu deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}

export const menuController = new MenuController();
