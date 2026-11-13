import { pageRepository } from '../repositories/page.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../middleware/errorHandler.js';
import { PageSection, SEOMetadata } from '@silwasa/types';

export class PageService {
  async listPages(params: {
    page?: number;
    limit?: number;
    search?: string;
    isPublished?: boolean;
  }) {
    return pageRepository.findAll(params);
  }

  async getPageById(id: string) {
    const page = await pageRepository.findById(id);
    if (!page) {
      const err: AppError = new Error('Page not found');
      err.statusCode = 404;
      throw err;
    }
    return page;
  }

  async getPageBySlug(slug: string, publishedOnly = true) {
    const page = await pageRepository.findBySlug(slug, publishedOnly);
    if (!page) {
      const err: AppError = new Error('Page not found');
      err.statusCode = 404;
      throw err;
    }
    return page;
  }

  async createPage(
    data: {
      title: string;
      slug: string;
      content?: string | null;
      sections?: PageSection[];
      isPublished?: boolean;
      featuredImageUrl?: string | null;
      parentPageId?: string | null;
      seo?: SEOMetadata | null;
    },
    userId: string,
    userName: string
  ) {
    const existing = await pageRepository.findBySlug(data.slug, false);
    if (existing) {
      const err: AppError = new Error(`A page with slug "/${data.slug}" already exists`);
      err.statusCode = 409;
      throw err;
    }

    const page = await pageRepository.create(data);

    // Initial revision
    await pageRepository.createRevision(
      page.id,
      page.title,
      (page.sections as unknown as PageSection[]) || [],
      userId
    );

    await userRepository.logActivity({
      userId,
      userName,
      action: 'CREATE_PAGE',
      module: 'PAGES',
      entityId: page.id,
      details: { slug: page.slug, title: page.title },
    });

    return page;
  }

  async updatePage(
    id: string,
    data: {
      title?: string;
      slug?: string;
      content?: string | null;
      sections?: PageSection[];
      isPublished?: boolean;
      featuredImageUrl?: string | null;
      parentPageId?: string | null;
      seo?: SEOMetadata | null;
    },
    userId: string,
    userName: string
  ) {
    const page = await pageRepository.findById(id);
    if (!page) {
      const err: AppError = new Error('Page not found');
      err.statusCode = 404;
      throw err;
    }

    if (data.slug && data.slug !== page.slug) {
      const existing = await pageRepository.findBySlug(data.slug, false);
      if (existing && existing.id !== id) {
        const err: AppError = new Error(`Slug "/${data.slug}" is already taken`);
        err.statusCode = 409;
        throw err;
      }
    }

    const updated = await pageRepository.update(id, data);

    // Save revision on section changes
    if (data.sections !== undefined) {
      await pageRepository.createRevision(
        id,
        updated.title,
        (updated.sections as unknown as PageSection[]) || [],
        userId
      );
    }

    await userRepository.logActivity({
      userId,
      userName,
      action: 'UPDATE_PAGE',
      module: 'PAGES',
      entityId: id,
      details: { slug: updated.slug },
    });

    return updated;
  }

  async publishPage(id: string, isPublished: boolean, userId: string, userName: string) {
    const page = await pageRepository.findById(id);
    if (!page) {
      const err: AppError = new Error('Page not found');
      err.statusCode = 404;
      throw err;
    }

    const updated = await pageRepository.update(id, { isPublished });

    await userRepository.logActivity({
      userId,
      userName,
      action: isPublished ? 'PUBLISH_PAGE' : 'UNPUBLISH_PAGE',
      module: 'PAGES',
      entityId: id,
      details: { slug: page.slug },
    });

    return updated;
  }

  async duplicatePage(id: string, userId: string, userName: string) {
    const page = await pageRepository.findById(id);
    if (!page) {
      const err: AppError = new Error('Page not found');
      err.statusCode = 404;
      throw err;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const newSlug = `${page.slug}-copy-${randomSuffix}`;
    const newTitle = `${page.title} (Copy)`;

    const duplicated = await pageRepository.create({
      title: newTitle,
      slug: newSlug,
      content: page.content,
      sections: (page.sections as unknown as PageSection[]) || [],
      isPublished: false, // Duplicated pages start as Drafts
      featuredImageUrl: page.featuredImageUrl,
      parentPageId: page.parentPageId,
    });

    await userRepository.logActivity({
      userId,
      userName,
      action: 'DUPLICATE_PAGE',
      module: 'PAGES',
      entityId: duplicated.id,
      details: { sourceId: id, newSlug },
    });

    return duplicated;
  }

  async deletePage(id: string, userId: string, userName: string) {
    const page = await pageRepository.findById(id);
    if (!page) {
      const err: AppError = new Error('Page not found');
      err.statusCode = 404;
      throw err;
    }

    await pageRepository.delete(id);

    await userRepository.logActivity({
      userId,
      userName,
      action: 'DELETE_PAGE',
      module: 'PAGES',
      entityId: id,
      details: { slug: page.slug, title: page.title },
    });

    return true;
  }

  async getRevisions(pageId: string) {
    return pageRepository.getRevisions(pageId);
  }

  async restoreRevision(pageId: string, revisionId: string, userId: string, userName: string) {
    const revision = await pageRepository.getRevisionById(revisionId);
    if (!revision || revision.pageId !== pageId) {
      const err: AppError = new Error('Revision not found');
      err.statusCode = 404;
      throw err;
    }

    const updated = await pageRepository.update(pageId, {
      title: revision.title,
      sections: revision.sections as unknown as PageSection[],
    });

    await userRepository.logActivity({
      userId,
      userName,
      action: 'RESTORE_PAGE_REVISION',
      module: 'PAGES',
      entityId: pageId,
      details: { revisionVersion: revision.version },
    });

    return updated;
  }
}

export const pageService = new PageService();
