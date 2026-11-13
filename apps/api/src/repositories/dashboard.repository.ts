import { prisma } from '../db/client.js';

export class DashboardRepository {
  async getMetrics() {
    try {
      const [
        totalEnquiries,
        newEnquiries,
        totalPages,
        publishedPages,
        totalPosts,
        totalServices,
        totalMedia,
        recentLogs,
        recentEnquiries,
      ] = await Promise.all([
        prisma.enquiry.count().catch(() => 0),
        prisma.enquiry.count({ where: { status: 'NEW' } }).catch(() => 0),
        prisma.page.count().catch(() => 0),
        prisma.page.count({ where: { isPublished: true } }).catch(() => 0),
        prisma.blogPost.count().catch(() => 0),
        prisma.service.count().catch(() => 0),
        prisma.mediaItem.count().catch(() => 0),
        prisma.activityLog.findMany({
          take: 8,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            userName: true,
            action: true,
            module: true,
            createdAt: true,
          },
        }).catch(() => []),
        prisma.enquiry.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            enquiryId: true,
            name: true,
            email: true,
            service: true,
            status: true,
            createdAt: true,
          },
        }).catch(() => []),
      ]);

      return {
        metrics: {
          totalEnquiries,
          newEnquiries,
          totalPages,
          publishedPages,
          totalPosts,
          totalServices,
          totalMedia,
        },
        recentLogs,
        recentEnquiries,
      };
    } catch {
      // Return safe defaults if database is temporarily disconnected
      return {
        metrics: {
          totalEnquiries: 0,
          newEnquiries: 0,
          totalPages: 0,
          publishedPages: 0,
          totalPosts: 0,
          totalServices: 0,
          totalMedia: 0,
        },
        recentLogs: [],
        recentEnquiries: [],
      };
    }
  }
}

export const dashboardRepository = new DashboardRepository();
