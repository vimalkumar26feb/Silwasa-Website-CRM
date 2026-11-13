import { Request, Response } from 'express';
import { industryRepository } from '../repositories/industry.repository.js';
import { portfolioRepository } from '../repositories/portfolio.repository.js';
import { contentRepository } from '../repositories/content.repository.js';

export class ExtraContentController {
  // Industries
  async getPublicIndustries(_req: Request, res: Response): Promise<void> {
    try {
      const items = await industryRepository.findPublished();
      res.status(200).json({ success: true, data: items });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to fetch industries' });
    }
  }

  async getPublicIndustryBySlug(req: Request, res: Response): Promise<void> {
    try {
      const item = await industryRepository.findBySlug(req.params.slug);
      if (!item) {
        res.status(404).json({ success: false, error: 'Industry not found' });
        return;
      }
      res.status(200).json({ success: true, data: item });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to fetch industry' });
    }
  }

  async getAdminIndustries(_req: Request, res: Response): Promise<void> {
    try {
      const items = await industryRepository.listAll();
      res.status(200).json({ success: true, data: items });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to fetch admin industries' });
    }
  }

  async createIndustry(req: Request, res: Response): Promise<void> {
    try {
      const item = await industryRepository.create(req.body);
      res.status(201).json({ success: true, data: item, message: 'Industry created successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to create industry' });
    }
  }

  async updateIndustry(req: Request, res: Response): Promise<void> {
    try {
      const item = await industryRepository.update(req.params.id, req.body);
      res.status(200).json({ success: true, data: item, message: 'Industry updated successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to update industry' });
    }
  }

  async deleteIndustry(req: Request, res: Response): Promise<void> {
    try {
      await industryRepository.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Industry deleted successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to delete industry' });
    }
  }

  // Portfolio
  async getPublicPortfolio(_req: Request, res: Response): Promise<void> {
    try {
      const items = await portfolioRepository.findPublished();
      res.status(200).json({ success: true, data: items });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to fetch portfolio projects' });
    }
  }

  async getPublicPortfolioBySlug(req: Request, res: Response): Promise<void> {
    try {
      const item = await portfolioRepository.findBySlug(req.params.slug);
      if (!item) {
        res.status(404).json({ success: false, error: 'Project not found' });
        return;
      }
      res.status(200).json({ success: true, data: item });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to fetch project' });
    }
  }

  async getAdminPortfolio(_req: Request, res: Response): Promise<void> {
    try {
      const items = await portfolioRepository.listAll();
      res.status(200).json({ success: true, data: items });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to fetch admin portfolio' });
    }
  }

  async createPortfolio(req: Request, res: Response): Promise<void> {
    try {
      const item = await portfolioRepository.create(req.body);
      res.status(201).json({ success: true, data: item, message: 'Portfolio project created successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to create project' });
    }
  }

  async updatePortfolio(req: Request, res: Response): Promise<void> {
    try {
      const item = await portfolioRepository.update(req.params.id, req.body);
      res.status(200).json({ success: true, data: item, message: 'Portfolio project updated successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to update project' });
    }
  }

  async deletePortfolio(req: Request, res: Response): Promise<void> {
    try {
      await portfolioRepository.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Portfolio project deleted successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to delete project' });
    }
  }

  // Testimonials
  async getPublicTestimonials(_req: Request, res: Response): Promise<void> {
    try {
      const items = await contentRepository.findTestimonials();
      res.status(200).json({ success: true, data: items });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to fetch testimonials' });
    }
  }

  async createTestimonial(req: Request, res: Response): Promise<void> {
    try {
      const item = await contentRepository.createTestimonial(req.body);
      res.status(201).json({ success: true, data: item, message: 'Testimonial added' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to add testimonial' });
    }
  }

  async updateTestimonial(req: Request, res: Response): Promise<void> {
    try {
      const item = await contentRepository.updateTestimonial(req.params.id, req.body);
      res.status(200).json({ success: true, data: item, message: 'Testimonial updated' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to update testimonial' });
    }
  }

  async deleteTestimonial(req: Request, res: Response): Promise<void> {
    try {
      await contentRepository.deleteTestimonial(req.params.id);
      res.status(200).json({ success: true, message: 'Testimonial deleted' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to delete testimonial' });
    }
  }

  // FAQs
  async getPublicFaqs(_req: Request, res: Response): Promise<void> {
    try {
      const items = await contentRepository.findFaqs(true);
      res.status(200).json({ success: true, data: items });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to fetch FAQs' });
    }
  }

  async getAdminFaqs(_req: Request, res: Response): Promise<void> {
    try {
      const items = await contentRepository.findFaqs(false);
      res.status(200).json({ success: true, data: items });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to fetch admin FAQs' });
    }
  }

  async createFaq(req: Request, res: Response): Promise<void> {
    try {
      const item = await contentRepository.createFaq(req.body);
      res.status(201).json({ success: true, data: item, message: 'FAQ created' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to create FAQ' });
    }
  }

  async updateFaq(req: Request, res: Response): Promise<void> {
    try {
      const item = await contentRepository.updateFaq(req.params.id, req.body);
      res.status(200).json({ success: true, data: item, message: 'FAQ updated' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to update FAQ' });
    }
  }

  async deleteFaq(req: Request, res: Response): Promise<void> {
    try {
      await contentRepository.deleteFaq(req.params.id);
      res.status(200).json({ success: true, message: 'FAQ deleted' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to delete FAQ' });
    }
  }

  // Activity Logs
  async getAdminActivityLogs(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const logs = await contentRepository.findActivityLogs(limit);
      res.status(200).json({ success: true, data: logs });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to fetch activity logs' });
    }
  }
}

export const extraContentController = new ExtraContentController();
