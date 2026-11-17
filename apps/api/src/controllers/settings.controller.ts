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

  async sendTestEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { to, settings } = req.body;
      if (!to || typeof to !== 'string' || !to.includes('@')) {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid recipient email address',
        });
        return;
      }

      const result = await settingsService.sendTestEmail(
        to.trim(),
        settings,
        req.user?.id,
        req.user?.name
      );

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.error || 'Failed to dispatch test email',
          data: result,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Test email dispatched to ${to} via ${result.provider?.toUpperCase()} provider!`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSeoSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await settingsService.getSeoSettings();
      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSeoSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await settingsService.updateSeoSettings(
        req.body,
        req.user!.id,
        req.user!.name
      );
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Global SEO and tracking configurations updated',
      });
    } catch (error) {
      next(error);
    }
  }

  async getPopupSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await settingsService.getPopupSettings();
      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  async createPopup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await settingsService.createPopup(
        req.body,
        req.user!.id,
        req.user!.name
      );
      res.status(201).json({
        success: true,
        data: created,
        message: 'New popup created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePopup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await settingsService.updatePopup(
        req.params.id,
        req.body,
        req.user!.id,
        req.user!.name
      );
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Popup updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePopup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await settingsService.deletePopup(
        req.params.id,
        req.user!.id,
        req.user!.name
      );
      res.status(200).json({
        success: true,
        data: result,
        message: 'Popup deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePopupSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await settingsService.updatePopupSettings(
        req.body,
        req.user!.id,
        req.user!.name
      );
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Promotional popup configuration saved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getNewsletterSubscribers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subscribers = await settingsService.getNewsletterSubscribers();
      res.status(200).json({
        success: true,
        data: subscribers,
      });
    } catch (error) {
      next(error);
    }
  }

  async subscribeNewsletter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, source } = req.body;
      if (!email || !email.includes('@')) {
        res.status(400).json({ success: false, message: 'Valid email is required' });
        return;
      }
      const sub = await settingsService.addNewsletterSubscriber(email, source);
      res.status(201).json({
        success: true,
        data: sub,
        message: 'Subscribed to newsletter successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteNewsletterSubscriber(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await settingsService.deleteNewsletterSubscriber(id);
      res.status(200).json({
        success: true,
        message: 'Subscriber removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const settingsController = new SettingsController();
