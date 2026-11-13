'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Skeleton } from '../../components/ui/Skeleton';

function AdminContentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage =
    pathname === '/admin/login' || pathname === '/admin/forgot-password';

  useEffect(() => {
    if (!loading) {
      if (!user && !isAuthPage) {
        router.push('/admin/login');
      } else if (user && isAuthPage) {
        router.push('/admin');
      }
    }
  }, [user, loading, isAuthPage, router]);

  // If visiting login or forgot-password, render without administrative shell
  if (isAuthPage) {
    return <div className="min-h-screen bg-[#151414] text-white">{children}</div>;
  }

  // Loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#151414] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#663399]/40 border border-[#663399] mx-auto animate-pulse flex items-center justify-center text-[#D9F45F] font-bold">
            S
          </div>
          <p className="text-xs uppercase tracking-widest text-white/50">
            Authenticating Silwasa Admin Session...
          </p>
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151414] text-white flex">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Pane */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminContentShell>{children}</AdminContentShell>
    </AuthProvider>
  );
}
