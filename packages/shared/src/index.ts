export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function calculateEffectivePrice(
  regularPrice: number,
  discountType?: 'PERCENTAGE' | 'FIXED' | null,
  discountValue?: number | null,
  startDate?: string | null,
  endDate?: string | null
): { effectivePrice: number; hasActiveDiscount: boolean; discountAmount: number } {
  if (!discountType || !discountValue || discountValue <= 0) {
    return { effectivePrice: regularPrice, hasActiveDiscount: false, discountAmount: 0 };
  }

  const now = new Date();
  if (startDate && new Date(startDate) > now) {
    return { effectivePrice: regularPrice, hasActiveDiscount: false, discountAmount: 0 };
  }
  if (endDate && new Date(endDate) < now) {
    return { effectivePrice: regularPrice, hasActiveDiscount: false, discountAmount: 0 };
  }

  let discountAmount = 0;
  if (discountType === 'PERCENTAGE') {
    discountAmount = (regularPrice * discountValue) / 100;
  } else if (discountType === 'FIXED') {
    discountAmount = discountValue;
  }

  const effectivePrice = Math.max(0, regularPrice - discountAmount);
  return {
    effectivePrice,
    hasActiveDiscount: true,
    discountAmount
  };
}

export const calculateDiscountedPrice = calculateEffectivePrice;

export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export const DEFAULT_THEME = {
  colors: {
    primary: '#663399',
    secondary: '#FFFFFF',
    accent: '#D9F45F',
    background: '#151414',
    text: '#FFFFFF99',
    cardBackground: '#1C1B1B',
    borderColor: '#2A2929'
  },
  fontFamilyHeading: 'Inter, system-ui, sans-serif',
  fontFamilyBody: 'Inter, system-ui, sans-serif',
  borderRadius: '8px'
};

export const DEFAULT_BRANDING = {
  siteName: 'Silwasa IT Solutions',
  siteTagline: 'AI-Powered Web, Mobile & Enterprise Software Development',
  siteUrl: 'https://silwasa.com',
  businessName: 'Silwasa IT Solutions',
  businessDescription: 'Silwasa IT Solutions is a premier digital technology partner engineering scalable web applications, custom enterprise software, cloud architectures, and modern digital experiences.',
  contactEmail: 'contact@silwasa.com',
  contactPhone: '+91 7070717794',
  whatsappNumber: '+91 7070717794',
  businessAddress: 'Silwasa, India',
  copyrightText: `© ${new Date().getFullYear()} Silwasa IT Solutions. All rights reserved.`,
  timezone: 'Asia/Kolkata',
  defaultCurrency: 'INR'
};

export const DEFAULT_ANIMATION = {
  enabled: true,
  preset: 'luxury' as const,
  scrollReveal: 'fade-up' as const,
  headingAnimation: 'fade-up' as const,
  cardHoverEffect: 'lift-glow' as const,
  buttonEffect: 'shine-sweep' as const,
  speed: 'normal' as const,
  staggerChildren: true,
};
