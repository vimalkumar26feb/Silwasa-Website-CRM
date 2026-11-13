import { describe, it, expect } from 'vitest';
import { slugify, formatCurrency, calculateEffectivePrice, estimateReadingTime } from '../src/index.js';

describe('Shared Utilities', () => {
  it('slugify converts titles to url-friendly slugs', () => {
    expect(slugify('Web Development & AI Solutions!')).toBe('web-development-ai-solutions');
    expect(slugify('Sustainable SEO For Serious Brands')).toBe('sustainable-seo-for-serious-brands');
  });

  it('formatCurrency formats INR and USD', () => {
    expect(formatCurrency(25000, 'INR')).toContain('25,000');
    expect(formatCurrency(499, 'USD')).toContain('499');
  });

  it('calculateEffectivePrice applies percentage discount correctly', () => {
    const result = calculateEffectivePrice(1000, 'PERCENTAGE', 20);
    expect(result.effectivePrice).toBe(800);
    expect(result.hasActiveDiscount).toBe(true);
    expect(result.discountAmount).toBe(200);
  });

  it('calculateEffectivePrice applies fixed discount correctly', () => {
    const result = calculateEffectivePrice(1000, 'FIXED', 150);
    expect(result.effectivePrice).toBe(850);
    expect(result.hasActiveDiscount).toBe(true);
    expect(result.discountAmount).toBe(150);
  });

  it('calculateEffectivePrice respects expiration dates', () => {
    const pastDate = new Date(Date.now() - 86400000).toISOString();
    const result = calculateEffectivePrice(1000, 'PERCENTAGE', 20, undefined, pastDate);
    expect(result.effectivePrice).toBe(1000);
    expect(result.hasActiveDiscount).toBe(false);
  });

  it('estimateReadingTime calculates words per minute correctly', () => {
    const sampleText = 'word '.repeat(400);
    expect(estimateReadingTime(sampleText)).toBe(2);
  });
});
