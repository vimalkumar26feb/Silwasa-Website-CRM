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

    let uniqueName = `${baseName}${ext}`;
    let destinationPath = path.join(this.uploadDir, uniqueName);

    // If file already exists on disk, append postfix like -01, -02 or timestamp at the end of filename
    if (fs.existsSync(destinationPath)) {
      let counter = 1;
      let candidate = `${baseName}-${String(counter).padStart(2, '0')}${ext}`;
      while (fs.existsSync(path.join(this.uploadDir, candidate))) {
        counter++;
        candidate = `${baseName}-${String(counter).padStart(2, '0')}${ext}`;
        if (counter > 99) {
          candidate = `${baseName}-${Date.now()}${ext}`;
          break;
        }
      }
      uniqueName = candidate;
      destinationPath = path.join(this.uploadDir, uniqueName);
    }

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
