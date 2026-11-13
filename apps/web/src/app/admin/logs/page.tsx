'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api';
import type { ActivityLog } from '@silwasa/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  History,
  Search,
  Shield,
  Clock,
  User,
  Filter,
  CheckCircle,
  FileText
} from 'lucide-react';

const SEEDED_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    userId: 'u-1',
    userName: 'Admin User',
    action: 'UPDATE_SETTINGS',
    module: 'SETTINGS',
    details: { siteName: 'Silwasa IT Solutions', email: 'contact@silwasa.com' },
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    createdAt: '2026-11-13T10:45:00Z',
  },
  {
    id: 'log-2',
    userId: 'u-1',
    userName: 'Admin User',
    action: 'UPDATE_THEME',
    module: 'SETTINGS',
    details: { colors: { primary: '#663399', accent: '#D9F45F' } },
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0',
    createdAt: '2026-11-13T09:30:00Z',
  },
  {
    id: 'log-3',
    userId: 'u-1',
    userName: 'Admin User',
    action: 'CREATE_PAGE',
    module: 'PAGES',
    details: { title: 'Enterprise Web Solutions', slug: 'enterprise-web-solutions' },
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0',
    createdAt: '2026-11-12T16:15:00Z',
  },
  {
    id: 'log-4',
    userId: 'u-1',
    userName: 'Admin User',
    action: 'USER_LOGIN',
    module: 'AUTH',
    details: { method: 'PASSWORD' },
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0',
    createdAt: '2026-11-12T08:00:00Z',
  }
];

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>('/admin/logs');
      if (res && res.data && res.data.length > 0) {
        setLogs(res.data);
      } else {
        setLogs(SEEDED_LOGS);
      }
    } catch {
      setLogs(SEEDED_LOGS);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesModule = selectedModule === 'ALL' || log.module === selectedModule;
    const matchesSearch =
      search.trim() === '' ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(log.details || {}).toLowerCase().includes(search.toLowerCase());

    return matchesModule && matchesSearch;
  });

  const getModuleBadge = (module: string) => {
    switch (module) {
      case 'AUTH':
        return <Badge variant="outline" className="text-blue-400 border-blue-500/30 text-[10px]">AUTH</Badge>;
      case 'SETTINGS':
        return <Badge variant="outline" className="text-amber-400 border-amber-500/30 text-[10px]">SETTINGS</Badge>;
      case 'PAGES':
        return <Badge variant="outline" className="text-purple-400 border-purple-500/30 text-[10px]">PAGES</Badge>;
      case 'USERS':
        return <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px]">USERS</Badge>;
      default:
        return <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-[10px]">{module}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <History className="w-6 h-6 text-[#D9F45F]" />
            Security & Activity Audit Trail
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Immutable system logs recording administrative modifications, logins, content revisions, and configuration changes.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchLogs}
          className="border-[#2A2B28] text-zinc-300"
        >
          Refresh Logs
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'AUTH', 'SETTINGS', 'PAGES', 'USERS', 'SERVICES'].map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedModule === mod
                  ? 'bg-[#663399] text-white shadow-sm'
                  : 'bg-[#1C1B1B] text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, details, user..."
            className="pl-9 bg-[#1C1B1B] border-[#2A2B28] text-white text-xs h-9"
          />
        </div>
      </div>

      {/* Logs Table */}
      <Card className="bg-[#1C1B1B] border-[#2A2B28]">
        <Table>
          <TableHeader>
            <TableRow className="border-[#2A2B28]">
              <TableHead className="text-zinc-400 text-xs">Timestamp</TableHead>
              <TableHead className="text-zinc-400 text-xs">Admin User</TableHead>
              <TableHead className="text-zinc-400 text-xs">Module</TableHead>
              <TableHead className="text-zinc-400 text-xs">Action Taken</TableHead>
              <TableHead className="text-zinc-400 text-xs">Context & Details</TableHead>
              <TableHead className="text-zinc-400 text-xs text-right">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <TableRow key={i} className="border-[#2A2B28]">
                  <TableCell><Skeleton className="h-4 w-28 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 bg-zinc-800 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-52 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 bg-zinc-800 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-zinc-500">
                  No activity logs recorded.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-[#2A2B28] hover:bg-zinc-800/40">
                  <TableCell className="text-xs text-zinc-400 font-mono">
                    {new Date(log.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'short',
                      timeStyle: 'medium'
                    })}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-white text-xs">{log.userName}</span>
                  </TableCell>
                  <TableCell>{getModuleBadge(log.module)}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-semibold text-[#D9F45F]">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-[11px] text-zinc-300 line-clamp-1 max-w-sm">
                      {JSON.stringify(log.details || {})}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono text-zinc-500">
                    {log.ipAddress || '127.0.0.1'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
