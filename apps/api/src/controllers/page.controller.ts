import { Request, Response, NextFunction } from 'express';
import { pageService } from '../services/page.service.js';
import { CreatePageSchema, UpdatePageSchema } from '@silwasa/validation';

export class PageController {
  async getPublicPageBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = await pageService.getPageBySlug(req.params.slug, true);
      res.status(200).json({
        success: true,
        data: page,
      });
    } catch (error) {
      next(error);
    }
  }

  async listPublicPages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const result = await pageService.listPages({
        page,
        limit,
        isPublished: true,
      });

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

  async listAdminPages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const search = req.query.search as string | undefined;
      const isPublished =
        req.query.isPublished !== undefined
          ? req.query.isPublished === 'true'
          : undefined;

      const result = await pageService.listPages({ page, limit, search, isPublished });

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

  async getAdminPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = await pageService.getPageById(req.params.id);
      res.status(200).json({
        success: true,
        data: page,
      });
    } catch (error) {
      next(error);
    }
  }

  async createPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = CreatePageSchema.parse(req.body);
      const page = await pageService.createPage(
        validated,
        req.user!.id,
        req.user!.name
      );

      res.status(201).json({
        success: true,
        data: page,
        message: 'Page created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = UpdatePageSchema.parse(req.body);
      const updated = await pageService.updatePage(
        req.params.id,
        validated,
        req.user!.id,
        req.user!.name
      );

      res.status(200).json({
        success: true,
        data: updated,
        message: 'Page updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async publishPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isPublished = Boolean(req.body.isPublished);
      const updated = await pageService.publishPage(
        req.params.id,
        isPublished,
        req.user!.id,
        req.user!.name
      );

      res.status(200).json({
        success: true,
        data: updated,
        message: isPublished ? 'Page published successfully' : 'Page moved to draft',
      });
    } catch (error) {
      next(error);
    }
  }

  async duplicatePage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const duplicated = await pageService.duplicatePage(
        req.params.id,
        req.user!.id,
        req.user!.name
      );

      res.status(201).json({
        success: true,
        data: duplicated,
        message: 'Page duplicated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await pageService.deletePage(
        req.params.id,
        req.user!.id,
        req.user!.name
      );

      res.status(200).json({
        success: true,
        message: 'Page deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getRevisions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const revisions = await pageService.getRevisions(req.params.id);
      res.status(200).json({
        success: true,
        data: revisions,
      });
    } catch (error) {
      next(error);
    }
  }

  async restoreRevision(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const restored = await pageService.restoreRevision(
        req.params.id,
        req.params.revisionId,
        req.user!.id,
        req.user!.name
      );

      res.status(200).json({
        success: true,
        data: restored,
        message: 'Page revision restored successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const pageController = new PageController();
