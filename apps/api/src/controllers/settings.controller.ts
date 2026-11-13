import { Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settings.service.js';
import { ThemeSettingsSchema, GeneralSettingsSchema } from '@silwasa/validation';

export class SettingsController {
  async getPublicSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await settingsService.getPublicSettings();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getThemeSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const theme = await settingsService.getThemeSettings();
      res.status(200).json({
        success: true,
        data: theme,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateThemeSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = ThemeSettingsSchema.parse(req.body);
      const updated = await settingsService.updateThemeSettings(
        validated,
        req.user!.id,
        req.user!.name
      );
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Theme settings updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getGeneralSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await settingsService.getGeneralSettings();
      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateGeneralSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = GeneralSettingsSchema.parse(req.body);
      const updated = await settingsService.updateGeneralSettings(
        validated,
        req.user!.id,
        req.user!.name
      );
      res.status(200).json({
        success: true,
        data: updated,
        message: 'General settings updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getEmailSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await settingsService.getEmailSettings();
      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEmailSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await settingsService.updateEmailSettings(
        req.body,
        req.user!.id,
        req.user!.name
      );
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Email provider settings saved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const settingsController = new SettingsController();
