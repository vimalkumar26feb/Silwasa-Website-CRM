import { prisma } from '../db/client.js';

export class MediaRepository {
  async create(data: {
    filename: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    width?: number | null;
    height?: number | null;
    url: string;
    publicId?: string | null;
    altText?: string | null;
    title?: string | null;
    provider: string;
  }) {
    return prisma.mediaItem.create({
      data: {
        filename: data.filename,
        originalName: data.originalName,
        mimeType: data.mimeType,
        sizeBytes: data.sizeBytes,
        width: data.width,
        height: data.height,
        url: data.url,
        publicId: data.publicId,
        altText: data.altText,
        title: data.title,
        provider: data.provider,
      },
    });
  }

  async findById(id: string) {
    return prisma.mediaItem.findUnique({
      where: { id },
    });
  }

  async countByBaseName(baseName: string, ext: string): Promise<number> {
    return prisma.mediaItem.count({
      where: {
        originalName: {
          startsWith: baseName,
          endsWith: ext,
          mode: 'insensitive',
        },
      },
    });
  }

  async existsByOriginalName(originalName: string): Promise<boolean> {
    const count = await prisma.mediaItem.count({
      where: {
        originalName: {
          equals: originalName,
          mode: 'insensitive',
        },
      },
    });
    return count > 0;
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 24;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (params.search) {
      where.OR = [
        { originalName: { contains: params.search, mode: 'insensitive' } },
        { title: { contains: params.search, mode: 'insensitive' } },
        { altText: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.type) {
      if (params.type === 'image') {
        where.mimeType = { startsWith: 'image/' };
      } else if (params.type === 'document') {
        where.mimeType = { in: ['application/pdf', 'application/msword', 'text/plain'] };
      }
    }

    const [items, total] = await Promise.all([
      prisma.mediaItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.mediaItem.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: { altText?: string; title?: string }) {
    return prisma.mediaItem.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.mediaItem.delete({
      where: { id },
    });
  }
}

export const mediaRepository = new MediaRepository();
