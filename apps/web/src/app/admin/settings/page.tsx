'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GeneralSettingsSchema } from '@silwasa/validation';
import { GeneralSettings } from '@silwasa/types';
import { apiClient, ApiError } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, UploadCloud, Image as ImageIcon } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GeneralSettings>({
    resolver: zodResolver(GeneralSettingsSchema),
    defaultValues: {
      siteName: '',
      siteTagline: '',
      siteUrl: '',
      businessName: '',
      businessDescription: '',
      contactEmail: '',
      contactPhone: '',
      whatsappNumber: '',
      businessAddress: '',
      copyrightText: '',
      timezone: 'Asia/Kolkata',
      defaultCurrency: 'INR',
      logoUrl: '',
      faviconUrl: '',
      socialLinks: [],
    },
  });

  const logoUrlVal = watch('logoUrl');
  const faviconUrlVal = watch('faviconUrl');

  const handleAssetUpload = async (file: File, field: 'logoUrl' | 'faviconUrl') => {
    try {
      if (field === 'logoUrl') setUploadingLogo(true);
      else setUploadingFavicon(true);

      const formData = new FormData();
      formData.append('file', file);
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('silwasa_token') : null;
      const res = await fetch('http://localhost:5000/api/v1/admin/media/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data?.url) {
          setValue(field, data.data.url, { shouldDirty: true });
        }
      }
    } catch {
      // Ignore or handle
    } finally {
      if (field === 'logoUrl') setUploadingLogo(false);
      else setUploadingFavicon(false);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await apiClient<{ success: boolean; data: GeneralSettings }>(
          '/admin/settings/general'
        );
        if (res.success && res.data) {
          reset(res.data);
        }
      } catch {
        // Fallback or defaults loaded
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [reset]);

  const onSubmit = async (data: GeneralSettings) => {
    try {
      setSaveError(null);
      setSaveSuccess(false);
      const res = await apiClient<{ success: boolean; data: GeneralSettings }>(
        '/admin/settings/general',
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Failed to save settings';
      setSaveError(msg);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">General Website Settings</h1>
          <p className="text-xs text-white/50 mt-1">
            Configure global business information, contact details, timezone, and social channels
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center gap-3 text-xs text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Global website settings updated successfully.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 flex items-center gap-3 text-xs text-red-300 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Card 1: Business Identity */}
        <Card>
          <CardHeader>
            <CardTitle>Website &amp; Business Identity</CardTitle>
            <CardDescription>Official business names and public digital identity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Site Name"
                placeholder="Silwasa IT Solutions"
                error={errors.siteName?.message}
                {...register('siteName')}
              />
              <Input
                label="Public Website URL"
                placeholder="https://silwasa.com"
                error={errors.siteUrl?.message}
                {...register('siteUrl')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tagline"
                placeholder="AI-Powered Web, Mobile & Enterprise Software Development"
                error={errors.siteTagline?.message}
                {...register('siteTagline')}
              />
              <Input
                label="Legal Business Name"
                placeholder="Silwasa IT Solutions Private Limited"
                error={errors.businessName?.message}
                {...register('businessName')}
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-white/70 mb-1.5">
                Business Description
              </label>
              <textarea
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-md bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] placeholder-white/30 focus:outline-none focus:border-[#663399]"
                placeholder="Premier digital technology agency..."
                {...register('businessDescription')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card: Brand Assets & Visual Identity */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Assets &amp; Visual Identity</CardTitle>
            <CardDescription>Upload or configure official site logo and browser favicon (siticon)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand Logo */}
              <div className="space-y-3 p-4 rounded-xl bg-[#151414] border border-[#2A2B28]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-white/90">
                    Primary Brand Logo
                  </label>
                  {uploadingLogo && (
                    <span className="text-[11px] text-[#D9F45F] animate-pulse">Uploading...</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-16 rounded-lg bg-[#1C1B1B] border border-[#2A2B28] flex items-center justify-center overflow-hidden shrink-0">
                    {logoUrlVal ? (
                      <img src={logoUrlVal} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-white/30" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="https://... or upload image"
                      className="w-full px-3 py-1.5 rounded-md bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#663399]"
                      {...register('logoUrl')}
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#663399]/20 hover:bg-[#663399]/30 text-white text-xs font-medium cursor-pointer border border-[#663399]/40 transition">
                      <UploadCloud className="w-3.5 h-3.5 text-[#D9F45F]" />
                      <span>Upload Logo File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAssetUpload(file, 'logoUrl');
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Brand Favicon (Siticon) */}
              <div className="space-y-3 p-4 rounded-xl bg-[#151414] border border-[#2A2B28]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-white/90">
                    Browser Favicon (Siticon)
                  </label>
                  {uploadingFavicon && (
                    <span className="text-[11px] text-[#D9F45F] animate-pulse">Uploading...</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#1C1B1B] border border-[#2A2B28] flex items-center justify-center overflow-hidden shrink-0">
                    {faviconUrlVal ? (
                      <img src={faviconUrlVal} alt="Favicon Preview" className="w-8 h-8 object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-white/30" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="https://... or upload .ico/.png"
                      className="w-full px-3 py-1.5 rounded-md bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#663399]"
                      {...register('faviconUrl')}
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#663399]/20 hover:bg-[#663399]/30 text-white text-xs font-medium cursor-pointer border border-[#663399]/40 transition">
                      <UploadCloud className="w-3.5 h-3.5 text-[#D9F45F]" />
                      <span>Upload Favicon File</span>
                      <input
                        type="file"
                        accept="image/x-icon,image/png,image/svg+xml"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAssetUpload(file, 'faviconUrl');
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Contact & Direct Channels */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information &amp; Direct Channels</CardTitle>
            <CardDescription>Inquiry routing emails, telephone numbers, and WhatsApp links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Contact Email"
                type="email"
                placeholder="contact@silwasa.com"
                error={errors.contactEmail?.message}
                {...register('contactEmail')}
              />
              <Input
                label="Phone Number"
                placeholder="+91 7070717794"
                error={errors.contactPhone?.message}
                {...register('contactPhone')}
              />
              <Input
                label="WhatsApp Number (with country code)"
                placeholder="+917070717794"
                error={errors.whatsappNumber?.message}
                {...register('whatsappNumber')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Headquarters Address"
                placeholder="Rohini, New Delhi, India"
                error={errors.businessAddress?.message}
                {...register('businessAddress')}
              />
              <Input
                label="Footer Copyright Text"
                placeholder="© 2026 Silwasa IT Solutions. All rights reserved."
                error={errors.copyrightText?.message}
                {...register('copyrightText')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card: Brand Assets & Visual Identity */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Assets &amp; Visual Identity</CardTitle>
            <CardDescription>Upload or configure official site logo and browser favicon (siticon)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand Logo */}
              <div className="space-y-3 p-4 rounded-xl bg-[#151414] border border-[#2A2B28]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-white/90">
                    Primary Brand Logo
                  </label>
                  {uploadingLogo && (
                    <span className="text-[11px] text-[#D9F45F] animate-pulse">Uploading...</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-16 rounded-lg bg-[#1C1B1B] border border-[#2A2B28] flex items-center justify-center overflow-hidden shrink-0">
                    {logoUrlVal ? (
                      <img src={logoUrlVal} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-white/30" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="https://... or upload image"
                      className="w-full px-3 py-1.5 rounded-md bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#663399]"
                      {...register('logoUrl')}
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#663399]/20 hover:bg-[#663399]/30 text-white text-xs font-medium cursor-pointer border border-[#663399]/40 transition">
                      <UploadCloud className="w-3.5 h-3.5 text-[#D9F45F]" />
                      <span>Upload Logo File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAssetUpload(file, 'logoUrl');
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Brand Favicon (Siticon) */}
              <div className="space-y-3 p-4 rounded-xl bg-[#151414] border border-[#2A2B28]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-white/90">
                    Browser Favicon (Siticon)
                  </label>
                  {uploadingFavicon && (
                    <span className="text-[11px] text-[#D9F45F] animate-pulse">Uploading...</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#1C1B1B] border border-[#2A2B28] flex items-center justify-center overflow-hidden shrink-0">
                    {faviconUrlVal ? (
                      <img src={faviconUrlVal} alt="Favicon Preview" className="w-8 h-8 object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-white/30" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="https://... or upload .ico/.png"
                      className="w-full px-3 py-1.5 rounded-md bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#663399]"
                      {...register('faviconUrl')}
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#663399]/20 hover:bg-[#663399]/30 text-white text-xs font-medium cursor-pointer border border-[#663399]/40 transition">
                      <UploadCloud className="w-3.5 h-3.5 text-[#D9F45F]" />
                      <span>Upload Favicon File</span>
                      <input
                        type="file"
                        accept="image/x-icon,image/png,image/svg+xml"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAssetUpload(file, 'faviconUrl');
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Regional & Social */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Social Media Channels</CardTitle>
              <CardDescription>Social profiles displayed across header and footer</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ platform: 'LinkedIn', url: 'https://' })}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Channel
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {fields.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Platform (e.g. LinkedIn, X)"
                  className="w-1/3 px-3 py-2 bg-[#151414] border border-[#2A2B28] rounded-md text-xs text-white"
                  {...register(`socialLinks.${idx}.platform`)}
                />
                <input
                  type="url"
                  placeholder="Profile URL"
                  className="flex-1 px-3 py-2 bg-[#151414] border border-[#2A2B28] rounded-md text-xs text-white"
                  {...register(`socialLinks.${idx}.url`)}
                />
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-md transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-xs text-white/40 py-2">No social channels configured.</p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="accent" size="lg" isLoading={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            Save &amp; Publish Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
