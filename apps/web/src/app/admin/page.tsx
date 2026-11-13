'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api';
import {
  FileText,
  MessageSquare,
  BookOpen,
  Briefcase,
  Image as ImageIcon,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Plus,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Skeleton } from '../../components/ui/Skeleton';

interface DashboardData {
  metrics: {
    totalEnquiries: number;
    newEnquiries: number;
    totalPages: number;
    publishedPages: number;
    totalPosts: number;
    totalServices: number;
    totalMedia: number;
  };
  recentLogs: {
    id: string;
    userName: string;
    action: string;
    module: string;
    createdAt: string;
  }[];
  recentEnquiries: {
    id: string;
    enquiryId: string;
    name: string;
    email: string;
    service: string;
    status: string;
    createdAt: string;
  }[];
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await apiClient<{ success: boolean; data: DashboardData }>(
          '/admin/dashboard/stats'
        );
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch {
        // Fallback default structure
        setData({
          metrics: {
            totalEnquiries: 0,
            newEnquiries: 0,
            totalPages: 0,
            publishedPages: 0,
            totalPosts: 0,
            totalServices: 0,
            totalMedia: 0,
          },
          recentLogs: [],
          recentEnquiries: [],
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const metrics = data?.metrics || {
    totalEnquiries: 0,
    newEnquiries: 0,
    totalPages: 0,
    publishedPages: 0,
    totalPosts: 0,
    totalServices: 0,
    totalMedia: 0,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1C1B1B] via-[#211b2b] to-[#1C1B1B] border border-[#2A2B28] p-6 lg:p-8 relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#663399]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#663399]/30 border border-[#663399]/50 text-[#D9F45F] text-[11px] font-semibold tracking-wide uppercase mb-3">
              <Sparkles className="w-3 h-3" />
              Silwasa Enterprise Control Center
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Administrator'}
            </h1>
            <p className="text-sm text-white/60 mt-1 max-w-xl">
              Manage your dynamic website pages, service catalog, mega navigation, enquiries, and brand settings from one centralized console.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/pages">
              <Button variant="accent" size="md">
                <Plus className="w-4 h-4 mr-1.5" />
                New Page
              </Button>
            </Link>
            <Link href="/admin/enquiries">
              <Button variant="secondary" size="md">
                View Enquiries
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Enquiries */}
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Total Enquiries
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-extrabold text-white">
                  {loading ? <Skeleton className="h-8 w-16" /> : metrics.totalEnquiries}
                </span>
                {metrics.newEnquiries > 0 && (
                  <Badge variant="accent" className="text-[10px] py-0 px-1.5">
                    +{metrics.newEnquiries} New
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-white/40 mt-1">Direct website lead submissions</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#663399]/20 border border-[#663399]/40 flex items-center justify-center text-[#D9F45F]">
              <MessageSquare className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Pages */}
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Published Pages
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-extrabold text-white">
                  {loading ? <Skeleton className="h-8 w-16" /> : metrics.publishedPages}
                </span>
                <span className="text-xs text-white/40">/ {metrics.totalPages} Total</span>
              </div>
              <p className="text-[11px] text-white/40 mt-1">Live dynamic website routes</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#663399]/20 border border-[#663399]/40 flex items-center justify-center text-[#D9F45F]">
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Blog Posts */}
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Articles &amp; Insights
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-extrabold text-white">
                  {loading ? <Skeleton className="h-8 w-16" /> : metrics.totalPosts}
                </span>
              </div>
              <p className="text-[11px] text-white/40 mt-1">SEO-optimized articles</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#663399]/20 border border-[#663399]/40 flex items-center justify-center text-[#D9F45F]">
              <BookOpen className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Services */}
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Active Services
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-extrabold text-white">
                  {loading ? <Skeleton className="h-8 w-16" /> : metrics.totalServices}
                </span>
              </div>
              <p className="text-[11px] text-white/40 mt-1">Service catalog offerings</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#663399]/20 border border-[#663399]/40 flex items-center justify-center text-[#D9F45F]">
              <Briefcase className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Enquiries (Left) + Activity Audit Logs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Enquiries */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Client Enquiries</CardTitle>
                <CardDescription>Latest project inquiries submitted through public forms</CardDescription>
              </div>
              <Link href="/admin/enquiries">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 space-y-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : data?.recentEnquiries && data.recentEnquiries.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Received</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentEnquiries.map((enq) => (
                      <TableRow key={enq.id}>
                        <TableCell>
                          <div className="font-medium text-white">{enq.name}</div>
                          <div className="text-xs text-white/40">{enq.email}</div>
                        </TableCell>
                        <TableCell className="text-xs">{enq.service || 'General Quote'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              enq.status === 'NEW'
                                ? 'accent'
                                : enq.status === 'CONTACTED'
                                ? 'default'
                                : 'success'
                            }
                            className="text-[10px]"
                          >
                            {enq.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-white/50">
                          {new Date(enq.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center text-white/40 text-xs">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-white/20" />
                  No enquiries recorded yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Security & Activity Audit Log */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D9F45F]" />
                  Audit Trail
                </CardTitle>
                <CardDescription>Recent administrative activities</CardDescription>
              </div>
              <Link href="/admin/logs">
                <Button variant="ghost" size="sm" className="text-xs">
                  All Logs
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : data?.recentLogs && data.recentLogs.length > 0 ? (
                <div className="space-y-3">
                  {data.recentLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg bg-black/20 border border-[#2A2B28]/60 flex items-start justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-white block">{log.userName}</span>
                        <span className="text-[11px] text-white/60">
                          {log.action} in <span className="text-[#D9F45F] font-mono">{log.module}</span>
                        </span>
                      </div>
                      <span className="text-[10px] text-white/30 shrink-0 mt-0.5">
                        {new Date(log.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-white/40 text-xs">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-white/20" />
                  No activity events logged yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
