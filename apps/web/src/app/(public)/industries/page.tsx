import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { Industry } from '@silwasa/types';
import { Button } from '../../../components/ui/Button';
import {
  Building2,
  Stethoscope,
  ShoppingCart,
  Landmark,
  Truck,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Industry Expertise & Enterprise Verticals | Silwasa IT Solutions',
  description:
    'Custom web applications, compliance-ready portals, and scalable software platforms engineered for healthcare, fintech, real estate, logistics, and retail.',
  alternates: {
    canonical: 'https://silwasa.com/industries',
  },
};

const SEEDED_INDUSTRIES: Industry[] = [
  {
    id: 'ind-1',
    name: 'Healthcare & Telemedicine',
    slug: 'healthcare',
    shortDescription: 'HIPAA-compliant patient portals, EHR telemetry, and doctor scheduling systems.',
    fullDescription: 'We architect enterprise healthcare platforms designed to safeguard patient privacy under HIPAA regulations while optimizing clinical throughput.',
    icon: 'Stethoscope',
    challenges: ['Strict HIPAA & NABH Compliance Requirements', 'Legacy EHR Data Silos and Incompatible Formats'],
    solutions: ['End-to-End Encrypted FHIR Sockets and Audit Trails', 'Unified Telemetry Aggregation with Real-Time Push'],
    isPublished: true,
    order: 0,
  },
  {
    id: 'ind-2',
    name: 'Real Estate & PropTech',
    slug: 'real-estate',
    shortDescription: 'Interactive property showcases, CRM automation, and map telemetry.',
    fullDescription: 'Custom real estate portals featuring 3D virtual walkthroughs, lead routing engines, automated commission tracking, and high-concurrency property listings.',
    icon: 'Building',
    challenges: ['Slow Map Rendering on Mobile Devices', 'Lead Leakage across Agent Networks'],
    solutions: ['Vector Tile Mapping via WebGL Hardware Acceleration', 'Automated Instant WhatsApp Lead Routing'],
    isPublished: true,
    order: 1,
  },
  {
    id: 'ind-3',
    name: 'E-commerce & Retail',
    slug: 'ecommerce-retail',
    shortDescription: 'Sub-second headless storefronts, multi-warehouse sync, and flash-sale resilience.',
    fullDescription: 'High-volume commerce platforms built on Next.js 15 App Router engineered to handle 50,000+ concurrent checkout requests without database locking.',
    icon: 'ShoppingCart',
    challenges: ['Cart Abandonment from Slow Largest Contentful Paint (LCP)', 'Inventory Race Conditions During High-Concurrency Flash Sales'],
    solutions: ['Edge-Rendered Catalogs with Sub-0.5s LCP Worldwide', 'Redis Atomic Stock Reservation Distributed Locks'],
    isPublished: true,
    order: 2,
  },
  {
    id: 'ind-4',
    name: 'FinTech & Banking',
    slug: 'fintech-banking',
    shortDescription: 'RBI/PCI-DSS compliant payments, ledger accounting, and KYC workflows.',
    fullDescription: 'Secure financial systems featuring end-to-end payload encryption, biometric authentication, fraud detection pipelines, and automated reconciliation.',
    icon: 'Landmark',
    challenges: ['PCI-DSS Level 1 Compliance & Regulatory Auditing', 'Sub-millisecond Transaction Verification under High Load'],
    solutions: ['Argon2id & AES-256 GCM Cryptography', 'Idempotent Webhook Processing Queues with Automatic Retry'],
    isPublished: true,
    order: 3,
  },
  {
    id: 'ind-5',
    name: 'Logistics & Supply Chain',
    slug: 'logistics-supply-chain',
    shortDescription: 'Real-time vehicle GPS tracking, dispatch portals, and automated billing.',
    fullDescription: 'Custom enterprise supply chain software designed to track multi-hub freight movements, calculate automated toll tariffs, and deliver instant proof-of-delivery.',
    icon: 'Truck',
    challenges: ['Intermittent Fleet Cellular Connectivity', 'Complex Multi-tier Dispatch and Contractor Hierarchies'],
    solutions: ['Offline-First Progressive Web Apps with Background Sync', 'Role-Based Telematics Dashboards with Dynamic Routing'],
    isPublished: true,
    order: 4,
  },
  {
    id: 'ind-6',
    name: 'Education & EdTech',
    slug: 'education-edtech',
    shortDescription: 'Scalable LMS portals, live video classrooms, and automated examination proctoring.',
    fullDescription: 'High-concurrency learning platforms with student analytics, video on demand, automated test grading, and payment gateway subscriptions.',
    icon: 'GraduationCap',
    challenges: ['Peak Examination Concurrency Spikes', 'Video Buffering on Low-Bandwidth Networks'],
    solutions: ['Adaptive HLS Bitrate Video Streaming', 'Serverless On-Demand Compute Scaling for Examination Peaks'],
    isPublished: true,
    order: 5,
  },
];

