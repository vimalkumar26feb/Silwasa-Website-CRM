import { Request, Response, NextFunction } from 'express';
import { blogService } from '../services/blog.service.js';
import { CreateBlogPostSchema, UpdateBlogPostSchema, CreateCategorySchema, UpdateCategorySchema } from '@silwasa/validation';

export class BlogController {
  // Public
  async getPublishedBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, category, tag, page, limit } = req.query;
      const result = await blogService.getPublishedPosts({
        search: search as string,
        categorySlug: category as string,
        tagSlug: tag as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 10,
      });

      return res.status(200).json({
        success: true,
        data: result.posts,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getBlogBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const post = await blogService.getPostBySlug(slug).catch(() => null);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: `Blog post '${slug}' not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: post,
      });
    } catch (err) {
      next(err);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await blogService.getCategories();
      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (err) {
      next(err);
    }
  }

  async getTags(req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await blogService.getTags();
      return res.status(200).json({
        success: true,
        data: tags,
      });
    } catch (err) {
      next(err);
    }
  }

  // Admin
  async listAllBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, isPublished, page, limit } = req.query;
      const result = await blogService.getAllPosts({
        search: search as string,
        isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });

      return res.status(200).json({
        success: true,
        data: result.posts,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getBlogById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const post = await blogService.getPostById(id);
      return res.status(200).json({
        success: true,
        data: post,
      });
    } catch (err) {
      next(err);
    }
  }

  async createBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = CreateBlogPostSchema.parse(req.body);
      const authorId = (req as any).user?.id || 'admin-1';
      const post = await blogService.createPost(validated, authorId);
      return res.status(201).json({
        success: true,
        data: post,
        message: 'Blog post created successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async updateBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = UpdateBlogPostSchema.parse(req.body);
      const post = await blogService.updatePost(id, validated);
      return res.status(200).json({
        success: true,
        data: post,
        message: 'Blog post updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await blogService.deletePost(id);
      return res.status(200).json({
        success: true,
        message: 'Blog post deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = CreateCategorySchema.parse(req.body);
      const category = await blogService.createCategory(validated);
      return res.status(201).json({
        success: true,
        data: category,
        message: 'Category created successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = UpdateCategorySchema.parse(req.body);
      const category = await blogService.updateCategory(id, validated);
      return res.status(200).json({
        success: true,
        data: category,
        message: 'Category updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await blogService.deleteCategory(id);
      return res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}

export const blogController = new BlogController();
