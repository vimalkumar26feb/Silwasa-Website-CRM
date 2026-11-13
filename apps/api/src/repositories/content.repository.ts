import { prisma } from '../db/client.js';

export class ContentRepository {
  // Testimonials
  async findTestimonials(featuredOnly = false) {
    return prisma.testimonial.findMany({
      where: featuredOnly ? { isFeatured: true } : undefined,
      orderBy: { order: 'asc' }
    });
  }

  async createTestimonial(data: {
    clientName: string;
    clientRole: string;
    clientCompany: string;
    clientAvatarUrl?: string | null;
    content: string;
    rating?: number;
    isFeatured?: boolean;
    order?: number;
  }) {
    return prisma.testimonial.create({ data });
  }

  async updateTestimonial(id: string, data: any) {
    return prisma.testimonial.update({
      where: { id },
      data
    });
  }

  async deleteTestimonial(id: string) {
    return prisma.testimonial.delete({
      where: { id }
    });
  }

  // FAQs
  async findFaqs(publishedOnly = false) {
    return prisma.fAQItem.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      orderBy: [{ category: 'asc' }, { order: 'asc' }]
    });
  }

  async createFaq(data: {
    question: string;
    answer: string;
    category?: string;
    order?: number;
    isPublished?: boolean;
  }) {
    return prisma.fAQItem.create({ data });
  }

  async updateFaq(id: string, data: any) {
    return prisma.fAQItem.update({
      where: { id },
      data
    });
  }

  async deleteFaq(id: string) {
    return prisma.fAQItem.delete({
      where: { id }
    });
  }

  // Activity Logs
  async findActivityLogs(limit = 50) {
    return prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }
}

export const contentRepository = new ContentRepository();