function getIndustryIcon(iconName?: string) {
  const name = (iconName || '').toLowerCase();
  if (name.includes('stetho') || name.includes('health') || name.includes('med')) return Stethoscope;
  if (name.includes('real') || name.includes('estate') || name.includes('build')) return Building2;
  if (name.includes('shop') || name.includes('ecom') || name.includes('retail')) return ShoppingCart;
  if (name.includes('bank') || name.includes('fintech') || name.includes('land')) return Landmark;
  if (name.includes('truck') || name.includes('logic') || name.includes('supply')) return Truck;
  if (name.includes('grad') || name.includes('edu') || name.includes('school')) return GraduationCap;
  return Layers;
}

async function getIndustries(): Promise<Industry[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/industries`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        return data.data;
      }
    }
  } catch {
    // Fallback
  }
  return SEEDED_INDUSTRIES;
}

export default async function IndustriesIndexPage() {
  const industries = await getIndustries();

  return (
    <div className="py-16 lg:py-24 bg-[#151414] relative">
      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1B1B] border border-[#2A2B28]">
            <span className="w-2 h-2 rounded-full bg-[#D9F45F]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
              SPECIALIZED SECTOR EXPERTISE
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Engineered For Industry Rigor
          </h1>

          <p className="text-white/70 text-base sm:text-lg leading-relaxed">
            We don’t deliver generic websites. Every platform is architected to address the exact compliance, data latency, and commercial realities of your sector.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((ind) => {
            const IconComp = getIndustryIcon(ind.icon || ind.name);

            return (
              <div
                key={ind.id}
                className="p-8 rounded-3xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399]/60 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#663399]/20 border border-[#663399]/40 flex items-center justify-center text-[#D9F45F] group-hover:bg-[#D9F45F]/20 group-hover:border-[#D9F45F]/40 transition-colors">
                    <IconComp className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#D9F45F] transition-colors leading-snug mb-2">
                      <Link href={`/industries/${ind.slug}`}>{ind.name}</Link>
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed">
                      {ind.shortDescription || ind.fullDescription}
                    </p>
                  </div>

                  {ind.solutions && ind.solutions.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[#2A2B28]/60">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#D9F45F]">
                        Key Capabilities
                      </div>
                      <ul className="space-y-1.5">
                        {ind.solutions.slice(0, 2).map((sol, sIdx) => (
                          <li
                            key={sIdx}
                            className="flex items-start gap-2 text-xs text-white/70"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#D9F45F] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{sol}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-[#2A2B28]/60 mt-6 flex items-center justify-between">
                  <Link
                    href={`/industries/${ind.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D9F45F] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Explore Solutions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-20 rounded-3xl bg-gradient-to-br from-[#1C1B1B] via-[#211b27] to-[#1C1B1B] border border-[#663399]/40 p-8 sm:p-12 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Need Custom Architecture For Your Vertical?
          </h3>
          <p className="text-sm text-white/70 max-w-xl mx-auto">
            Speak with an enterprise solutions architect about regulatory compliance, microservices, and timeline.
          </p>
          <div className="pt-2">
            <Link href="/contact">
              <Button variant="primary" size="lg" className="rounded-full shadow-lg shadow-[#663399]/20">
                <span>Speak With An Engineer</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
