import { Request, Response, NextFunction } from 'express';
import { mediaService } from '../services/media.service.js';

export class MediaController {
  async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'Please select a file to upload' });
        return;
      }

      const media = await mediaService.upload(
        req.file,
        req.user!.id,
        req.user!.name
      );

      res.status(201).json({
        success: true,
        data: media,
        message: 'File uploaded successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async listMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 24;
      const search = req.query.search as string | undefined;
      const type = req.query.type as string | undefined;

      const result = await mediaService.listMedia({ page, limit, search, type });

      res.status(200).json({
        success: true,
        data: result.items,
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

  async updateMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { altText, title } = req.body;
      const updated = await mediaService.updateMedia(
        req.params.id,
        { altText, title },
        req.user!.id,
        req.user!.name
      );

      res.status(200).json({
        success: true,
        data: updated,
        message: 'Media asset updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await mediaService.deleteMedia(
        req.params.id,
        req.user!.id,
        req.user!.name
      );

      res.status(200).json({
        success: true,
        message: 'Media asset deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async bulkDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ success: false, message: 'Please provide an array of media IDs to delete' });
        return;
      }

      const result = await mediaService.bulkDelete(
        ids,
        req.user!.id,
        req.user!.name
      );

      res.status(200).json({
        success: true,
        data: result,
        message: `Successfully deleted ${result.deletedCount} media asset${result.deletedCount === 1 ? '' : 's'}${result.skippedCount > 0 ? ` (${result.skippedCount} skipped due to active usage)` : ''}`,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const mediaController = new MediaController();
