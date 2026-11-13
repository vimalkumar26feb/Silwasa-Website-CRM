import { prisma } from '../db/client.js';

export interface CreateEnquiryInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  service?: string;
  budget?: string;
  message: string;
  sourcePage?: string;
}

export interface ListEnquiriesQuery {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class EnquiryRepository {
  private generateEnquiryId(): string {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ENQ-${dateStr}-${rand}`;
  }

  async create(data: CreateEnquiryInput) {
    const enquiryId = this.generateEnquiryId();
    return prisma.enquiry.create({
      data: {
        enquiryId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        country: data.country,
        service: data.service,
        budget: data.budget,
        message: data.message,
        sourcePage: data.sourcePage,
        status: 'NEW'
      }
    });
  }

  async findById(id: string) {
    return prisma.enquiry.findFirst({
      where: {
        OR: [{ id }, { enquiryId: id }]
      },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        assignedUser: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async list(query: ListEnquiriesQuery = {}) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status && query.status !== 'ALL') {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
        { company: { contains: query.search, mode: 'insensitive' } },
        { enquiryId: { contains: query.search, mode: 'insensitive' } },
        { service: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const [items, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          notes: {
            orderBy: { createdAt: 'desc' },
            take: 1
          },
          assignedUser: {
            select: { id: true, name: true }
          }
        }
      }),
      prisma.enquiry.count({ where })
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async updateStatus(id: string, status: string, note?: string, authorName = 'System', assignedUserId?: string | null) {
    const updateData: any = { status };
    if (assignedUserId !== undefined) {
      updateData.assignedUserId = assignedUserId;
    }

    if (note && note.trim()) {
      updateData.notes = {
        create: {
          content: note.trim(),
          authorName
        }
      };
    }

    return prisma.enquiry.update({
      where: { id },
      data: updateData,
      include: {
        notes: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  async addNote(enquiryId: string, content: string, authorName: string, userId?: string) {
    return prisma.enquiryNote.create({
      data: {
        enquiryId,
        content,
        authorName,
        userId
      }
    });
  }

  async delete(id: string) {
    return prisma.enquiry.delete({
      where: { id }
    });
  }

  async getStats() {
    const [total, newCount, contacted, inProgress, converted, closed] = await Promise.all([
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: 'NEW' } }),
      prisma.enquiry.count({ where: { status: 'CONTACTED' } }),
      prisma.enquiry.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.enquiry.count({ where: { status: 'CONVERTED' } }),
      prisma.enquiry.count({ where: { status: 'CLOSED' } })
    ]);

    return {
      total,
      new: newCount,
      contacted,
      inProgress,
      converted,
      closed
    };
  }
}

export const enquiryRepository = new EnquiryRepository();
