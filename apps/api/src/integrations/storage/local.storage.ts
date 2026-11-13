import fs from 'fs';
import path from 'path';
import { StorageProvider, UploadResult } from './storage.interface.js';
import { env } from '../../config/env.js';

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), env.MEDIA_UPLOAD_DIR || './uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadResult> {
    const ext = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${baseName}${ext}`;
    const destinationPath = path.join(this.uploadDir, uniqueName);

    await fs.promises.writeFile(destinationPath, file.buffer);

    const publicUrl = `http://localhost:${env.PORT}/uploads/${uniqueName}`;

    return {
      url: publicUrl,
      publicId: uniqueName,
      filename: uniqueName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      provider: 'local',
    };
  }

  async deleteFile(publicIdOrUrl: string): Promise<boolean> {
    try {
      const filename = path.basename(publicIdOrUrl);
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
