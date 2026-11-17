'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, MessageCircle, ArrowUpRight, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [brandLogo, setBrandLogo] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('silwasa_brand_logo') || null;
    }
    return null;
  });
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function loadLogo() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/settings/public`);
        if (res.ok) {
          const data = await res.json();
          const logoUrl = data.data?.general?.logoUrl;
          if (logoUrl) {
            setBrandLogo(logoUrl);
            if (typeof window !== 'undefined') {
              localStorage.setItem('silwasa_brand_logo', logoUrl);
            }
          } else {
            setBrandLogo(null);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('silwasa_brand_logo');
            }
          }
        }
      } catch {
        // Fallback
      } finally {
        setSettingsLoaded(true);
      }
    }
    loadLogo();
  }, []);

  return (
    <footer className="bg-[#151414] border-t border-[#2A2B28] text-white/70">
      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-2 group min-h-[40px] min-w-[140px]">
              {brandLogo ? (
                <img
                  src={brandLogo}
                  alt="Silwasa IT Solutions"
                  className="h-10 w-auto max-w-[200px] object-contain rounded-lg"
                />
              ) : !settingsLoaded ? (
                <div className="h-10 w-36 rounded-lg bg-white/[0.04] animate-pulse" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#663399] to-[#8040bf] flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-[#663399]/20">
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
                </>
              )}
            </Link>

            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              Silwasa IT Solutions engineers high-performance web platforms, custom enterprise software, AI solutions, and Generative Engine Optimization (GEO) to accelerate business growth.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/917070717794"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-emerald-500 hover:text-emerald-400 flex items-center justify-center text-white/70 transition"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399] hover:text-white flex items-center justify-center text-white/70 transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399] hover:text-white flex items-center justify-center text-white/70 transition"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399] hover:text-white flex items-center justify-center text-white/70 transition"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#D9F45F] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#D9F45F] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/industries" className="hover:text-[#D9F45F] transition-colors">
                  Industries
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-[#D9F45F] transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="hover:text-[#D9F45F] transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#D9F45F] transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#D9F45F] transition-colors">
                  Blog & Insights
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D9F45F] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Core Expertise</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services/website-design-development" className="hover:text-[#D9F45F] transition-colors">
                  Website Design & Development
                </Link>
              </li>
              <li>
                <Link href="/services/custom-software-development" className="hover:text-[#D9F45F] transition-colors">
                  Custom Software Development
                </Link>
              </li>
              <li>
                <Link href="/services/ai-solutions-geo" className="hover:text-[#D9F45F] transition-colors">
                  Generative Engine Optimization (GEO)
                </Link>
              </li>
              <li>
                <Link href="/services/ecommerce-website-development" className="hover:text-[#D9F45F] transition-colors">
                  E-commerce Development
                </Link>
              </li>
              <li>
                <Link href="/services/mobile-app-development" className="hover:text-[#D9F45F] transition-colors">
                  Mobile Application Development
                </Link>
              </li>
              <li>
                <Link href="/services/seo-services" className="hover:text-[#D9F45F] transition-colors">
                  Technical SEO & Core Web Vitals
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Direct Contact</h4>
            <div className="space-y-3 text-sm">
              <a
                href="tel:+917070717794"
                className="flex items-center gap-2.5 text-white/80 hover:text-[#D9F45F] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D9F45F]" />
                <span>+91 7070717794</span>
              </a>

              <a
                href="mailto:contact@silwasa.com"
                className="flex items-center gap-2.5 text-white/80 hover:text-[#D9F45F] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#D9F45F]" />
                <span>contact@silwasa.com</span>
              </a>

              <div className="flex items-start gap-2.5 text-white/60 text-xs leading-relaxed pt-1">
                <MapPin className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                <span>Silwasa IT Solutions, Tech Hub, Silvassa, Dadra and Nagar Haveli and Daman and Diu, India</span>
              </div>

              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-[#D9F45F] transition-colors font-mono"
                >
                  <span>Admin CMS Access</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-14 pt-8 border-t border-[#2A2B28] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {currentYear} Silwasa IT Solutions. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
