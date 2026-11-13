'use client';

import React from 'react';
import type { PageSection, SectionType } from '@silwasa/types';
import { HeroSection } from './HeroSection';
import { ServicesSection } from './ServicesSection';
import { IndustriesSection } from './IndustriesSection';
import { TechStackSection } from './TechStackSection';
import { ProcessSection } from './ProcessSection';
import { AboutSection } from './AboutSection';
import { CaseStudiesSection } from './CaseStudiesSection';
import { PortfolioSection } from './PortfolioSection';
import { PricingSection } from './PricingSection';
import { FaqSection } from './FaqSection';
import { CtaSection } from './CtaSection';
import { ContactSection } from './ContactSection';
import { RichTextSection } from './RichTextSection';

interface SectionRendererProps {
  section: PageSection;
}

export function renderSection(section: PageSection): React.ReactNode {
  if (!section.isEnabled) return null;

  const settings = (section.settings || {}) as Record<string, any>;

  switch (section.type) {
    case 'hero':
    case 'hero-carousel':
      return <HeroSection key={section.id} settings={settings} />;

    case 'services-grid':
    case 'featured-services':
      return <ServicesSection key={section.id} settings={settings} />;

    case 'industries-grid':
      return <IndustriesSection key={section.id} settings={settings} />;

    case 'technologies':
      return <TechStackSection key={section.id} settings={settings} />;

    case 'development-process':
      return <ProcessSection key={section.id} settings={settings} />;

    case 'about-intro':
    case 'statistics':
      return <AboutSection key={section.id} settings={settings} />;

    case 'case-studies':
      return <CaseStudiesSection key={section.id} settings={settings} />;

    case 'featured-portfolio':
      return <PortfolioSection key={section.id} settings={settings} />;

    case 'pricing-plans':
      return <PricingSection key={section.id} settings={settings} />;

    case 'faqs':
      return <FaqSection key={section.id} settings={settings} />;

    case 'cta':
      return <CtaSection key={section.id} settings={settings} />;

    case 'contact-form':
      return <ContactSection key={section.id} settings={settings} />;

    case 'rich-text':
      return <RichTextSection key={section.id} settings={settings} />;

    default:
      // Fallback for unhandled or experimental sections
      return (
        <div key={section.id} className="py-8 text-center text-xs text-white/40 bg-[#151414] border-t border-[#2A2B28]">
          Section [{section.type}] ({section.id})
        </div>
      );
  }
}

export function SectionRegistry({ sections }: { sections: PageSection[] }) {
  if (!sections || sections.length === 0) return null;

  const sorted = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="w-full flex flex-col">
      {sorted.map((sec) => renderSection(sec))}
    </div>
  );
}
