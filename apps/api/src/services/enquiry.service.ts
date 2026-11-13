import { enquiryRepository, CreateEnquiryInput, ListEnquiriesQuery } from '../repositories/enquiry.repository.js';
import { notificationEmailService } from '../integrations/email/index.js';

export class EnquiryService {
  async submitEnquiry(input: CreateEnquiryInput) {
    // 1. Persist directly to PostgreSQL
    const enquiry = await enquiryRepository.create(input);

    // 2. Dispatch email notifications asynchronously (resilient background task)
    // We intentionally do not await or fail the client request if email dispatch fails
    notificationEmailService.sendEnquiryEmails({
      enquiryId: enquiry.enquiryId,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      company: enquiry.company,
      country: enquiry.country,
      service: enquiry.service,
      budget: enquiry.budget,
      message: enquiry.message,
      sourcePage: enquiry.sourcePage,
      createdAt: enquiry.createdAt
    }).catch(err => {
      console.error('[EnquiryService] Asynchronous email dispatch failed for enquiry:', enquiry.enquiryId, err);
    });

    return enquiry;
  }

  async getEnquiry(id: string) {
    const enquiry = await enquiryRepository.findById(id);
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }
    return enquiry;
  }

  async listEnquiries(query: ListEnquiriesQuery) {
    return enquiryRepository.list(query);
  }

  async updateStatus(id: string, status: string, note?: string, authorName = 'Admin', assignedUserId?: string | null) {
    const existing = await enquiryRepository.findById(id);
    if (!existing) {
      throw new Error('Enquiry not found');
    }

    return enquiryRepository.updateStatus(id, status, note, authorName, assignedUserId);
  }

  async addNote(enquiryId: string, content: string, authorName: string, userId?: string) {
    const existing = await enquiryRepository.findById(enquiryId);
    if (!existing) {
      throw new Error('Enquiry not found');
    }

    return enquiryRepository.addNote(enquiryId, content, authorName, userId);
  }

  async deleteEnquiry(id: string) {
    const existing = await enquiryRepository.findById(id);
    if (!existing) {
      throw new Error('Enquiry not found');
    }

    return enquiryRepository.delete(id);
  }

  async getStats() {
    return enquiryRepository.getStats();
  }
}

export const enquiryService = new EnquiryService();
