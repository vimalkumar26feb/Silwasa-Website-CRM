import { Request, Response } from 'express';
import { CreateEnquirySchema, UpdateEnquiryStatusSchema, AddEnquiryNoteSchema } from '@silwasa/validation';
import { enquiryService } from '../services/enquiry.service.js';

export class EnquiryController {
  async submitEnquiry(req: Request, res: Response): Promise<void> {
    try {
      const parsed = CreateEnquirySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors
        });
        return;
      }

      const enquiry = await enquiryService.submitEnquiry(parsed.data);
      res.status(201).json({
        success: true,
        message: 'Your enquiry has been received. Our team will contact you shortly.',
        data: {
          id: enquiry.id,
          enquiryId: enquiry.enquiryId,
          name: enquiry.name,
          email: enquiry.email,
          createdAt: enquiry.createdAt
        }
      });
    } catch (err) {
      console.error('Enquiry submission error:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to submit enquiry'
      });
    }
  }

  async listEnquiries(req: Request, res: Response): Promise<void> {
    try {
      const { status, search, page, limit } = req.query;
      const result = await enquiryService.listEnquiries({
        status: status as string | undefined,
        search: search as string | undefined,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      console.error('List enquiries error:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve enquiries'
      });
    }
  }

  async getEnquiry(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const enquiry = await enquiryService.getEnquiry(id);
      res.status(200).json({
        success: true,
        data: enquiry
      });
    } catch (err) {
      const message = (err as Error).message;
      if (message === 'Enquiry not found') {
        res.status(404).json({ success: false, error: message });
        return;
      }
      res.status(500).json({ success: false, error: 'Failed to retrieve enquiry' });
    }
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const parsed = UpdateEnquiryStatusSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors
        });
        return;
      }

      const authorName = (req as any).user?.name || 'Admin';
      const updated = await enquiryService.updateStatus(
        id,
        parsed.data.status,
        parsed.data.note,
        authorName,
        parsed.data.assignedUserId
      );

      res.status(200).json({
        success: true,
        message: 'Enquiry status updated successfully',
        data: updated
      });
    } catch (err) {
      const message = (err as Error).message;
      if (message === 'Enquiry not found') {
        res.status(404).json({ success: false, error: message });
        return;
      }
      res.status(500).json({ success: false, error: 'Failed to update enquiry status' });
    }
  }

  async addNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const parsed = AddEnquiryNoteSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors
        });
        return;
      }

      const userId = (req as any).user?.userId;
      const authorName = parsed.data.authorName || (req as any).user?.name || 'Admin';
      const note = await enquiryService.addNote(id, parsed.data.content, authorName, userId);

      res.status(201).json({
        success: true,
        message: 'Note added successfully',
        data: note
      });
    } catch (err) {
      const message = (err as Error).message;
      if (message === 'Enquiry not found') {
        res.status(404).json({ success: false, error: message });
        return;
      }
      res.status(500).json({ success: false, error: 'Failed to add note' });
    }
  }

  async deleteEnquiry(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await enquiryService.deleteEnquiry(id);
      res.status(200).json({
        success: true,
        message: 'Enquiry deleted successfully'
      });
    } catch (err) {
      const message = (err as Error).message;
      if (message === 'Enquiry not found') {
        res.status(404).json({ success: false, error: message });
        return;
      }
      res.status(500).json({ success: false, error: 'Failed to delete enquiry' });
    }
  }

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await enquiryService.getStats();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      console.error('Enquiry stats error:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve enquiry statistics'
      });
    }
  }
}

export const enquiryController = new EnquiryController();
