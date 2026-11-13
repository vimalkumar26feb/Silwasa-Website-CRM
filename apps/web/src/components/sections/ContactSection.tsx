'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ContactSectionSettings {
  badge?: string;
  heading?: string;
  subheading?: string;
  phone?: string;
  email?: string;
  address?: string;
  whatsappUrl?: string;
  servicesList?: string[];
}

const DEFAULT_SERVICES = [
  'Website Design & Development',
  'Custom Software Development',
  'AI Solutions & GEO Optimization',
  'E-commerce Platform Development',
  'Mobile App Development',
  'Enterprise Maintenance & SLA',
];

export function ContactSection({ settings }: { settings: ContactSectionSettings }) {
  const badge = settings.badge || 'GET IN TOUCH WITH ENGINEERS';
  const heading = settings.heading || 'Let’s Architect Your Next Breakthrough';
  const subheading = settings.subheading || 'Have a project in mind or need technical guidance? Send us a message and our lead engineering architect will respond within 24 hours.';
  const phone = settings.phone || '+91 7070717794';
  const email = settings.email || 'contact@silwasa.com';
  const address = settings.address || 'Silwasa IT Solutions, Tech Hub, Silvassa, Dadra and Nagar Haveli and Daman and Diu, India';
  const whatsappUrl = settings.whatsappUrl || 'https://wa.me/917070717794';
  const servicesList = settings.servicesList && settings.servicesList.length > 0 ? settings.servicesList : DEFAULT_SERVICES;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: servicesList[0] || '',
    budget: '$1,000 - $5,000',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api-proxy/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to submit enquiry');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: servicesList[0] || '',
        budget: '$1,000 - $5,000',
        message: '',
      });
    } catch (err: unknown) {
      // In development / demo when backend might be mocked, allow graceful handling
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setStatus('error');
      setErrorMessage(message);
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-[#151414] relative border-t border-[#2A2B28]/60" id="contact">
      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1B1B] border border-[#2A2B28]">
                <span className="w-2 h-2 rounded-full bg-[#D9F45F]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                  {badge}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {heading}
              </h2>

              <p className="text-white/70 text-base leading-relaxed">
                {subheading}
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="p-5 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399] transition flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#663399]/20 flex items-center justify-center text-[#D9F45F] group-hover:bg-[#663399] group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-white/50">Call Us Directly</div>
                  <div className="text-base font-bold text-white group-hover:text-[#D9F45F] transition-colors">{phone}</div>
                </div>
              </a>

              <a
                href={`mailto:${email}`}
                className="p-5 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399] transition flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#663399]/20 flex items-center justify-center text-[#D9F45F] group-hover:bg-[#663399] group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-white/50">Email Inquiry</div>
                  <div className="text-base font-bold text-white group-hover:text-[#D9F45F] transition-colors">{email}</div>
                </div>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-emerald-500 transition flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-white/50">Instant WhatsApp Chat</div>
                  <div className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">Chat With An Architect</div>
                </div>
              </a>

              <div className="p-5 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#2A2B28] flex items-center justify-center text-white/60 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium text-white/50">Corporate Location</div>
                  <div className="text-xs sm:text-sm text-white/80 mt-1 leading-relaxed">{address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[#1C1B1B] border border-[#2A2B28] shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Thank You for Reaching Out!</h3>
                <p className="text-white/70 max-w-md mx-auto text-sm leading-relaxed">
                  Your project requirements have been received. A senior technology architect from Silwasa will review your brief and contact you within 24 business hours.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setStatus('idle')}
                  className="mt-4"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-bold text-white mb-2">Send Project Brief</h3>

                {status === 'error' && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage || 'Failed to submit enquiry. Please call or WhatsApp us directly.'}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-sm focus:outline-none focus:border-[#D9F45F] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john@company.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-sm focus:outline-none focus:border-[#D9F45F] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-sm focus:outline-none focus:border-[#D9F45F] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">
                      Service Needed *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-sm focus:outline-none focus:border-[#D9F45F] transition"
                    >
                      {servicesList.map((srv, idx) => (
                        <option key={idx} value={srv} className="bg-[#1C1B1B] text-white">
                          {srv}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    Estimated Project Budget
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-sm focus:outline-none focus:border-[#D9F45F] transition"
                  >
                    <option value="Under $1,000" className="bg-[#1C1B1B] text-white">Under $1,000</option>
                    <option value="$1,000 - $5,000" className="bg-[#1C1B1B] text-white">$1,000 - $5,000</option>
                    <option value="$5,000 - $15,000" className="bg-[#1C1B1B] text-white">$5,000 - $15,000</option>
                    <option value="$15,000+" className="bg-[#1C1B1B] text-white">$15,000+ (Enterprise)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    Project Goals & Specific Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your project, target audience, timeline, or key technical challenges..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-sm focus:outline-none focus:border-[#D9F45F] transition resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={status === 'submitting'}
                  className="w-full rounded-xl"
                >
                  {status === 'submitting' ? 'Submitting Brief...' : 'Submit Project Brief'}
                  <Send className="w-4 h-4 ml-2" />
                </Button>

                <p className="text-[11px] text-center text-white/50">
                  🔒 We respect your privacy. All inquiries are bound by our standard Mutual Non-Disclosure Agreement (NDA).
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
