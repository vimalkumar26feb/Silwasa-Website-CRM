'use client';

import React, { useState } from 'react';
import { Cpu, Layers, Database, Cloud, Terminal, Shield } from 'lucide-react';

export interface TechItem {
  name: string;
  category: string;
  description: string;
}

export interface TechStackSectionSettings {
  badge?: string;
  heading?: string;
  subheading?: string;
  technologies?: TechItem[];
}

const DEFAULT_TECH: TechItem[] = [
  // Frontend
  { name: 'Next.js 15', category: 'Frontend', description: 'Server Components, App Router & Turbopack' },
  { name: 'React 19', category: 'Frontend', description: 'Action hooks, Optimistic UI & transitions' },
  { name: 'TypeScript', category: 'Frontend', description: 'Zero-runtime type safety & strict contracts' },
  { name: 'Tailwind CSS', category: 'Frontend', description: 'Utility-first modular design system' },
  { name: 'Framer Motion', category: 'Frontend', description: 'Hardware-accelerated fluid micro-interactions' },

  // Backend
  { name: 'Node.js', category: 'Backend', description: 'High-throughput asynchronous I/O runtime' },
  { name: 'Express.js', category: 'Backend', description: 'Lightweight, hardened RESTful API framework' },
  { name: 'Python', category: 'Backend', description: 'FastAPI, LangChain & data processing pipelines' },
  { name: 'GraphQL', category: 'Backend', description: 'Precise, declarative client data fetching' },

  // Databases & Cloud
  { name: 'PostgreSQL', category: 'Databases & Cloud', description: 'ACID-compliant relational data store' },
  { name: 'Prisma ORM', category: 'Databases & Cloud', description: 'Type-safe database migrations & schema integrity' },
  { name: 'Redis', category: 'Databases & Cloud', description: 'Sub-millisecond caching & session orchestration' },
  { name: 'AWS Cloud', category: 'Databases & Cloud', description: 'S3, ECS, RDS & CloudFront global edge CDN' },
  { name: 'Docker', category: 'Databases & Cloud', description: 'Reproducible multi-stage container builds' },

  // Security & AI
  { name: 'Argon2id', category: 'Security & AI', description: 'RFC 9106 memory-hard cryptographic hashing' },
  { name: 'JWT & RBAC', category: 'Security & AI', description: 'Zero-trust role-based granular permissions' },
  { name: 'OpenAI / Gemini', category: 'Security & AI', description: 'Enterprise RAG pipelines & autonomous agents' },
];

export function TechStackSection({ settings }: { settings: TechStackSectionSettings }) {
  const badge = settings.badge || 'MODERN PRODUCTION STACK';
  const heading = settings.heading || 'Built With World-Class Engineering Tools';
  const subheading = settings.subheading || 'We reject fragile legacy stacks. Every system we build leverages battle-tested, high-concurrency technologies designed for 99.99% uptime.';
  const technologies = settings.technologies && settings.technologies.length > 0 ? settings.technologies : DEFAULT_TECH;

  const categories = ['All', 'Frontend', 'Backend', 'Databases & Cloud', 'Security & AI'];
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredTech = activeCategory === 'All'
    ? technologies
    : technologies.filter((t) => t.category === activeCategory);

  return (
    <section className="py-20 lg:py-28 bg-[#151414] relative border-t border-[#2A2B28]/60">
      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
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

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-[#D9F45F] text-[#151414] shadow-md font-bold'
                    : 'bg-[#1C1B1B] text-white/70 hover:text-white border border-[#2A2B28]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tech Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTech.map((tech, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#D9F45F]/50 transition-colors group flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2A2B28]/60 flex items-center justify-center text-[#D9F45F] shrink-0 group-hover:bg-[#663399] group-hover:text-white transition-colors">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white group-hover:text-[#D9F45F] transition-colors">
                    {tech.name}
                  </h4>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#151414] text-white/60 border border-[#2A2B28]">
                    {tech.category}
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  {tech.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
