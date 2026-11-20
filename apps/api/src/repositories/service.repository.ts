import { prisma } from '../db/client.js';

function formatServiceRecord(svc: any) {
  if (!svc) return svc;
  let category = 'General';
  let customUrl = '';
  let benefitsArray: string[] = [];

  if (Array.isArray(svc.benefits)) {
    benefitsArray = svc.benefits;
  } else if (svc.benefits && typeof svc.benefits === 'object') {
    category = svc.benefits.category || 'General';
    customUrl = svc.benefits.customUrl || '';
    benefitsArray = Array.isArray(svc.benefits.items) ? svc.benefits.items : [];
  }

  return {
    ...svc,
    category,
    customUrl,
    benefits: benefitsArray,
  };
}

function formatPricingRecord(pkg: any) {
  if (!pkg) return pkg;
  let tableFeatures: any[] = [];
  let featuresArray: any[] = [];

  if (Array.isArray(pkg.features)) {
    featuresArray = pkg.features;
    if ((pkg.features as any).__tableFeatures) {
      tableFeatures = (pkg.features as any).__tableFeatures;
    }
  } else if (pkg.features && typeof pkg.features === 'object') {
    featuresArray = Array.isArray(pkg.features.items) ? pkg.features.items : [];
    tableFeatures = Array.isArray(pkg.features.tableFeatures) ? pkg.features.tableFeatures : [];
  }

  return {
    ...pkg,
    features: featuresArray,
    tableFeatures: tableFeatures.length > 0 ? tableFeatures : undefined,
  };
}

export class ServiceRepository {
  // Services
  async findPublishedServices() {
    const list = await prisma.service.findMany({
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
    return list.map(formatServiceRecord);
  }

  async findServiceBySlug(slug: string, onlyPublished = true) {
    const svc = await prisma.service.findFirst({
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
    return formatServiceRecord(svc);
  }

  async findAllServices() {
    const list = await prisma.service.findMany({
      orderBy: { order: 'asc' },
      include: {
        pricingPackages: true,
        seo: true,
      },
    });
    return list.map(formatServiceRecord);
  }

  async findServiceById(id: string) {
    const svc = await prisma.service.findUnique({
      where: { id },
      include: {
        pricingPackages: true,
        seo: true,
      },
    });
    return formatServiceRecord(svc);
  }

  async createService(data: any) {
    const { seo, category, customUrl, benefits, ...rest } = data;

    const formattedBenefits = {
      category: category || 'General',
      customUrl: customUrl || '',
      items: Array.isArray(benefits) ? benefits : [],
    };

    const created = await prisma.service.create({
      data: {
        ...rest,
        features: rest.features ?? [],
        benefits: formattedBenefits as any,
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

    return formatServiceRecord(created);
  }

  async updateService(id: string, data: any) {
    const { seo, category, customUrl, benefits, ...rest } = data;

    const formattedBenefits = {
      category: category || 'General',
      customUrl: customUrl || '',
      items: Array.isArray(benefits) ? benefits : [],
    };

    const updated = await prisma.service.update({
      where: { id },
      data: {
        ...rest,
        benefits: formattedBenefits as any,
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

    return formatServiceRecord(updated);
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

    const list = await prisma.pricingPackage.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        service: { select: { id: true, title: true, slug: true } },
      },
    });
    return list.map(formatPricingRecord);
  }

  async findPricingPackageById(id: string) {
    const pkg = await prisma.pricingPackage.findUnique({
      where: { id },
      include: {
        service: { select: { id: true, title: true, slug: true } },
      },
    });
    return formatPricingRecord(pkg);
  }

  async createPricingPackage(data: any) {
    const { tableFeatures, ...rest } = data;
    let featuresPayload = rest.features ?? [];
    if (tableFeatures && Array.isArray(tableFeatures) && tableFeatures.length > 0) {
      featuresPayload = {
        items: featuresPayload,
        tableFeatures,
      } as any;
    }

    const created = await prisma.pricingPackage.create({
      data: {
        ...rest,
        features: featuresPayload,
      },
      include: {
        service: { select: { id: true, title: true, slug: true } },
      },
    });

    return formatPricingRecord(created);
  }

  async updatePricingPackage(id: string, data: any) {
    const { tableFeatures, ...rest } = data;
    let featuresPayload = rest.features ?? [];
    if (tableFeatures && Array.isArray(tableFeatures) && tableFeatures.length > 0) {
      featuresPayload = {
        items: featuresPayload,
        tableFeatures,
      } as any;
    }

    const updated = await prisma.pricingPackage.update({
      where: { id },
      data: {
        ...rest,
        features: featuresPayload,
      },
      include: {
        service: { select: { id: true, title: true, slug: true } },
      },
    });

    return formatPricingRecord(updated);
  }

  async deletePricingPackage(id: string) {
    return prisma.pricingPackage.delete({
      where: { id },
    });
  }
}

export const serviceRepository = new ServiceRepository();
