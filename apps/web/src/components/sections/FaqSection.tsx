'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/Button';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSectionSettings {
  badge?: string;
  heading?: string;
  subheading?: string;
  faqs?: FaqItem[];
  supportCtaText?: string;
  supportCtaUrl?: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: 'How is Silwasa IT Solutions different from typical web agencies?',
    answer: 'Unlike agencies that use sluggish pre-made WordPress templates or locked proprietary builders, Silwasa builds clean, database-driven custom platforms using Next.js 15, React 19, TypeScript, and Express.js. You get sub-second page loads, enterprise security, Generative Engine Optimization (GEO), and 100% full source-code ownership.',
  },
  {
    question: 'What is Generative Engine Optimization (GEO)?',
    answer: 'GEO is the evolution of technical SEO for the AI search era. We engineer structured entity schemas, authority content clusters, and high-performance server-rendered pages so your business is prioritized and cited by AI engines like ChatGPT Search, Perplexity AI, Claude, and Google AI Overviews.',
  },
  {
    question: 'Can non-technical team members edit and manage content easily?',
    answer: 'Yes, absolutely. Our custom admin dashboard gives your marketing and content team a frictionless visual CMS to manage navigation menus, homepage sections, service pages, portfolio items, pricing tiers, and blog posts with zero coding required.',
  },
  {
    question: 'How long does a custom web platform or enterprise portal take to ship?',
    answer: 'A standard high-performance business platform typically ships within 2 to 4 weeks using our sprint-based agile delivery framework. Larger enterprise systems, multi-currency e-commerce, or custom AI copilot integrations typically range from 4 to 8 weeks with weekly staging demonstrations.',
  },
  {
    question: 'Do you offer ongoing technical maintenance and security updates?',
    answer: 'Yes. All our deliverables include a 30-to-90-day post-launch warranty, followed by flexible SLA maintenance retainers covering 24/7 uptime monitoring, core dependency upgrades, penetration tests, and continuous speed optimization.',
  },
  {
    question: 'Do we own the source code and database upon project completion?',
    answer: 'Yes. You receive full, unencumbered ownership of all git repositories, database schemas, Figma design files, and deployment scripts upon final milestone sign-off. Zero vendor lock-in.',
  },
];

export function FaqSection({ settings }: { settings: FaqSectionSettings }) {
  const badge = settings.badge || 'FREQUENTLY ASKED QUESTIONS';
  const heading = settings.heading || 'Everything You Need To Know';
  const subheading = settings.subheading || 'Clear, direct answers about our architecture, engineering standards, timelines, and deliverables.';
  const faqs = settings.faqs && settings.faqs.length > 0 ? settings.faqs : DEFAULT_FAQS;
  const supportCtaText = settings.supportCtaText || 'Still have questions? Speak with an engineer';
  const supportCtaUrl = settings.supportCtaUrl || '/contact';

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 lg:py-28 bg-[#151414] relative border-t border-[#2A2B28]/60">
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

        {/* Accordion Container */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-white hover:text-[#D9F45F] transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-[#2A2B28] flex items-center justify-center text-[#D9F45F] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#663399] text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm sm:text-base text-white/70 leading-relaxed border-t border-[#2A2B28]/50 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Prompt */}
        <div className="mt-12 text-center">
          <Link
            href={supportCtaUrl}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#D9F45F] hover:underline"
          >
            <span>{supportCtaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
