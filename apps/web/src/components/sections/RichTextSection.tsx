'use client';

import React from 'react';

export interface RichTextSectionSettings {
  badge?: string;
  heading?: string;
  subheading?: string;
  contentHtml?: string;
  containerWidth?: 'narrow' | 'standard' | 'full';
}

export function RichTextSection({ settings }: { settings: RichTextSectionSettings }) {
  const badge = settings.badge;
  const heading = settings.heading;
  const subheading = settings.subheading;
  const contentHtml = settings.contentHtml || '<p>Content block placeholder.</p>';
  const containerWidth = settings.containerWidth || 'standard';

  const widthClass =
    containerWidth === 'narrow'
      ? 'max-w-3xl'
      : containerWidth === 'full'
      ? 'max-w-full'
      : 'max-w-5xl';

  return (
    <section className="py-16 lg:py-24 bg-[#151414] relative border-t border-[#2A2B28]/60">
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${widthClass}`}>
        {(badge || heading || subheading) && (
          <div className="mb-12 space-y-4">
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1B1B] border border-[#2A2B28]">
                <span className="w-2 h-2 rounded-full bg-[#D9F45F]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                  {badge}
                </span>
              </div>
            )}
            {heading && (
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-white/70 text-base sm:text-lg">
                {subheading}
              </p>
            )}
          </div>
        )}

        <div
          className="prose prose-invert max-w-none text-white/80 leading-relaxed space-y-4 prose-headings:text-white prose-a:text-[#D9F45F] prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </section>
  );
}
