import { prisma } from '../db/client.js';

export interface CreatePortfolioInput {
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  category: string;
  projectUrl?: string | null;
  featuredImageUrl: string;
  galleryImages?: string[];
  description: string;
  technologies?: string[];
  challenges: string;
  solutions: string;
  results: string;
  isPublished?: boolean;
  order?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  } | null;
}

export class PortfolioRepository {
  async findPublished() {
    return prisma.portfolioProject.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
      include: { seo: true }
    });
  }

  async findBySlug(slug: string) {
    return prisma.portfolioProject.findUnique({
      where: { slug },
      include: { seo: true }
    });
  }

  async findById(id: string) {
    return prisma.portfolioProject.findUnique({
      where: { id },
      include: { seo: true }
    });
  }

  async listAll() {
    return prisma.portfolioProject.findMany({
      orderBy: { order: 'asc' },
      include: { seo: true }
    });
  }

  async create(data: CreatePortfolioInput) {
    const { seo, ...rest } = data;
    return prisma.portfolioProject.create({
      data: {
        ...rest,
        galleryImages: (rest.galleryImages || []) as any,
        technologies: (rest.technologies || []) as any,
        seo: seo
          ? {
              create: {
                metaTitle: seo.metaTitle || rest.title,
                metaDescription: seo.metaDescription || rest.description,
                canonicalUrl: seo.canonicalUrl,
              }
            }
          : undefined
      },
      include: { seo: true }
    });
  }

  async update(id: string, data: Partial<CreatePortfolioInput>) {
    const { seo, ...rest } = data;
    const updateData: any = { ...rest };
    if (rest.galleryImages) updateData.galleryImages = rest.galleryImages as any;
    if (rest.technologies) updateData.technologies = rest.technologies as any;

    if (seo) {
      updateData.seo = {
        upsert: {
          create: {
            metaTitle: seo.metaTitle,
            metaDescription: seo.metaDescription,
            canonicalUrl: seo.canonicalUrl
          },
          update: {
            metaTitle: seo.metaTitle,
            metaDescription: seo.metaDescription,
            canonicalUrl: seo.canonicalUrl
          }
        }
      };
    }

    return prisma.portfolioProject.update({
      where: { id },
      data: updateData,
      include: { seo: true }
    });
  }

  async delete(id: string) {
    return prisma.portfolioProject.delete({
      where: { id }
    });
  }
}

export const portfolioRepository = new PortfolioRepository();
