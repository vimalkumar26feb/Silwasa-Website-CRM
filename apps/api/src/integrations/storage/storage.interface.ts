export interface UploadResult {
  url: string;
  publicId?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  provider: 'local' | 'cloudinary' | 's3';
}

export interface StorageProvider {
  uploadFile(file: Express.Multer.File): Promise<UploadResult>;
  deleteFile(publicIdOrUrl: string): Promise<boolean>;
}
