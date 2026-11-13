import { settingsRepository } from '../repositories/settings.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { DEFAULT_THEME, DEFAULT_BRANDING } from '@silwasa/shared';
import { ThemeSettings, GeneralSettings } from '@silwasa/types';

export class SettingsService {
  async getPublicSettings() {
    const [theme, branding] = await Promise.all([
      settingsRepository.getSetting<ThemeSettings>('theme'),
      settingsRepository.getSetting<GeneralSettings>('branding'),
    ]);

    return {
      theme: theme || DEFAULT_THEME,
      branding: branding || DEFAULT_BRANDING,
    };
  }

  async getThemeSettings(): Promise<ThemeSettings> {
    const theme = await settingsRepository.getSetting<ThemeSettings>('theme');
    return theme || (DEFAULT_THEME as unknown as ThemeSettings);
  }

  async updateThemeSettings(data: ThemeSettings, userId: string, userName: string) {
    await settingsRepository.setSetting('theme', data);
    await userRepository.logActivity({
      userId,
      userName,
      action: 'UPDATE_THEME',
      module: 'SETTINGS',
      details: { colors: data.colors },
    });
    return data;
  }

  async getGeneralSettings(): Promise<GeneralSettings> {
    const branding = await settingsRepository.getSetting<GeneralSettings>('branding');
    return branding || (DEFAULT_BRANDING as unknown as GeneralSettings);
  }

  async updateGeneralSettings(data: GeneralSettings, userId: string, userName: string) {
    await settingsRepository.setSetting('branding', data);
    await userRepository.logActivity({
      userId,
      userName,
      action: 'UPDATE_SETTINGS',
      module: 'SETTINGS',
      details: { siteName: data.siteName, email: data.contactEmail },
    });
    return data;
  }

  async getEmailSettings() {
    const raw = await settingsRepository.getSetting<any>('email');
    const settings = raw || {
      provider: process.env.EMAIL_PROVIDER || 'mock',
      fromEmail: process.env.EMAIL_FROM || 'contact@silwasa.com',
      fromName: process.env.EMAIL_FROM_NAME || 'Silwasa IT Solutions',
      adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'contact@silwasa.com',
      brevoApiKey: process.env.BREVO_API_KEY ? 'configured-in-env' : '',
      sendgridApiKey: process.env.SENDGRID_API_KEY ? 'configured-in-env' : '',
      gmailUser: process.env.GMAIL_USER || '',
      gmailAppPassword: process.env.GMAIL_APP_PASSWORD ? 'configured-in-env' : ''
    };

    return settings;
  }

  async updateEmailSettings(data: any, userId: string, userName: string) {
    await settingsRepository.setSetting('email', data);
    await userRepository.logActivity({
      userId,
      userName,
      action: 'UPDATE_EMAIL_SETTINGS',
      module: 'SETTINGS',
      details: { provider: data.provider, fromEmail: data.fromEmail }
    });
    return data;
  }
}

export const settingsService = new SettingsService();
