'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { apiClient, ApiError } from '../../../lib/api';
import { User, UserRole } from '@silwasa/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Plus, Search, Shield, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserSchema } from '@silwasa/validation';
import { z } from 'zod';

type CreateUserFormValues = z.infer<typeof CreateUserSchema>;

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSuperAdmin = currentUser?.role === UserRole.SUPER_ADMIN;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: UserRole.ADMIN,
    },
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await apiClient<{ success: boolean; data: User[] }>('/admin/users', {
        params: search ? { search } : undefined,
      });
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Failed to fetch users';
      setActionError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  const handleCreateUser = async (data: CreateUserFormValues) => {
    try {
      setActionError(null);
      await apiClient('/admin/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setSuccessMessage(`User "${data.email}" created successfully.`);
      setIsModalOpen(false);
      reset();
      loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Failed to create user';
      setActionError(msg);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) return;

    try {
      setActionError(null);
      await apiClient(`/admin/users/${id}`, { method: 'DELETE' });
      setSuccessMessage(`User ${email} deleted successfully.`);
      loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Failed to delete user';
      setActionError(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Administrators &amp; Roles</h1>
          <p className="text-xs text-white/50 mt-1">
            Manage administrative personnel, roles, permissions, and security access
          </p>
        </div>

        {isSuperAdmin && (
          <Button onClick={() => setIsModalOpen(true)} variant="accent" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Administrator
          </Button>
        )}
      </div>

      {/* Notifications */}
      {actionError && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 flex items-center gap-3 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center gap-3 text-xs text-emerald-300">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Table Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#151414] border border-[#2A2B28] rounded-lg text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#663399]"
            />
          </div>
          <div className="text-xs text-white/40">
            {users.length} {users.length === 1 ? 'user' : 'users'} registered
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  {isSuperAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#663399]/40 border border-[#663399] flex items-center justify-center text-xs font-bold text-[#D9F45F]">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-xs">{u.name}</p>
                          <p className="text-[11px] text-white/50">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={u.role === UserRole.SUPER_ADMIN ? 'accent' : 'default'}
                        className="text-[10px]"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.isActive ? 'success' : 'destructive'} className="text-[10px]">
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-white/40">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                    {isSuperAdmin && (
                      <TableCell className="text-right">
                        {u.id !== currentUser?.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            className="p-1.5 rounded-md text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-white/40 text-xs">
              No administrators found.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Administrator"
        description="Create an administrative account with granular role permissions"
      >
        <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. John Doe"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. john@silwasa.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Initial Password"
            type="password"
            placeholder="At least 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-white/70 mb-1.5">
              Assigned Role
            </label>
            <select
              className="w-full px-3.5 py-2.5 rounded-md bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#663399]"
              {...register('role')}
            >
              <option value={UserRole.ADMIN}>ADMIN (Content, enquiries, media)</option>
              <option value={UserRole.EDITOR}>EDITOR (Blogs &amp; pages only)</option>
              <option value={UserRole.SEO_MANAGER}>SEO MANAGER (Metadata &amp; redirects)</option>
              <option value={UserRole.SUPER_ADMIN}>SUPER ADMIN (Full system access)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
              Create Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
