import { describe, it, expect } from 'vitest';
import {
  LoginSchema,
  CreatePageSchema,
  CreateEnquirySchema,
  CreatePricingPackageSchema,
  ThemeSettingsSchema
} from '../src/index.js';

describe('Validation Schemas', () => {
  it('LoginSchema validates correct and incorrect credentials', () => {
    const valid = LoginSchema.safeParse({
      email: 'admin@silwasa.com',
      password: 'StrongPassword123!'
    });
    expect(valid.success).toBe(true);

    const invalid = LoginSchema.safeParse({
      email: 'not-an-email',
      password: 'short'
    });
    expect(invalid.success).toBe(false);
  });

  it('CreatePageSchema validates slug format and sections', () => {
    const valid = CreatePageSchema.safeParse({
      title: 'About Silwasa IT Solutions',
      slug: 'about-us',
      isPublished: true,
      sections: [
        {
          id: 'sec-1',
          type: 'hero',
          version: 1,
          order: 0,
          isEnabled: true,
          settings: { heading: 'Hello World' }
        }
      ]
    });
    expect(valid.success).toBe(true);

    const invalidSlug = CreatePageSchema.safeParse({
      title: 'Test',
      slug: 'INVALID SLUG WITH SPACES'
    });
    expect(invalidSlug.success).toBe(false);
  });

  it('CreateEnquirySchema validates required lead fields', () => {
    const valid = CreateEnquirySchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      service: 'Web Development',
      message: 'We are looking to rebuild our enterprise portal.'
    });
    expect(valid.success).toBe(true);

    const invalid = CreateEnquirySchema.safeParse({
      name: 'J',
      email: 'bad-email',
      message: 'short'
    });
    expect(invalid.success).toBe(false);
  });

  it('CreatePricingPackageSchema validates currency and features', () => {
    const valid = CreatePricingPackageSchema.safeParse({
      name: 'Growth Plan',
      shortDescription: 'Ideal for expanding businesses',
      regularPrice: 25000,
      currency: 'INR',
      features: [{ id: 'f-1', text: '10 Keywords', included: true }]
    });
    expect(valid.success).toBe(true);
  });

  it('ThemeSettingsSchema validates hex color values', () => {
    const valid = ThemeSettingsSchema.safeParse({
      colors: {
        primary: '#663399',
        secondary: '#FFFFFF',
        accent: '#D9F45F',
        background: '#151414',
        text: '#FFFFFF99',
        cardBackground: '#1C1B1B',
        borderColor: '#2A2B28'
      },
      fontFamilyHeading: 'Plus Jakarta Sans',
      fontFamilyBody: 'Plus Jakarta Sans',
      borderRadius: '8px'
    });
    expect(valid.success).toBe(true);

    const invalidColor = ThemeSettingsSchema.safeParse({
      colors: {
        primary: 'not-a-hex',
        secondary: '#FFFFFF',
        accent: '#D9F45F',
        background: '#151414',
        text: '#FFFFFF99',
        cardBackground: '#1C1B1B',
        borderColor: '#2A2B28'
      }
    });
    expect(invalidColor.success).toBe(false);
  });
});
