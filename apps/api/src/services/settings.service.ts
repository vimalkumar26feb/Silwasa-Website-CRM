import { settingsRepository } from '../repositories/settings.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { DEFAULT_THEME, DEFAULT_BRANDING } from '@silwasa/shared';
import { ThemeSettings, GeneralSettings } from '@silwasa/types';

export class SettingsService {
  async getPublicSettings() {
    const [theme, branding, seo, popupsList, singlePopup] = await Promise.all([
      settingsRepository.getSetting<ThemeSettings>('theme'),
      settingsRepository.getSetting<GeneralSettings>('branding'),
      settingsRepository.getSetting<any>('seo'),
      settingsRepository.getSetting<any[]>('popups_list'),
      settingsRepository.getSetting<any>('popup'),
    ]);

    const resolvedPopups =
      popupsList && Array.isArray(popupsList) && popupsList.length > 0
        ? popupsList
        : singlePopup
        ? [singlePopup]
        : [];

    const activePopup =
      resolvedPopups.find((p: any) => p.isEnabled) ||
      resolvedPopups[0] ||
      singlePopup || {
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
      };

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
      popup: activePopup,
      popups: resolvedPopups,
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
    let list = await settingsRepository.getSetting<any[]>('popups_list');
    if (!list || !Array.isArray(list) || list.length === 0) {
      const raw = await settingsRepository.getSetting<any>('popup');
      const initialPopup = {
        id: raw?.id || 'popup-default',
        name: raw?.name || 'Default Strategy Consultation Offer',
        isEnabled: raw !== undefined && raw !== null ? Boolean(raw.isEnabled) : true,
        title: raw?.title || 'Accelerate Your Product Pipeline With Dedicated Senior Engineers',
        badge: raw?.badge || 'LIMITED ARCHITECTURE CONSULTATION',
        description:
          raw?.description ||
          'Receive a custom technical review of your software architecture, Core Web Vitals, and AI search readiness from our engineering leads.',
        imageUrl: raw?.imageUrl || '',
        discountCode: raw?.discountCode || 'SILWASA-SPRINT',
        ctaText: raw?.ctaText || 'Claim Your Strategy Call',
        ctaUrl: raw?.ctaUrl || '/contact',
        showNewsletterForm: raw?.showNewsletterForm !== undefined ? Boolean(raw.showNewsletterForm) : true,
        triggerType: raw?.triggerType || 'timer',
        delaySeconds: raw?.delaySeconds || 5,
        scrollPercentage: raw?.scrollPercentage || 35,
        createdAt: new Date().toISOString(),
      };
      list = [initialPopup];
      await settingsRepository.setSetting('popups_list', list);
      await settingsRepository.setSetting('popup', initialPopup);
    }

    const activePopup = list.find((p: any) => p.isEnabled) || list[0];
    return {
      list,
      activePopup,
      ...activePopup,
    };
  }

  async createPopup(data: any, userId: string, userName: string) {
    const list = (await settingsRepository.getSetting<any[]>('popups_list')) || [];
    const newPopup = {
      id: `popup-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: data.name || data.title?.substring(0, 35) || 'New Promotional Offer',
      isEnabled: data.isEnabled !== undefined ? Boolean(data.isEnabled) : false,
      title: data.title || 'Special Promotion',
      badge: data.badge || 'SPECIAL OFFER',
      description: data.description || '',
      imageUrl: data.imageUrl || '',
      discountCode: data.discountCode || '',
      ctaText: data.ctaText || 'Claim Offer',
      ctaUrl: data.ctaUrl || '/contact',
      showNewsletterForm: data.showNewsletterForm !== undefined ? Boolean(data.showNewsletterForm) : true,
      triggerType: data.triggerType || 'timer',
      delaySeconds: Number(data.delaySeconds) || 5,
      scrollPercentage: Number(data.scrollPercentage) || 35,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newPopup, ...list];
    await settingsRepository.setSetting('popups_list', updated);

    if (newPopup.isEnabled) {
      await settingsRepository.setSetting('popup', newPopup);
    }

    await userRepository.logActivity({
      userId,
      userName,
      action: 'CREATE_POPUP',
      module: 'SETTINGS',
      details: { id: newPopup.id, title: newPopup.title },
    });

    return newPopup;
  }

  async updatePopup(id: string, data: any, userId: string, userName: string) {
    const list = (await settingsRepository.getSetting<any[]>('popups_list')) || [];
    const index = list.findIndex((p: any) => p.id === id);

    if (index === -1) {
      return this.createPopup({ ...data, id }, userId, userName);
    }

    list[index] = {
      ...list[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };

    await settingsRepository.setSetting('popups_list', list);

    const activePopup = list.find((p: any) => p.isEnabled) || list[0];
    await settingsRepository.setSetting('popup', activePopup);

    await userRepository.logActivity({
      userId,
      userName,
      action: 'UPDATE_POPUP',
      module: 'SETTINGS',
      details: { id, title: list[index].title },
    });

    return list[index];
  }

  async deletePopup(id: string, userId: string, userName: string) {
    const list = (await settingsRepository.getSetting<any[]>('popups_list')) || [];
    const updated = list.filter((p: any) => p.id !== id);
    await settingsRepository.setSetting('popups_list', updated);

    const activePopup = updated.find((p: any) => p.isEnabled) || updated[0] || null;
    if (activePopup) {
      await settingsRepository.setSetting('popup', activePopup);
    }

    await userRepository.logActivity({
      userId,
      userName,
      action: 'DELETE_POPUP',
      module: 'SETTINGS',
      details: { id },
    });

    return { success: true };
  }

  async updatePopupSettings(data: any, userId: string, userName: string) {
    if (data.list && Array.isArray(data.list)) {
      await settingsRepository.setSetting('popups_list', data.list);
      const activePopup = data.list.find((p: any) => p.isEnabled) || data.list[0];
      if (activePopup) {
        await settingsRepository.setSetting('popup', activePopup);
      }
      return data;
    }

    await settingsRepository.setSetting('popup', data);
    const list = (await settingsRepository.getSetting<any[]>('popups_list')) || [];
    const popupId = data.id || 'popup-default';
    const index = list.findIndex((p: any) => p.id === popupId);
    if (index >= 0) {
      list[index] = { ...list[index], ...data };
    } else {
      list.push({ ...data, id: popupId });
    }
    await settingsRepository.setSetting('popups_list', list);

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
