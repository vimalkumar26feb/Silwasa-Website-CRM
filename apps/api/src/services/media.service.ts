import path from 'path';
import { mediaRepository } from '../repositories/media.repository.js';
import { getStorageProvider } from '../integrations/storage/index.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../middleware/errorHandler.js';

export class MediaService {
  async upload(file: Express.Multer.File, userId: string, userName: string) {
    if (!file) {
      const err: AppError = new Error('No file provided');
      err.statusCode = 400;
      throw err;
    }

    // Supported file types validation
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/gif',
      'application/pdf',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      const err: AppError = new Error(
        `Unsupported file format (${file.mimetype}). Allowed formats: JPG, PNG, WebP, SVG, GIF, PDF.`
      );
      err.statusCode = 400;
      throw err;
    }

    // 10 MB size restriction
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const err: AppError = new Error('File exceeds maximum allowed size of 10 MB.');
      err.statusCode = 400;
      throw err;
    }

    // Duplicate Filename Handling: automatically append -01, -02 or timestamp if filename exists
    const ext = path.extname(file.originalname);
    const rawBaseName = path.basename(file.originalname, ext);
    let finalOriginalName = file.originalname;

    const exists = await mediaRepository.existsByOriginalName(finalOriginalName);
    if (exists) {
      let counter = 1;
      let candidateName = `${rawBaseName}-${String(counter).padStart(2, '0')}${ext}`;
      while (await mediaRepository.existsByOriginalName(candidateName)) {
        counter++;
        candidateName = `${rawBaseName}-${String(counter).padStart(2, '0')}${ext}`;
        if (counter > 99) {
          candidateName = `${rawBaseName}-${Date.now()}${ext}`;
          break;
        }
      }
      finalOriginalName = candidateName;
      file.originalname = finalOriginalName;
    }

    const storage = getStorageProvider();
    const uploadResult = await storage.uploadFile(file);

    const media = await mediaRepository.create({
      filename: uploadResult.filename,
      originalName: uploadResult.originalName,
      mimeType: uploadResult.mimeType,
      sizeBytes: uploadResult.sizeBytes,
      width: uploadResult.width,
      height: uploadResult.height,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      provider: uploadResult.provider,
    });

    await userRepository.logActivity({
      userId,
      userName,
      action: 'UPLOAD_MEDIA',
      module: 'MEDIA',
      entityId: media.id,
      details: { filename: media.filename, sizeBytes: media.sizeBytes },
    });

    return media;
  }

  async listMedia(params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
  }) {
    return mediaRepository.findAll(params);
  }

  async updateMedia(
    id: string,
    data: { altText?: string; title?: string },
    userId: string,
    userName: string
  ) {
    const existing = await mediaRepository.findById(id);
    if (!existing) {
      const err: AppError = new Error('Media asset not found');
      err.statusCode = 404;
      throw err;
    }

    const updated = await mediaRepository.update(id, data);

    await userRepository.logActivity({
      userId,
      userName,
      action: 'UPDATE_MEDIA',
      module: 'MEDIA',
      entityId: id,
    });

    return updated;
  }

  async deleteMedia(id: string, userId: string, userName: string) {
    const existing = await mediaRepository.findById(id);
    if (!existing) {
      const err: AppError = new Error('Media asset not found');
      err.statusCode = 404;
      throw err;
    }

    if (existing.usageCount > 0) {
      const err: AppError = new Error(
        `Cannot delete media asset because it is currently in use across ${existing.usageCount} published items.`
      );
      err.statusCode = 409;
      throw err;
    }

    const storage = getStorageProvider();
    if (existing.publicId || existing.url) {
      await storage.deleteFile(existing.publicId || existing.url);
    }

    await mediaRepository.delete(id);

    await userRepository.logActivity({
      userId,
      userName,
      action: 'DELETE_MEDIA',
      module: 'MEDIA',
      entityId: id,
      details: { filename: existing.filename },
    });

    return true;
  }
}

export const mediaService = new MediaService();
