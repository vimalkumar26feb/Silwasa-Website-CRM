import { serviceRepository } from '../repositories/service.repository.js';
import { calculateEffectivePrice } from '@silwasa/shared';

export class ServiceService {
  // Services
  async getPublishedServices() {
    return serviceRepository.findPublishedServices();
  }

  async getServiceBySlug(slug: string) {
    const service = await serviceRepository.findServiceBySlug(slug, true);
    if (!service) {
      throw new Error('Service not found');
    }
    return service;
  }

  async getAllServices() {
    return serviceRepository.findAllServices();
  }

  async getServiceById(id: string) {
    const service = await serviceRepository.findServiceById(id);
    if (!service) {
      throw new Error('Service not found');
    }
    return service;
  }

  async createService(data: any) {
    const existing = await serviceRepository.findServiceBySlug(data.slug, false);
    if (existing) {
      throw new Error(`A service with slug '${data.slug}' already exists`);
    }
    return serviceRepository.createService(data);
  }

  async updateService(id: string, data: any) {
    const existing = await serviceRepository.findServiceById(id);
    if (!existing) {
      throw new Error('Service not found');
    }

    if (data.slug && data.slug !== existing.slug) {
      const conflict = await serviceRepository.findServiceBySlug(data.slug, false);
      if (conflict && conflict.id !== id) {
        throw new Error(`A service with slug '${data.slug}' already exists`);
      }
    }

    return serviceRepository.updateService(id, data);
  }

  async deleteService(id: string) {
    const existing = await serviceRepository.findServiceById(id);
    if (!existing) {
      throw new Error('Service not found');
    }
    return serviceRepository.deleteService(id);
  }

  // Pricing Packages
  async getPricingPackages(serviceId?: string, onlyActive = true) {
    const packages = await serviceRepository.findPricingPackages({ serviceId, onlyActive });

    return packages.map((pkg) => {
      const regularPriceNum = Number(pkg.regularPrice);
      const discountValueNum = pkg.discountValue ? Number(pkg.discountValue) : null;
      const discountTypeVal = pkg.discountType as 'PERCENTAGE' | 'FIXED' | null;

      const startDateStr = pkg.discountStartDate
        ? typeof pkg.discountStartDate === 'string'
          ? pkg.discountStartDate
          : (pkg.discountStartDate as Date).toISOString()
        : null;

      const endDateStr = pkg.discountEndDate
        ? typeof pkg.discountEndDate === 'string'
          ? pkg.discountEndDate
          : (pkg.discountEndDate as Date).toISOString()
        : null;

      const calc = calculateEffectivePrice(
        regularPriceNum,
        discountTypeVal,
        discountValueNum,
        startDateStr,
        endDateStr
      );

      return {
        ...pkg,
        effectivePrice: calc.effectivePrice,
        hasActiveDiscount: calc.hasActiveDiscount,
        discountAmount: calc.discountAmount,
      };
    });
  }

  async getPricingPackageById(id: string) {
    const pkg = await serviceRepository.findPricingPackageById(id);
    if (!pkg) {
      throw new Error('Pricing package not found');
    }
    return pkg;
  }

  async createPricingPackage(data: any) {
    return serviceRepository.createPricingPackage(data);
  }

  async updatePricingPackage(id: string, data: any) {
    const existing = await serviceRepository.findPricingPackageById(id);
    if (!existing) {
      throw new Error('Pricing package not found');
    }
    return serviceRepository.updatePricingPackage(id, data);
  }

  async deletePricingPackage(id: string) {
    const existing = await serviceRepository.findPricingPackageById(id);
    if (!existing) {
      throw new Error('Pricing package not found');
    }
    return serviceRepository.deletePricingPackage(id);
  }
}

export const serviceService = new ServiceService();
