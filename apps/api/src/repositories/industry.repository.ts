import { prisma } from '../db/client.js';

export interface CreateIndustryInput {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon?: string | null;
  featuredImageUrl?: string | null;
  challenges?: string[];
  solutions?: string[];
  isPublished?: boolean;
  order?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  } | null;
}

export class IndustryRepository {
  async findPublished() {
    return prisma.industry.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
      include: { seo: true }
    });
  }

  async findBySlug(slug: string) {
    return prisma.industry.findUnique({
      where: { slug },
      include: { seo: true }
    });
  }

  async findById(id: string) {
    return prisma.industry.findUnique({
      where: { id },
      include: { seo: true }
    });
  }

  async listAll() {
    return prisma.industry.findMany({
      orderBy: { order: 'asc' },
      include: { seo: true }
    });
  }

  async create(data: CreateIndustryInput) {
    const { seo, ...rest } = data;
    return prisma.industry.create({
      data: {
        ...rest,
        challenges: (rest.challenges || []) as any,
        solutions: (rest.solutions || []) as any,
        seo: seo
          ? {
              create: {
                metaTitle: seo.metaTitle || rest.name,
                metaDescription: seo.metaDescription || rest.shortDescription,
                canonicalUrl: seo.canonicalUrl,
              }
            }
          : undefined
      },
      include: { seo: true }
    });
  }

  async update(id: string, data: Partial<CreateIndustryInput>) {
    const { seo, ...rest } = data;
    const updateData: any = { ...rest };
    if (rest.challenges) updateData.challenges = rest.challenges as any;
    if (rest.solutions) updateData.solutions = rest.solutions as any;

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

    return prisma.industry.update({
      where: { id },
      data: updateData,
      include: { seo: true }
    });
  }

  async delete(id: string) {
    return prisma.industry.delete({
      where: { id }
    });
  }
}

export const industryRepository = new IndustryRepository();
