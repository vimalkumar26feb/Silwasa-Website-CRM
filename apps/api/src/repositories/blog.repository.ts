import { prisma } from '../db/client.js';

export interface FindPostsOptions {
  search?: string;
  categorySlug?: string;
  tagSlug?: string;
  page?: number;
  limit?: number;
  isPublished?: boolean;
}

export class BlogRepository {
  async findPublishedPosts(opts: FindPostsOptions = {}) {
    const page = opts.page || 1;
    const limit = opts.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true,
    };

    if (opts.search) {
      where.OR = [
        { title: { contains: opts.search, mode: 'insensitive' } },
        { excerpt: { contains: opts.search, mode: 'insensitive' } },
      ];
    }

    if (opts.categorySlug) {
      where.categories = {
        some: {
          category: { slug: opts.categorySlug },
        },
      };
    }

    if (opts.tagSlug) {
      where.tags = {
        some: {
          tag: { slug: opts.tagSlug },
        },
      };
    }

    const [total, posts] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          seo: true,
        },
      }),
    ]);

    return { total, page, limit, posts };
  }

  async findPostBySlug(slug: string, onlyPublished = true) {
    return prisma.blogPost.findFirst({
      where: {
        slug,
        ...(onlyPublished ? { isPublished: true } : {}),
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        seo: true,
      },
    });
  }

  async findAllPosts(opts: FindPostsOptions = {}) {
    const page = opts.page || 1;
    const limit = opts.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (opts.isPublished !== undefined) {
      where.isPublished = opts.isPublished;
    }
    if (opts.search) {
      where.OR = [
        { title: { contains: opts.search, mode: 'insensitive' } },
        { excerpt: { contains: opts.search, mode: 'insensitive' } },
      ];
    }

    const [total, posts] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          seo: true,
        },
      }),
    ]);

    return { total, page, limit, posts };
  }

  async findPostById(id: string) {
    return prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        seo: true,
      },
    });
  }

  async createPost(data: any, authorId: string) {
    const { categoryIds = [], tagNames = [], seo, ...rest } = data;

    return prisma.blogPost.create({
      data: {
        ...rest,
        authorId,
        publishedAt: rest.isPublished ? new Date() : null,
        categories: {
          create: categoryIds.map((categoryId: string) => ({ categoryId })),
        },
        tags: {
          create: tagNames.map((name: string) => ({
            tag: {
              connectOrCreate: {
                where: { name },
                create: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
              },
            },
          })),
        },
        seo: seo
          ? {
              create: {
                metaTitle: seo.metaTitle,
                metaDescription: seo.metaDescription,
                metaKeywords: seo.metaKeywords || (seo.keywords ? seo.keywords.join(', ') : null),
                canonicalUrl: seo.canonicalUrl,
                robotsIndex: seo.robotsIndex !== false,
                robotsFollow: seo.robotsFollow !== false,
                ogTitle: seo.ogTitle,
                ogDescription: seo.ogDescription,
                ogImageUrl: seo.ogImageUrl,
              },
            }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        seo: true,
      },
    });
  }

  async updatePost(id: string, data: any) {
    const { categoryIds, tagNames, seo, ...rest } = data;

    return prisma.blogPost.update({
      where: { id },
      data: {
        ...rest,
        ...(rest.isPublished ? { publishedAt: new Date() } : {}),
        ...(categoryIds
          ? {
              categories: {
                deleteMany: {},
                create: categoryIds.map((categoryId: string) => ({ categoryId })),
              },
            }
          : {}),
        ...(seo
          ? {
              seo: {
                upsert: {
                  create: {
                    metaTitle: seo.metaTitle,
                    metaDescription: seo.metaDescription,
                    metaKeywords: seo.metaKeywords || (seo.keywords ? seo.keywords.join(', ') : null),
                    canonicalUrl: seo.canonicalUrl,
                    robotsIndex: seo.robotsIndex !== false,
                    robotsFollow: seo.robotsFollow !== false,
                    ogTitle: seo.ogTitle,
                    ogDescription: seo.ogDescription,
                    ogImageUrl: seo.ogImageUrl,
                  },
                  update: {
                    metaTitle: seo.metaTitle,
                    metaDescription: seo.metaDescription,
                    metaKeywords: seo.metaKeywords || (seo.keywords ? seo.keywords.join(', ') : null),
                    canonicalUrl: seo.canonicalUrl,
                    robotsIndex: seo.robotsIndex !== false,
                    robotsFollow: seo.robotsFollow !== false,
                    ogTitle: seo.ogTitle,
                    ogDescription: seo.ogDescription,
                    ogImageUrl: seo.ogImageUrl,
                  },
                },
              },
            }
          : {}),
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        seo: true,
      },
    });
  }

  async deletePost(id: string) {
    return prisma.blogPost.delete({
      where: { id },
    });
  }

  // Categories
  async findCategories() {
    return prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
  }

  async findCategoryById(id: string) {
    return prisma.blogCategory.findUnique({
      where: { id },
    });
  }

  async findCategoryBySlug(slug: string) {
    return prisma.blogCategory.findUnique({
      where: { slug },
    });
  }

  async createCategory(data: { name: string; slug: string; description?: string | null; imageUrl?: string | null }) {
    return prisma.blogCategory.create({
      data,
    });
  }

  async updateCategory(id: string, data: any) {
    return prisma.blogCategory.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: string) {
    return prisma.blogCategory.delete({
      where: { id },
    });
  }

  // Tags
  async findTags() {
    return prisma.blogTag.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
  }

  async createTag(data: { name: string; slug: string }) {
    return prisma.blogTag.create({
      data,
    });
  }

  async deleteTag(id: string) {
    return prisma.blogTag.delete({
      where: { id },
    });
  }
}

export const blogRepository = new BlogRepository();
