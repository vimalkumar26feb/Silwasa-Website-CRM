import { prisma } from '../db/client.js';

export class SettingsRepository {
  async getSetting<T = unknown>(key: string): Promise<T | null> {
    try {
      const record = await prisma.siteSetting.findUnique({
        where: { key },
      });
      return (record?.value as T) || null;
    } catch {
      return null;
    }
  }

  async setSetting(key: string, value: unknown) {
    return prisma.siteSetting.upsert({
      where: { key },
      update: { value: value as object },
      create: {
        key,
        value: value as object,
      },
    });
  }
}

export const settingsRepository = new SettingsRepository();
