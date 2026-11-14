'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Menu,
  BookOpen,
  FolderTree,
  Tag,
  Briefcase,
  DollarSign,
  Building2,
  Image as ImageIcon,
  MessageSquare,
  Mail,
  Send,
  Search,
  Paintbrush,
  Settings,
  Users,
  History,
  Sparkles,
  HelpCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavGroup {
  label: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Activity Logs', href: '/admin/logs', icon: History },
    ],
  },
  {
    label: 'Content Management',
    items: [
      { label: 'Pages', href: '/admin/pages', icon: FileText },
      { label: 'Navigation', href: '/admin/navigation', icon: Menu },
      { label: 'Blog Posts', href: '/admin/blogs', icon: BookOpen },
      { label: 'Categories', href: '/admin/categories', icon: FolderTree },
      { label: 'Tags', href: '/admin/tags', icon: Tag },
    ],
  },
  {
    label: 'Services & Business',
    items: [
      { label: 'Services', href: '/admin/services', icon: Briefcase },
      { label: 'Pricing Plans', href: '/admin/pricing', icon: DollarSign },
      { label: 'Industries', href: '/admin/industries', icon: Building2 },
      { label: 'Portfolio', href: '/admin/portfolio', icon: Sparkles },
      { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
      { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    ],
  },
  {
    label: 'Assets & Inquiries',
    items: [
      { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
      { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare, badge: 'Leads' },
      { label: 'Newsletter', href: '/admin/newsletter', icon: Send },
      { label: 'Popups & Offers', href: '/admin/popups', icon: Sparkles },
    ],
  },
  {
    label: 'Configuration & Access',
    items: [
      { label: 'SEO Management', href: '/admin/seo', icon: Search },
      { label: 'Email Settings', href: '/admin/email', icon: Mail },
      { label: 'Theme & Branding', href: '/admin/theme', icon: Paintbrush },
      { label: 'General Settings', href: '/admin/settings', icon: Settings },
      { label: 'Users & Roles', href: '/admin/users', icon: Users },
    ],
  },
];

export interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#151414] border-r border-[#2A2B28] flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#2A2B28]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#663399] to-[#975dd1] flex items-center justify-center shadow-md shadow-[#663399]/30">
              <span className="font-bold text-white text-base">S</span>
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-sm block">
                Silwasa Admin
              </span>
              <span className="text-[10px] text-[#D9F45F] tracking-wider uppercase font-mono block">
                Enterprise CMS
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/50 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <h4 className="px-2 text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                {group.label}
              </h4>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group',
                      isActive
                        ? 'bg-[#663399]/20 text-white border-l-2 border-[#D9F45F] shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          'w-4 h-4 transition-colors',
                          isActive ? 'text-[#D9F45F]' : 'text-white/40 group-hover:text-white'
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-[#663399] text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Shortcut to Public Website */}
        <div className="p-4 border-t border-[#2A2B28]">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/[0.05] transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#D9F45F]" />
              View Live Website
            </span>
            <span className="text-[10px] text-white/40">↗</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
