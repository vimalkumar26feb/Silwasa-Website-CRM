import { prisma } from '../db/client.js';

export class ServiceRepository {
  // Services
  async findPublishedServices() {
    return prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
      include: {
        pricingPackages: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
        seo: true,
      },
    });
  }

  async findServiceBySlug(slug: string, onlyPublished = true) {
    return prisma.service.findFirst({
      where: {
        slug,
        ...(onlyPublished ? { isPublished: true } : {}),
      },
      include: {
        pricingPackages: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
        seo: true,
      },
    });
  }

  async findAllServices() {
    return prisma.service.findMany({
      orderBy: { order: 'asc' },
      include: {
        pricingPackages: true,
        seo: true,
      },
    });
  }

  async findServiceById(id: string) {
    return prisma.service.findUnique({
      where: { id },
      include: {
        pricingPackages: true,
        seo: true,
      },
    });
  }

  async createService(data: any) {
    const { seo, ...rest } = data;

    return prisma.service.create({
      data: {
        ...rest,
        features: rest.features ?? [],
        benefits: rest.benefits ?? [],
        process: rest.process ?? [],
        faqs: rest.faqs ?? [],
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
        pricingPackages: true,
        seo: true,
      },
    });
  }

  async updateService(id: string, data: any) {
    const { seo, ...rest } = data;

    return prisma.service.update({
      where: { id },
      data: {
        ...rest,
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
        pricingPackages: true,
        seo: true,
      },
    });
  }

  async deleteService(id: string) {
    return prisma.service.delete({
      where: { id },
    });
  }

  // Pricing Packages
  async findPricingPackages(opts: { serviceId?: string; onlyActive?: boolean } = {}) {
    const where: any = {};
    if (opts.onlyActive !== false) {
      where.isActive = true;
    }
    if (opts.serviceId) {
      where.serviceId = opts.serviceId;
    }

    return prisma.pricingPackage.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        service: { select: { id: true, title: true, slug: true } },
      },
    });
  }

  async findPricingPackageById(id: string) {
    return prisma.pricingPackage.findUnique({
      where: { id },
      include: {
        service: { select: { id: true, title: true, slug: true } },
      },
    });
  }

  async createPricingPackage(data: any) {
    return prisma.pricingPackage.create({
      data: {
        ...data,
        features: data.features ?? [],
      },
      include: {
        service: { select: { id: true, title: true, slug: true } },
      },
    });
  }

  async updatePricingPackage(id: string, data: any) {
    return prisma.pricingPackage.update({
      where: { id },
      data,
      include: {
        service: { select: { id: true, title: true, slug: true } },
      },
    });
  }

  async deletePricingPackage(id: string) {
    return prisma.pricingPackage.delete({
      where: { id },
    });
  }
}

export const serviceRepository = new ServiceRepository();
