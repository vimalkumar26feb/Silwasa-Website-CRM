'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu as MenuIcon,
  X,
  ArrowRight,
  MessageCircle,
  Phone,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Code2,
  Globe,
  Cpu,
  Smartphone,
  Search,
  ShoppingCart,
  Building2,
  Stethoscope,
  Landmark,
  Truck,
  GraduationCap,
} from 'lucide-react';
import { Button } from '../ui/Button';
import type { Menu, MenuItem } from '@silwasa/types';

const DEFAULT_HEADER_ITEMS: MenuItem[] = [
  {
    id: 'nav-about',
    label: 'About',
    url: '/about',
    order: 0,
    isEnabled: true,
  },
  {
    id: 'nav-services',
    label: 'Services',
    url: '/services',
    order: 1,
    isEnabled: true,
    isMegaMenu: true,
    megaMenuColumns: [
      {
        heading: 'Engineering & Development',
        links: [
          {
            label: 'Website Design & Development',
            url: '/services/website-design-development',
            description: 'Custom Next.js & React platforms optimized for speed and conversion.',
            badge: 'Popular',
          },
          {
            label: 'Custom Software Development',
            url: '/services/custom-software-development',
            description: 'Bespoke business portals, microservices, and workflow automation.',
          },
          {
            label: 'E-commerce Platform Architecture',
            url: '/services/ecommerce-website-development',
            description: 'High-volume headless multi-currency online stores.',
          },
          {
            label: 'Mobile Application Development',
            url: '/services/mobile-app-development',
            description: 'Native iOS & Android apps built with React Native.',
          },
        ],
        featuredItem: {
          title: 'Generative Engine Optimization (GEO)',
          description: 'Position your enterprise authority directly inside ChatGPT, Claude, and Perplexity AI citations.',
          ctaLabel: 'Explore GEO Capabilities',
          ctaUrl: '/services/ai-solutions-geo',
        },
      },
      {
        heading: 'AI & Performance Growth',
        links: [
          {
            label: 'AI Solutions & Autonomous Agents',
            url: '/services/ai-solutions-geo',
            description: 'Private RAG pipelines, fine-tuned LLMs, and enterprise copilot tools.',
            badge: 'Trending',
          },
          {
            label: 'Technical SEO & Core Web Vitals',
            url: '/services/seo-services',
            description: 'Sustainable search engine indexing and sub-second page performance.',
          },
          {
            label: 'UI/UX Interactive Design',
            url: '/services/ui-ux-design',
            description: 'High-converting interactive Figma prototypes and design systems.',
          },
          {
            label: 'Enterprise SLA & Cloud Maintenance',
            url: '/services/website-maintenance',
            description: '24/7 uptime monitoring, security patching, and dedicated tech leads.',
          },
        ],
      },
    ],
  },
  {
    id: 'nav-industries',
    label: 'Industries',
    url: '/industries',
    order: 2,
    isEnabled: true,
    isMegaMenu: true,
    megaMenuColumns: [
      {
        heading: 'Regulated Enterprise Verticals',
        links: [
          {
            label: 'Healthcare & MedTech',
            url: '/industries/healthcare',
            description: 'HIPAA & HL7/FHIR compliant patient portals and EHR integrations.',
          },
          {
            label: 'FinTech & Banking',
            url: '/industries/fintech',
            description: 'SOC 2 compliant open-banking, KYC/AML, and payment pipelines.',
          },
          {
            label: 'Real Estate & PropTech',
            url: '/industries/real-estate',
            description: 'MLS/IDX listing automation and virtual property tours.',
          },
        ],
        featuredItem: {
          title: 'Enterprise Security Architecture',
          description: 'Zero-trust RBAC, Argon2id encryption, and full compliance readiness.',
          ctaLabel: 'View Compliance Standards',
          ctaUrl: '/contact',
        },
      },
      {
        heading: 'High-Velocity Commercial Sectors',
        links: [
          {
            label: 'Logistics & Supply Chain',
            url: '/industries/logistics',
            description: 'Real-time GPS telematics, dispatch algorithms, and fleet routing.',
          },
          {
            label: 'Retail & Omnichannel E-commerce',
            url: '/industries/ecommerce',
            description: 'High-throughput inventory synchronization and POS connectors.',
          },
          {
            label: 'EdTech & Learning Platforms',
            url: '/industries/education',
            description: 'Interactive SCORM-compliant LMS systems and AI grading.',
          },
        ],
      },
    ],
  },
  {
    id: 'nav-portfolio',
    label: 'Portfolio',
    url: '/portfolio',
    order: 3,
    isEnabled: true,
  },
  {
    id: 'nav-cases',
    label: 'Case Studies',
    url: '/case-studies',
    order: 4,
    isEnabled: true,
  },
  {
    id: 'nav-pricing',
    label: 'Pricing',
    url: '/pricing',
    order: 5,
    isEnabled: true,
  },
  {
    id: 'nav-blog',
    label: 'Blog',
    url: '/blog',
    order: 6,
    isEnabled: true,
  },
  {
    id: 'nav-contact',
    label: 'Contact',
    url: '/contact',
    order: 7,
    isEnabled: true,
  },
];

