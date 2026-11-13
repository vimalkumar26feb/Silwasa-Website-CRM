'use client';

import React, { useEffect, useState, useRef } from 'react';
import { apiClient, ApiError } from '../../../lib/api';
import { MediaItem } from '@silwasa/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardContent } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  UploadCloud,
  Search,
  Grid,
  List,
  Copy,
  Trash2,
  Check,
  FileText,
  AlertCircle,
  ExternalLink,
  Info,
} from 'lucide-react';

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await apiClient<{ success: boolean; data: MediaItem[] }>('/admin/media', {
        params: {
          search: search || undefined,
          type: filterType || undefined,
        },
      });
      if (res.success && res.data) {
        setItems(res.data);
      }
    } catch {
      // Fallback empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [search, filterType]);

  const handleFileUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const formData = new FormData();
        formData.append('file', file);

        const token = sessionStorage.getItem('silwasa_token');
        const res = await fetch('http://localhost:5000/api/v1/admin/media/upload', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: 'include',
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'File upload failed');
        }
      }
      loadMedia();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete "${name}"?`)) return;

    try {
      await apiClient(`/admin/media/${id}`, { method: 'DELETE' });
      setSelectedItem(null);
      loadMedia();
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Failed to delete file';
      alert(msg);
    }
  };

  const handleSaveDetails = async (id: string, altText: string, title: string) => {
    try {
      await apiClient(`/admin/media/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ altText, title }),
      });
      setSelectedItem(null);
      loadMedia();
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Failed to update file details';
      alert(msg);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Media Asset Library</h1>
          <p className="text-xs text-white/50 mt-1">
            Upload, optimize, and organize images, branding logos, and document assets
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            multiple
            accept="image/*,application/pdf"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="accent"
            size="sm"
            isLoading={isUploading}
          >
            <UploadCloud className="w-4 h-4 mr-1.5" />
            Upload Assets
          </Button>
        </div>
      </div>

      {uploadError && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 flex items-center gap-3 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Drag and drop upload banner */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className="p-8 border-2 border-dashed border-[#2A2B28] hover:border-[#663399] rounded-2xl bg-[#1C1B1B]/40 hover:bg-[#663399]/5 transition flex flex-col items-center justify-center cursor-pointer text-center group"
      >
        <div className="w-12 h-12 rounded-xl bg-[#663399]/20 border border-[#663399]/40 flex items-center justify-center text-[#D9F45F] mb-3 group-hover:scale-105 transition">
          <UploadCloud className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-white">
          Drag and drop images or documents here, or click to browse
        </p>
        <p className="text-xs text-white/40 mt-1">
          Supports WebP, PNG, JPG, SVG, GIF, PDF up to 10 MB
        </p>
      </div>

      {/* Filter and View Mode Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search filename or alt text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#1C1B1B] border border-[#2A2B28] rounded-lg text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#663399]"
            />
          </div>

          <div className="flex items-center rounded-lg bg-[#1C1B1B] border border-[#2A2B28] p-0.5 text-xs">
            <button
              onClick={() => setFilterType('')}
              className={`px-3 py-1.5 rounded-md transition ${filterType === '' ? 'bg-[#663399] text-white' : 'text-white/60'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`px-3 py-1.5 rounded-md transition ${filterType === 'image' ? 'bg-[#663399] text-white' : 'text-white/60'}`}
            >
              Images
            </button>
            <button
              onClick={() => setFilterType('document')}
              className={`px-3 py-1.5 rounded-md transition ${filterType === 'document' ? 'bg-[#663399] text-white' : 'text-white/60'}`}
            >
              Docs
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-[#1C1B1B] border border-[#2A2B28] p-0.5 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-[#663399] text-white' : 'text-white/40'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-[#663399] text-white' : 'text-white/40'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid or List */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : items.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative rounded-xl border border-[#2A2B28] bg-[#1C1B1B] overflow-hidden cursor-pointer hover:border-[#663399] transition shadow-sm"
              >
                <div className="aspect-square bg-black/40 flex items-center justify-center overflow-hidden p-2">
                  {item.mimeType.startsWith('image/') ? (
                    <img
                      src={item.url}
                      alt={item.altText || item.originalName}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <FileText className="w-12 h-12 text-white/30" />
                  )}
                </div>
                <div className="p-2.5 border-t border-[#2A2B28]/60">
                  <p className="text-xs font-semibold text-white truncate">{item.originalName}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    {formatFileSize(item.sizeBytes)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-[#2A2B28]/60">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 flex items-center justify-between hover:bg-white/[0.02] transition"
                  >
                    <div
                      onClick={() => setSelectedItem(item)}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    >
                      <div className="w-12 h-12 rounded-lg bg-black/40 border border-[#2A2B28] overflow-hidden shrink-0 flex items-center justify-center p-1">
                        {item.mimeType.startsWith('image/') ? (
                          <img
                            src={item.url}
                            alt={item.originalName}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <FileText className="w-5 h-5 text-white/40" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{item.originalName}</p>
                        <p className="text-[10px] text-white/40">
                          {formatFileSize(item.sizeBytes)} • {item.mimeType}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleCopyUrl(item.url, item.id)}
                        variant="ghost"
                        size="sm"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id, item.originalName)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <div className="py-16 text-center text-white/40 text-xs">
          <UploadCloud className="w-10 h-10 mx-auto mb-2 text-white/20" />
          No media assets found matching the selected filters.
        </div>
      )}

      {/* Asset Detail & Edit Modal */}
      {selectedItem && (
        <Modal
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title="Media Asset Details"
          className="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="aspect-video max-h-72 w-full rounded-xl bg-black/50 border border-[#2A2B28] flex items-center justify-center overflow-hidden p-4">
              {selectedItem.mimeType.startsWith('image/') ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.altText || selectedItem.originalName}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <FileText className="w-16 h-16 text-white/40" />
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-black/30 text-xs border border-[#2A2B28]">
              <div>
                <span className="text-white/40 block text-[10px] uppercase">Size</span>
                <span className="text-white font-medium">{formatFileSize(selectedItem.sizeBytes)}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase">Format</span>
                <span className="text-white font-medium">{selectedItem.mimeType.split('/')[1] || selectedItem.mimeType}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase">Dimensions</span>
                <span className="text-white font-medium">{selectedItem.width ? `${selectedItem.width}x${selectedItem.height}` : 'N/A'}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase">Usage</span>
                <Badge variant={selectedItem.usageCount > 0 ? 'accent' : 'outline'} className="text-[9px]">
                  {selectedItem.usageCount} References
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase mb-1">
                  Public URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedItem.url}
                    className="flex-1 px-3 py-2 bg-[#151414] border border-[#2A2B28] rounded-md text-xs text-white/70 font-mono"
                  />
                  <Button
                    onClick={() => handleCopyUrl(selectedItem.url, selectedItem.id)}
                    variant="outline"
                    size="sm"
                  >
                    {copiedId === selectedItem.id ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const alt = (form.elements.namedItem('altText') as HTMLInputElement).value;
                  const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                  handleSaveDetails(selectedItem.id, alt, title);
                }}
                className="space-y-3 pt-2"
              >
                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase mb-1">
                    Alt Text (Accessibility &amp; SEO)
                  </label>
                  <input
                    type="text"
                    name="altText"
                    defaultValue={selectedItem.altText || ''}
                    placeholder="Describe image content for screen readers & search engines"
                    className="w-full px-3 py-2 bg-[#151414] border border-[#2A2B28] rounded-md text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase mb-1">
                    Asset Title / Caption
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedItem.title || ''}
                    placeholder="Internal reference title"
                    className="w-full px-3 py-2 bg-[#151414] border border-[#2A2B28] rounded-md text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#2A2B28]">
                  <Button
                    type="button"
                    onClick={() => handleDelete(selectedItem.id, selectedItem.originalName)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Delete Asset
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={() => setSelectedItem(null)}
                      variant="outline"
                      size="sm"
                    >
                      Close
                    </Button>
                    <Button type="submit" variant="primary" size="sm">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
