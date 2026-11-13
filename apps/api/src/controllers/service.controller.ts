import { Request, Response, NextFunction } from 'express';
import { serviceService } from '../services/service.service.js';
import { CreateServiceSchema, UpdateServiceSchema, CreatePricingPackageSchema, UpdatePricingPackageSchema } from '@silwasa/validation';

export class ServiceController {
  // Public Services
  async getPublishedServices(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await serviceService.getPublishedServices();
      return res.status(200).json({
        success: true,
        data: services,
      });
    } catch (err) {
      next(err);
    }
  }

  async getServiceBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const service = await serviceService.getServiceBySlug(slug).catch(() => null);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: `Service '${slug}' not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: service,
      });
    } catch (err) {
      next(err);
    }
  }

  // Public Pricing Packages
  async getPublicPricing(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId } = req.query;
      const packages = await serviceService.getPricingPackages(serviceId as string, true);
      return res.status(200).json({
        success: true,
        data: packages,
      });
    } catch (err) {
      next(err);
    }
  }

  // Admin Services
  async listAllServices(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await serviceService.getAllServices();
      return res.status(200).json({
        success: true,
        data: services,
      });
    } catch (err) {
      next(err);
    }
  }

  async getService(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const service = await serviceService.getServiceById(id);
      return res.status(200).json({
        success: true,
        data: service,
      });
    } catch (err) {
      next(err);
    }
  }

  async createService(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = CreateServiceSchema.parse(req.body);
      const service = await serviceService.createService(validated);
      return res.status(201).json({
        success: true,
        data: service,
        message: 'Service created successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async updateService(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = UpdateServiceSchema.parse(req.body);
      const service = await serviceService.updateService(id, validated);
      return res.status(200).json({
        success: true,
        data: service,
        message: 'Service updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await serviceService.deleteService(id);
      return res.status(200).json({
        success: true,
        message: 'Service deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  // Admin Pricing Packages
  async listAllPricing(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId } = req.query;
      const packages = await serviceService.getPricingPackages(serviceId as string, false);
      return res.status(200).json({
        success: true,
        data: packages,
      });
    } catch (err) {
      next(err);
    }
  }

  async createPricingPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = CreatePricingPackageSchema.parse(req.body);
      const pkg = await serviceService.createPricingPackage(validated);
      return res.status(201).json({
        success: true,
        data: pkg,
        message: 'Pricing package created successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async updatePricingPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = UpdatePricingPackageSchema.parse(req.body);
      const pkg = await serviceService.updatePricingPackage(id, validated);
      return res.status(200).json({
        success: true,
        data: pkg,
        message: 'Pricing package updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async deletePricingPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await serviceService.deletePricingPackage(id);
      return res.status(200).json({
        success: true,
        message: 'Pricing package deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}

export const serviceController = new ServiceController();