export function Header() {
  const pathname = usePathname();
  const [items, setItems] = useState<MenuItem[]>(DEFAULT_HEADER_ITEMS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenuId, setActiveMegaMenuId] = useState<string | null>(null);
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/menus/location/header`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.items?.length > 0) {
            setItems(data.data.items);
          }
        }
      } catch {
        // Use default seeded items if backend not reachable
      }
    }

    fetchMenu();
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMegaMenuId(null);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#151414]/95 backdrop-blur-md border-b border-[#2A2B28] shadow-2xl'
          : 'bg-[#151414] border-b border-[#2A2B28]/60'
      }`}
      onMouseLeave={() => setActiveMegaMenuId(null)}
    >
      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#663399] to-[#8040bf] flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-[#663399]/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-white tracking-tight">
                Silwasa<span className="text-[#D9F45F]">.</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/50 -mt-1">
                IT Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {items
              .filter((item) => item.isEnabled)
              .sort((a, b) => a.order - b.order)
              .map((item) => {
                const isActive =
                  pathname === item.url || (item.url !== '/' && pathname.startsWith(item.url));
                const isMegaOpen = activeMegaMenuId === item.id;

                if (item.isMegaMenu && item.megaMenuColumns && item.megaMenuColumns.length > 0) {
                  return (
                    <div
                      key={item.id}
                      className="relative"
                      onMouseEnter={() => setActiveMegaMenuId(item.id)}
                    >
                      <button
                        onClick={() =>
                          setActiveMegaMenuId(activeMegaMenuId === item.id ? null : item.id)
                        }
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors ${
                          isMegaOpen || isActive
                            ? 'text-[#D9F45F] bg-[#1C1B1B] border border-[#2A2B28]'
                            : 'text-white/80 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isMegaOpen ? 'rotate-180 text-[#D9F45F]' : ''
                          }`}
                        />
                      </button>

                      {/* Mega Menu Dropdown */}
                      {isMegaOpen && (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[840px] z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                          onMouseEnter={() => setActiveMegaMenuId(item.id)}
                        >
                          <div className="rounded-3xl bg-[#1C1B1B]/95 backdrop-blur-xl border border-[#2A2B28] p-8 shadow-2xl grid grid-cols-12 gap-8">
                            {/* Left Columns (8 cols) */}
                            <div className="col-span-8 grid grid-cols-2 gap-8">
                              {item.megaMenuColumns.map((col, colIdx) => (
                                <div key={colIdx} className="space-y-4">
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                                    {col.heading}
                                  </h4>
                                  <div className="space-y-3">
                                    {col.links.map((link, lIdx) => (
                                      <Link
                                        key={lIdx}
                                        href={link.url}
                                        className="group/link block p-2.5 rounded-xl hover:bg-[#151414] transition border border-transparent hover:border-[#2A2B28]"
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm font-bold text-white group-hover/link:text-[#D9F45F] transition-colors">
                                            {link.label}
                                          </span>
                                          {link.badge && (
                                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#D9F45F]/15 text-[#D9F45F]">
                                              {link.badge}
                                            </span>
                                          )}
                                        </div>
                                        {link.description && (
                                          <p className="text-xs text-white/60 mt-1 line-clamp-2 leading-relaxed">
                                            {link.description}
                                          </p>
                                        )}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Right Featured Card (4 cols) */}
                            <div className="col-span-4 rounded-2xl bg-[#151414] border border-[#2A2B28] p-6 flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#663399]/30 border border-[#663399]/40 text-[#D9F45F] text-[10px] font-bold uppercase tracking-wider">
                                  <Sparkles className="w-3 h-3" />
                                  <span>Featured Innovation</span>
                                </div>
                                <h5 className="text-base font-bold text-white leading-snug">
                                  {item.megaMenuColumns[0]?.featuredItem?.title ||
                                    'Generative Engine Optimization (GEO)'}
                                </h5>
                                <p className="text-xs text-white/60 leading-relaxed">
                                  {item.megaMenuColumns[0]?.featuredItem?.description ||
                                    'Architecting high-intent entity schemas and authority content cited by ChatGPT and Perplexity.'}
                                </p>
                              </div>

                              <Link
                                href={
                                  item.megaMenuColumns[0]?.featuredItem?.ctaUrl ||
                                  item.url
                                }
                                className="inline-flex items-center gap-2 text-xs font-bold text-[#D9F45F] hover:underline pt-4 border-t border-[#2A2B28]"
                              >
                                <span>
                                  {item.megaMenuColumns[0]?.featuredItem?.ctaLabel ||
                                    'Explore Capabilities'}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    target={item.target || '_self'}
                    className={`px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors ${
                      isActive
                        ? 'text-[#D9F45F] bg-[#1C1B1B] border border-[#2A2B28]'
                        : 'text-white/80 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] bg-[#D9F45F]/20 text-[#D9F45F]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
          </nav>

          {/* Right Action / Contact */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://wa.me/917070717794"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#2A2B28] bg-[#1C1B1B] text-white/80 hover:text-white hover:border-emerald-500 text-xs font-semibold transition"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden xl:inline">WhatsApp</span>
            </a>

            <Link href="/contact">
              <Button variant="primary" size="sm" className="rounded-full shadow-md shadow-[#663399]/20">
                <span>Get In Touch</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#1C1B1B] border border-[#2A2B28] text-white/80 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#2A2B28] bg-[#151414] px-4 pt-3 pb-6 space-y-3 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col space-y-1">
            {items
              .filter((it) => it.isEnabled)
              .sort((a, b) => a.order - b.order)
              .map((item) => {
                const isActive = pathname === item.url;
                const isExpanded = mobileExpandedId === item.id;

                if (item.isMegaMenu && item.megaMenuColumns && item.megaMenuColumns.length > 0) {
                  return (
                    <div key={item.id} className="space-y-1">
                      <button
                        onClick={() => setMobileExpandedId(isExpanded ? null : item.id)}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-between ${
                          isExpanded || isActive
                            ? 'bg-[#1C1B1B] text-[#D9F45F] border border-[#2A2B28]'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? 'rotate-180 text-[#D9F45F]' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="pl-4 pr-2 py-2 space-y-3 bg-[#1C1B1B]/40 rounded-xl border border-[#2A2B28]/50">
                          {item.megaMenuColumns.map((col, cIdx) => (
                            <div key={cIdx} className="space-y-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9F45F]/70 px-2">
                                {col.heading}
                              </span>
                              {col.links.map((link, lIdx) => (
                                <Link
                                  key={lIdx}
                                  href={link.url}
                                  className="block px-2 py-1.5 rounded text-xs text-white/80 hover:text-white hover:bg-white/[0.04]"
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-[#1C1B1B] text-[#D9F45F] border border-[#2A2B28]'
                        : 'text-white/80 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>

          <div className="pt-4 border-t border-[#2A2B28] flex flex-col gap-2.5">
            <a
              href="https://wa.me/917070717794"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#2A2B28] bg-[#1C1B1B] text-white text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Chat on WhatsApp (+91 7070717794)</span>
            </a>

            <Link href="/contact" className="w-full">
              <Button variant="primary" className="w-full rounded-xl">
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
