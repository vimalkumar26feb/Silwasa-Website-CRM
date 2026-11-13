'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Layers, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  client: string;
  description: string;
  technologies: string[];
  projectUrl?: string;
  imageUrl?: string;
}

export interface PortfolioSectionSettings {
  badge?: string;
  heading?: string;
  subheading?: string;
  projects?: ProjectItem[];
  viewAllUrl?: string;
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Solaria Energy Asset Intelligence Portal',
    slug: 'solaria-energy-portal',
    category: 'Enterprise Web App',
    client: 'Solaria Energy Corp',
    description: 'Real-time telemetry monitoring for 14,000+ commercial solar arrays with predictive maintenance algorithms.',
    technologies: ['Next.js 15', 'TypeScript', 'Tailwind', 'TimescaleDB', 'GraphQL'],
    projectUrl: 'https://solaria.example.com',
  },
  {
    id: 'proj-2',
    title: 'Aura Luxury Omnichannel E-commerce',
    slug: 'aura-luxury-ecommerce',
    category: 'E-commerce',
    client: 'Aura Global',
    description: 'Headless multi-brand storefront supporting 18 international currencies, automated VAT, and 3D product previews.',
    technologies: ['React 19', 'Next.js', 'Stripe', 'Tailwind', 'Algolia'],
    projectUrl: 'https://aura.example.com',
  },
  {
    id: 'proj-3',
    title: 'MedSync Telehealth Cross-Platform Suite',
    slug: 'medsync-telehealth-suite',
    category: 'Healthcare',
    client: 'MedSync Health',
    description: 'HIPAA-compliant video consultation platform with digital prescriptions, calendar booking, and EHR sync.',
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'WebRTC', 'AWS'],
    projectUrl: 'https://medsync.example.com',
  },
  {
    id: 'proj-4',
    title: 'CognitiveDesk AI Support Orchestration',
    slug: 'cognitivedesk-ai',
    category: 'AI Solutions',
    client: 'Cognitive Systems',
    description: 'Autonomous customer support agent resolving 64% of tier-1 support tickets using private vector retrieval.',
    technologies: ['Python', 'FastAPI', 'LangChain', 'OpenAI', 'Pinecone'],
    projectUrl: 'https://cognitivedesk.example.com',
  },
];

export function PortfolioSection({ settings }: { settings: PortfolioSectionSettings }) {
  const badge = settings.badge || 'SELECTED WORK & CREATIVE IMPACT';
  const heading = settings.heading || 'Engineered For Real-World Performance';
  const subheading = settings.subheading || 'A selection of high-concurrency web applications, enterprise portals, and transformative platforms built for world-class clients.';
  const projects = settings.projects && settings.projects.length > 0 ? settings.projects : DEFAULT_PROJECTS;
  const viewAllUrl = settings.viewAllUrl || '/portfolio';

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section className="py-20 lg:py-28 bg-[#151414] relative border-t border-[#2A2B28]/60">
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
                View All Projects
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Pills */}
        {categories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition shrink-0 ${
                  activeCategory === cat
                    ? 'bg-[#663399] text-white shadow-md'
                    : 'bg-[#1C1B1B] text-white/70 hover:text-white border border-[#2A2B28]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group p-8 rounded-3xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399]/60 hover:shadow-2xl hover:shadow-[#663399]/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2A2B28] text-[#D9F45F]">
                    {project.category}
                  </span>
                  <span className="text-xs font-medium text-white/50">
                    {project.client}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#D9F45F] transition-colors">
                  <Link href={`/portfolio/${project.slug}`}>{project.title}</Link>
                </h3>

                <p className="text-sm text-white/70 leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-[#151414] border border-[#2A2B28] text-xs text-white/80 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action row */}
              <div className="pt-6 border-t border-[#2A2B28]/60 flex items-center justify-between">
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#D9F45F] hover:underline"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
