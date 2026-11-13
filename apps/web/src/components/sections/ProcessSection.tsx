'use client';

import React from 'react';
import { Search, Compass, Code, ShieldCheck, Rocket, LineChart, Wrench, RefreshCw } from 'lucide-react';

export interface ProcessStep {
  stepNumber: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface ProcessSectionSettings {
  badge?: string;
  heading?: string;
  subheading?: string;
  steps?: ProcessStep[];
}

const DEFAULT_STEPS: ProcessStep[] = [
  {
    stepNumber: '01',
    title: 'Discovery & Blueprinting',
    description: 'We audit your legacy systems, dissect user journeys, benchmark competitors, and formulate technical requirements.',
    deliverables: ['Product Requirements Doc', 'Tech Stack Matrix', 'ROI Milestones'],
  },
  {
    stepNumber: '02',
    title: 'UI/UX & Interactive Prototypes',
    description: 'Design interactive, conversion-optimized Figma prototypes tested against real user feedback before writing code.',
    deliverables: ['Design System', 'Responsive Mockups', 'Component Library'],
  },
  {
    stepNumber: '03',
    title: 'Sprint-Based Full-Stack Build',
    description: 'Engineered with clean architecture, strict TypeScript contracts, reusable components, and git-flow code reviews.',
    deliverables: ['Weekly Staging Builds', 'Database Migrations', 'API Documentation'],
  },
  {
    stepNumber: '04',
    title: 'Security, Speed & QA Audits',
    description: 'Automated unit/integration tests, OWASP Top 10 vulnerability scans, and sub-second Core Web Vitals tuning.',
    deliverables: ['90+ Lighthouse Score', 'Penetration Testing', 'Accessibility Compliance'],
  },
  {
    stepNumber: '05',
    title: 'Zero-Downtime Global Launch',
    description: 'Production deployment with multi-region CDN caching, DNS failover, SSL provisioning, and search engine indexing.',
    deliverables: ['Production Release', 'DNS & SSL Setup', 'Google Search Console Verification'],
  },
  {
    stepNumber: '06',
    title: 'Post-Launch SLA & Growth Support',
    description: '24/7 uptime monitoring, security patching, monthly technical SEO audits, and iterative feature development.',
    deliverables: ['99.99% Uptime Guarantee', 'Monthly Performance Report', 'Dedicated Lead Engineer'],
  },
];

export function ProcessSection({ settings }: { settings: ProcessSectionSettings }) {
  const badge = settings.badge || 'PROVEN AGILE METHODOLOGY';
  const heading = settings.heading || 'From Concept to Flawless Production';
  const subheading = settings.subheading || 'A disciplined, transparent delivery framework engineered to eliminate guesswork, mitigate risks, and ship on time.';
  const steps = settings.steps && settings.steps.length > 0 ? settings.steps : DEFAULT_STEPS;

  return (
    <section className="py-20 lg:py-28 bg-[#151414] relative">
      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
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

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399]/60 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-extrabold text-[#D9F45F] font-mono">
                    {step.stepNumber}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#2A2B28] flex items-center justify-center text-white/50 group-hover:bg-[#663399] group-hover:text-white transition-colors">
                    <span className="text-xs font-bold">{idx + 1}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#D9F45F] transition-colors">
                  {step.title}
                </h3>

                <p className="text-sm text-white/70 leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#2A2B28]/60 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Key Deliverables</span>
                {step.deliverables.map((del, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2 text-xs text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9F45F]" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
