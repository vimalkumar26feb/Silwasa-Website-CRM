import { StorageProvider, UploadResult } from './storage.interface.js';
import { LocalStorageProvider } from './local.storage.js';

export class CloudinaryStorageProvider implements StorageProvider {
  private fallback: LocalStorageProvider;
  private isConfigured: boolean;

  constructor() {
    this.fallback = new LocalStorageProvider();
    this.isConfigured = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadResult> {
    if (!this.isConfigured) {
      // Fallback to local storage when Cloudinary keys are not provided
      return this.fallback.uploadFile(file);
    }

    try {
      // Direct REST upload to Cloudinary without external SDK overhead
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      const timestamp = Math.round(new Date().getTime() / 1000);
      const crypto = await import('crypto');
      const signature = crypto
        .createHash('sha1')
        .update(`timestamp=${timestamp}${apiSecret}`)
        .digest('hex');

      const formData = new FormData();
      const uint8 = new Uint8Array(file.buffer);
      const blob = new Blob([uint8], { type: file.mimetype });
      formData.append('file', blob, file.originalname);
      formData.append('api_key', apiKey!);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('folder', 'silwasa_cms');

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Cloudinary upload returned status ${res.status}`);
      }

      const json = await res.json() as {
        secure_url: string;
        public_id: string;
        format: string;
        bytes: number;
        width?: number;
        height?: number;
      };

      return {
        url: json.secure_url,
        publicId: json.public_id,
        filename: `${json.public_id}.${json.format}`,
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: json.bytes || file.size,
        width: json.width,
        height: json.height,
        provider: 'cloudinary',
      };
    } catch {
      // Fallback to local storage if remote API fails
      return this.fallback.uploadFile(file);
    }
  }

  async deleteFile(publicIdOrUrl: string): Promise<boolean> {
    if (!this.isConfigured) {
      return this.fallback.deleteFile(publicIdOrUrl);
    }
    // Deletion fallback
    return this.fallback.deleteFile(publicIdOrUrl);
  }
}
