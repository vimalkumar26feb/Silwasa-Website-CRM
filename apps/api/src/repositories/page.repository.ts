import { prisma } from '../db/client.js';
import { PageSection, SEOMetadata } from '@silwasa/types';

export class PageRepository {
  async create(data: {
    title: string;
    slug: string;
    content?: string | null;
    sections?: PageSection[];
    isPublished?: boolean;
    featuredImageUrl?: string | null;
    parentPageId?: string | null;
    seo?: SEOMetadata | null;
  }) {
    return prisma.page.create({
      data: {
        title: data.title,
        slug: data.slug.toLowerCase().trim(),
        content: data.content,
        sections: (data.sections || []) as object,
        isPublished: Boolean(data.isPublished),
        publishedAt: data.isPublished ? new Date() : null,
        featuredImageUrl: data.featuredImageUrl,
        parentPageId: data.parentPageId,
        ...(data.seo
          ? {
              seo: {
                create: {
                  metaTitle: data.seo.metaTitle,
                  metaDescription: data.seo.metaDescription,
                  metaKeywords: data.seo.metaKeywords,
                  canonicalUrl: data.seo.canonicalUrl,
                  robotsIndex: data.seo.robotsIndex ?? true,
                  robotsFollow: data.seo.robotsFollow ?? true,
                  ogTitle: data.seo.ogTitle,
                  ogDescription: data.seo.ogDescription,
                  ogImageUrl: data.seo.ogImageUrl,
                  twitterCard: data.seo.twitterCard || 'summary_large_image',
                  structuredDataJson: data.seo.structuredDataJson,
                },
              },
            }
          : {}),
      },
      include: {
        seo: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.page.findUnique({
      where: { id },
      include: {
        seo: true,
        revisions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            version: true,
            createdAt: true,
            createdBy: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });
  }

  async findBySlug(slug: string, publishedOnly = true) {
    const where: Record<string, unknown> = {
      slug: slug.toLowerCase().trim(),
    };
    if (publishedOnly) {
      where.isPublished = true;
    }
    return prisma.page.findFirst({
      where,
      include: {
        seo: true,
      },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    isPublished?: boolean;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (params.isPublished !== undefined) {
      where.isPublished = params.isPublished;
    }
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { slug: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.page.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          seo: true,
        },
      }),
      prisma.page.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
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
    }
  ) {
    const updateData: Record<string, unknown> = { ...data };
    if (data.slug) {
      updateData.slug = data.slug.toLowerCase().trim();
    }
    if (data.sections !== undefined) {
      updateData.sections = data.sections as object;
    }
    if (data.isPublished !== undefined) {
      updateData.isPublished = data.isPublished;
      if (data.isPublished) {
        updateData.publishedAt = new Date();
      }
    }

    delete updateData.seo;

    // Handle SEO update if provided
    if (data.seo !== undefined) {
      if (data.seo) {
        await prisma.sEOMetadata.upsert({
          where: { pageId: id },
          update: {
            metaTitle: data.seo.metaTitle,
            metaDescription: data.seo.metaDescription,
            metaKeywords: data.seo.metaKeywords,
            canonicalUrl: data.seo.canonicalUrl,
            robotsIndex: data.seo.robotsIndex ?? true,
            robotsFollow: data.seo.robotsFollow ?? true,
            ogTitle: data.seo.ogTitle,
            ogDescription: data.seo.ogDescription,
            ogImageUrl: data.seo.ogImageUrl,
            twitterCard: data.seo.twitterCard || 'summary_large_image',
            structuredDataJson: data.seo.structuredDataJson,
          },
          create: {
            pageId: id,
            metaTitle: data.seo.metaTitle,
            metaDescription: data.seo.metaDescription,
            metaKeywords: data.seo.metaKeywords,
            canonicalUrl: data.seo.canonicalUrl,
            robotsIndex: data.seo.robotsIndex ?? true,
            robotsFollow: data.seo.robotsFollow ?? true,
            ogTitle: data.seo.ogTitle,
            ogDescription: data.seo.ogDescription,
            ogImageUrl: data.seo.ogImageUrl,
            twitterCard: data.seo.twitterCard || 'summary_large_image',
            structuredDataJson: data.seo.structuredDataJson,
          },
        });
      }
    }

    return prisma.page.update({
      where: { id },
      data: updateData,
      include: {
        seo: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.page.delete({
      where: { id },
    });
  }

  async createRevision(pageId: string, title: string, sections: PageSection[], userId: string) {
    const lastRev = await prisma.pageRevision.findFirst({
      where: { pageId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });
    const version = (lastRev?.version || 0) + 1;

    return prisma.pageRevision.create({
      data: {
        pageId,
        title,
        sections: sections as object,
        version,
        createdById: userId,
      },
    });
  }

  async getRevisions(pageId: string) {
    return prisma.pageRevision.findMany({
      where: { pageId },
      orderBy: { version: 'desc' },
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
    });
  }

  async getRevisionById(revisionId: string) {
    return prisma.pageRevision.findUnique({
      where: { id: revisionId },
    });
  }
}

export const pageRepository = new PageRepository();
