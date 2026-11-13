'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Stethoscope, ShoppingBag, Truck, Landmark, GraduationCap, Plane, Car, Factory, Briefcase } from 'lucide-react';
import { Button } from '../ui/Button';

export interface IndustryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName?: string;
  compliance?: string[];
  techPills?: string[];
}

export interface IndustriesSectionSettings {
  badge?: string;
  heading?: string;
  subheading?: string;
  industries?: IndustryItem[];
  viewAllUrl?: string;
}

const DEFAULT_INDUSTRIES: IndustryItem[] = [
  {
    id: 'ind-1',
    name: 'Healthcare & MedTech',
    slug: 'healthcare',
    description: 'HIPAA & GDPR-compliant patient portals, telemedicine systems, and EHR/EMR clinical data integrations.',
    iconName: 'Stethoscope',
    compliance: ['HIPAA Compliant', 'HL7/FHIR'],
    techPills: ['Telehealth', 'EHR/EMR', 'WebRTC'],
  },
  {
    id: 'ind-2',
    name: 'Real Estate & PropTech',
    slug: 'real-estate',
    description: 'MLS/IDX listing automation, 3D property tours, mortgage calculators, and high-velocity CRM pipelines.',
    iconName: 'Building2',
    compliance: ['RETS/RESO Ready'],
    techPills: ['Virtual Tours', 'MLS Sync', 'Lead Engine'],
  },
  {
    id: 'ind-3',
    name: 'Retail & E-commerce',
    slug: 'ecommerce',
    description: 'Headless multi-storefront architecture, dynamic pricing engines, automated inventory, and POS synchronization.',
    iconName: 'ShoppingBag',
    compliance: ['PCI-DSS Level 1'],
    techPills: ['Headless Shopify', 'Next.js', 'Stripe'],
  },
  {
    id: 'ind-4',
    name: 'FinTech & Banking',
    slug: 'fintech',
    description: 'Secure open-banking APIs, algorithmic trading tools, KYC/AML biometric verification, and payment gateways.',
    iconName: 'Landmark',
    compliance: ['SOC 2 Type II', 'ISO 27001'],
    techPills: ['Plaid', 'Argon2id', 'WebSockets'],
  },
  {
    id: 'ind-5',
    name: 'Logistics & Supply Chain',
    slug: 'logistics',
    description: 'Real-time GPS fleet tracking, automated dispatch algorithms, warehouse management systems, and route optimization.',
    iconName: 'Truck',
    compliance: ['DOT Compliance'],
    techPills: ['IoT Telematics', 'Kafka', 'Geofencing'],
  },
  {
    id: 'ind-6',
    name: 'EdTech & Learning',
    slug: 'education',
    description: 'Interactive SCORM-compliant learning management systems (LMS), gamified assessments, and AI grading assistants.',
    iconName: 'GraduationCap',
    compliance: ['FERPA / COPPA'],
    techPills: ['Video CDN', 'Live Quizzing', 'AI Tutor'],
  },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Stethoscope,
  Building2,
  ShoppingBag,
  Landmark,
  Truck,
  GraduationCap,
  Plane,
  Car,
  Factory,
  Briefcase,
};

export function IndustriesSection({ settings }: { settings: IndustriesSectionSettings }) {
  const badge = settings.badge || 'SPECIALIZED SECTOR EXPERTISE';
  const heading = settings.heading || 'Engineered For Industry-Specific Rigor';
  const subheading = settings.subheading || 'We design and deploy compliant, mission-critical digital systems tailored to the exact regulatory and technical standards of each vertical.';
  const industries = settings.industries && settings.industries.length > 0 ? settings.industries : DEFAULT_INDUSTRIES;
  const viewAllUrl = settings.viewAllUrl || '/industries';

  return (
    <section className="py-20 lg:py-28 bg-[#151414] relative">
      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1B1B] border border-[#2A2B28]">
              <span className="w-2 h-2 rounded-full bg-[#D9F45F]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                {badge}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {heading}
            </h2>
            <p className="text-white/70 text-base sm:text-lg">
              {subheading}
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <Link href={viewAllUrl}>
              <Button variant="secondary" className="rounded-full">
                View All Industries
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry) => {
            const Icon = (industry.iconName && ICON_MAP[industry.iconName]) || Building2;

            return (
              <div
                key={industry.id}
                className="group relative p-8 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399]/60 hover:shadow-xl hover:shadow-[#663399]/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#663399]/20 border border-[#663399]/30 flex items-center justify-center text-[#D9F45F] group-hover:bg-[#663399] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>

                    {industry.compliance && industry.compliance.length > 0 && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#2A2B28] text-white/90">
                        {industry.compliance[0]}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#D9F45F] transition-colors">
                    {industry.name}
                  </h3>

                  <p className="text-sm text-white/70 leading-relaxed mb-6">
                    {industry.description}
                  </p>

                  {industry.techPills && industry.techPills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {industry.techPills.map((pill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#151414] border border-[#2A2B28] text-[11px] text-white/80 font-medium"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href={`/industries/${industry.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#D9F45F] group-hover:translate-x-1 transition-transform pt-4 border-t border-[#2A2B28]/50"
                >
                  <span>Explore Case Studies & Architecture</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
