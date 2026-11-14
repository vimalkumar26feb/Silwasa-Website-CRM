import { settingsRepository } from '../repositories/settings.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { DEFAULT_THEME, DEFAULT_BRANDING } from '@silwasa/shared';
import { ThemeSettings, GeneralSettings } from '@silwasa/types';

export class SettingsService {
  async getPublicSettings() {
    const [theme, branding, seo, popup] = await Promise.all([
      settingsRepository.getSetting<ThemeSettings>('theme'),
      settingsRepository.getSetting<GeneralSettings>('branding'),
      settingsRepository.getSetting<any>('seo'),
      settingsRepository.getSetting<any>('popup'),
    ]);

    return {
      theme: theme || DEFAULT_THEME,
      branding: branding || DEFAULT_BRANDING,
      general: branding || DEFAULT_BRANDING,
      seo: seo || {
        metaTitle: 'Silwasa IT Solutions | AI-Powered Web, Mobile & Enterprise Software',
        metaDescription: 'Silwasa IT Solutions engineers high-performance web platforms and AI systems.',
        googleAnalyticsId: '',
        googleTagManagerId: '',
        googleSearchConsoleVerification: '',
      },
      popup: popup || {
        isEnabled: false,
        title: 'Exclusive Digital Architecture Consultation',
        badge: 'LIMITED COMPLIMENTARY ACCESS',
        description: 'Book a 1-on-1 enterprise architecture discovery session with our lead engineering team.',
        discountCode: 'SILWASA-VIP',
        ctaText: 'Claim Your Strategy Call',
        ctaUrl: '/contact',
        showNewsletterForm: true,
        triggerType: 'timer',
        delaySeconds: 5,
        scrollPercentage: 30,
      },
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

  async getSeoSettings() {
    const raw = await settingsRepository.getSetting<any>('seo');
    return raw || {
      metaTitle: 'Silwasa IT Solutions | AI-Powered Web, Mobile & Enterprise Software Development',
      metaDescription: 'Silwasa IT Solutions engineers high-performance web platforms, enterprise software, AI solutions, and Generative Engine Optimization (GEO).',
      metaKeywords: 'Next.js 15, Web Development, Custom Software, Generative Engine Optimization, React 19, Silwasa',
      canonicalUrl: 'https://silwasa.com',
      ogImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      twitterHandle: '@silwasasolutions',
      googleAnalyticsId: '',
      googleTagManagerId: '',
      googleSearchConsoleVerification: '',
      bingWebmasterVerification: '',
      robotsIndex: true,
      robotsFollow: true,
    };
  }

  async updateSeoSettings(data: any, userId: string, userName: string) {
    await settingsRepository.setSetting('seo', data);
    await userRepository.logActivity({
      userId,
      userName,
      action: 'UPDATE_SEO_SETTINGS',
      module: 'SETTINGS',
      details: { metaTitle: data.metaTitle, gaId: data.googleAnalyticsId },
    });
    return data;
  }

  async getPopupSettings() {
    const raw = await settingsRepository.getSetting<any>('popup');
    return raw || {
      isEnabled: true,
      title: 'Accelerate Your Product Pipeline With Dedicated Senior Engineers',
      badge: 'LIMITED ARCHITECTURE CONSULTATION',
      description: 'Receive a custom technical review of your software architecture, Core Web Vitals, and AI search readiness from our engineering leads.',
      discountCode: 'SILWASA-SPRINT',
      ctaText: 'Claim Your Strategy Call',
      ctaUrl: '/contact',
      showNewsletterForm: true,
      triggerType: 'timer',
      delaySeconds: 5,
      scrollPercentage: 35,
    };
  }

  async updatePopupSettings(data: any, userId: string, userName: string) {
    await settingsRepository.setSetting('popup', data);
    await userRepository.logActivity({
      userId,
      userName,
      action: 'UPDATE_POPUP_SETTINGS',
      module: 'SETTINGS',
      details: { isEnabled: data.isEnabled, trigger: data.triggerType },
    });
    return data;
  }

  async getNewsletterSubscribers() {
    const list = await settingsRepository.getSetting<any[]>('newsletter_subscribers');
    return list || [
      { id: 'sub-1', email: 'techlead@enterprise.com', source: 'Blog Footer', status: 'SUBSCRIBED', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 'sub-2', email: 'founder@fintechscale.io', source: 'Promotional Popup', status: 'SUBSCRIBED', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
      { id: 'sub-3', email: 'cto@novacura.org', source: 'Case Study Download', status: 'SUBSCRIBED', createdAt: new Date(Date.now() - 86400000 * 9).toISOString() },
    ];
  }

  async addNewsletterSubscriber(email: string, source = 'Website') {
    const list = (await settingsRepository.getSetting<any[]>('newsletter_subscribers')) || [];
    const existing = list.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return existing;
    }
    const newSub = {
      id: `sub-${Date.now()}`,
      email: email.trim().toLowerCase(),
      source,
      status: 'SUBSCRIBED',
      createdAt: new Date().toISOString(),
    };
    const updated = [newSub, ...list];
    await settingsRepository.setSetting('newsletter_subscribers', updated);
    return newSub;
  }

  async deleteNewsletterSubscriber(id: string) {
    const list = (await settingsRepository.getSetting<any[]>('newsletter_subscribers')) || [];
    const updated = list.filter((s) => s.id !== id);
    await settingsRepository.setSetting('newsletter_subscribers', updated);
    return { success: true };
  }
}

export const settingsService = new SettingsService();
