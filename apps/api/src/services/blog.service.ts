import { blogRepository, FindPostsOptions } from '../repositories/blog.repository.js';
import { estimateReadingTime } from '@silwasa/shared';

export class BlogService {
  async getPublishedPosts(opts: FindPostsOptions = {}) {
    return blogRepository.findPublishedPosts(opts);
  }

  async getPostBySlug(slug: string) {
    const post = await blogRepository.findPostBySlug(slug, true);
    if (!post) {
      throw new Error('Blog post not found');
    }
    return post;
  }

  async getAllPosts(opts: FindPostsOptions = {}) {
    return blogRepository.findAllPosts(opts);
  }

  async getPostById(id: string) {
    const post = await blogRepository.findPostById(id);
    if (!post) {
      throw new Error('Blog post not found');
    }
    return post;
  }

  async createPost(data: any, authorId: string) {
    const existing = await blogRepository.findPostBySlug(data.slug, false);
    if (existing) {
      throw new Error(`A blog post with slug '${data.slug}' already exists`);
    }

    const readingTime = data.readingTimeMinutes || estimateReadingTime(data.content);

    return blogRepository.createPost(
      {
        ...data,
        readingTimeMinutes: readingTime,
      },
      authorId
    );
  }

  async updatePost(id: string, data: any) {
    const existing = await blogRepository.findPostById(id);
    if (!existing) {
      throw new Error('Blog post not found');
    }

    if (data.slug && data.slug !== existing.slug) {
      const conflict = await blogRepository.findPostBySlug(data.slug, false);
      if (conflict && conflict.id !== id) {
        throw new Error(`A blog post with slug '${data.slug}' already exists`);
      }
    }

    const readingTime = data.content
      ? estimateReadingTime(data.content)
      : data.readingTimeMinutes || existing.readingTimeMinutes;

    return blogRepository.updatePost(id, {
      ...data,
      readingTimeMinutes: readingTime,
    });
  }

  async deletePost(id: string) {
    const existing = await blogRepository.findPostById(id);
    if (!existing) {
      throw new Error('Blog post not found');
    }
    return blogRepository.deletePost(id);
  }

  // Categories
  async getCategories() {
    return blogRepository.findCategories();
  }

  async createCategory(data: { name: string; slug: string; description?: string | null; imageUrl?: string | null }) {
    const existing = await blogRepository.findCategoryBySlug(data.slug);
    if (existing) {
      throw new Error(`A category with slug '${data.slug}' already exists`);
    }
    return blogRepository.createCategory(data);
  }

  async updateCategory(id: string, data: any) {
    const existing = await blogRepository.findCategoryById(id);
    if (!existing) {
      throw new Error('Category not found');
    }
    return blogRepository.updateCategory(id, data);
  }

  async deleteCategory(id: string) {
    const existing = await blogRepository.findCategoryById(id);
    if (!existing) {
      throw new Error('Category not found');
    }
    return blogRepository.deleteCategory(id);
  }

  // Tags
  async getTags() {
    return blogRepository.findTags();
  }
}

export const blogService = new BlogService();
