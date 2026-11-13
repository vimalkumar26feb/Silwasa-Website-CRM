import { StorageProvider } from './storage.interface.js';
import { LocalStorageProvider } from './local.storage.js';
import { CloudinaryStorageProvider } from './cloudinary.storage.js';

let storageInstance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!storageInstance) {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      storageInstance = new CloudinaryStorageProvider();
    } else {
      storageInstance = new LocalStorageProvider();
    }
  }
  return storageInstance;
}

export * from './storage.interface.js';
