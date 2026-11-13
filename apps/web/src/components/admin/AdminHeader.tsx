'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, LogOut, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

export interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Generate readable title from pathname
  const segments = pathname.replace('/admin', '').split('/').filter(Boolean);
  const currentTitle = segments.length > 0
    ? segments[0].charAt(0).toUpperCase() + segments[0].slice(1).replace('-', ' ')
    : 'Dashboard';

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <header className="h-16 bg-[#151414] border-b border-[#2A2B28] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Area: Mobile Trigger + Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.05] lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-white/40">Admin</span>
          <span className="text-white/30">/</span>
          <span className="font-semibold text-white tracking-wide">{currentTitle}</span>
        </div>
      </div>

      {/* Right Area: User Profile & Actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-white/[0.05] transition"
            >
              <div className="w-8 h-8 rounded-full bg-[#663399]/40 border border-[#663399] flex items-center justify-center text-xs font-bold text-[#D9F45F]">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left text-xs">
                <span className="font-medium text-white block leading-tight">{user.name}</span>
                <span className="text-[10px] text-white/40 block leading-tight">{user.email}</span>
              </div>
              <Badge variant="accent" className="hidden sm:inline-flex text-[9px] py-0 px-1.5">
                {user.role}
              </Badge>
              <ChevronDown className="w-3.5 h-3.5 text-white/40" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[#2A2B28] bg-[#1C1B1B] text-white shadow-xl z-50 p-2 animate-in fade-in-50 zoom-in-95">
                  <div className="px-3 py-2 border-b border-[#2A2B28]/60 mb-1">
                    <p className="text-xs font-semibold text-white">{user.name}</p>
                    <p className="text-[10px] text-white/50 truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#D9F45F]">
                      <Shield className="w-3 h-3" />
                      <span>{user.role}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-xs text-white/50">Guest Mode</div>
        )}
      </div>
    </header>
  );
}
