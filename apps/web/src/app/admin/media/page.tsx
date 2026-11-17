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
  Film,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [bulkSuccessMessage, setBulkSuccessMessage] = useState<string | null>(null);
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

  const handleToggleSelect = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((it) => it.id)));
    }
  };

  const handleBulkDelete = async () => {
    const count = selectedIds.size;
    if (count === 0) return;
    if (!confirm(`Permanently delete ${count} selected media asset${count === 1 ? '' : 's'}?`)) return;

    try {
      setIsBulkDeleting(true);
      const res = await apiClient<{
        success: boolean;
        data: { deletedCount: number; skippedCount: number };
        message: string;
      }>('/admin/media/bulk-delete', {
        method: 'POST',
        body: { ids: Array.from(selectedIds) },
      });
      setSelectedIds(new Set());
      setBulkSuccessMessage(res.message || `Deleted ${res.data.deletedCount} files.`);
      setTimeout(() => setBulkSuccessMessage(null), 4000);
      loadMedia();
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Bulk deletion failed';
      alert(msg);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete "${name}"?`)) return;

    try {
      await apiClient(`/admin/media/${id}`, { method: 'DELETE' });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
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
            accept="image/*,video/*,application/pdf"
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

      {bulkSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center gap-3 text-xs text-emerald-300">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{bulkSuccessMessage}</span>
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
          Drag and drop images, videos or documents here, or click to browse
        </p>
        <p className="text-xs text-white/40 mt-1">
          Supports WebP, PNG, JPG, SVG, GIF, MP4, WebM, MOV, PDF up to 100 MB
        </p>
      </div>

      {/* Filter and View Mode Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
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
              onClick={() => setFilterType('video')}
              className={`px-3 py-1.5 rounded-md transition ${filterType === 'video' ? 'bg-[#663399] text-white' : 'text-white/60'}`}
            >
              Videos
            </button>
            <button
              onClick={() => setFilterType('document')}
              className={`px-3 py-1.5 rounded-md transition ${filterType === 'document' ? 'bg-[#663399] text-white' : 'text-white/60'}`}
            >
              Docs
            </button>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2.5 py-1.5 rounded-lg border border-[#2A2B28] bg-[#1C1B1B] text-xs text-white/70 hover:text-white hover:border-[#663399] transition flex items-center gap-1.5"
            >
              {selectedIds.size === items.length ? (
                <CheckSquare className="w-3.5 h-3.5 text-[#D9F45F]" />
              ) : (
                <Square className="w-3.5 h-3.5 text-white/40" />
              )}
              <span>{selectedIds.size === items.length ? 'Deselect All' : 'Select All'}</span>
            </button>
          )}
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
                className={`group relative rounded-xl border bg-[#1C1B1B] overflow-hidden cursor-pointer transition shadow-sm ${
                  selectedIds.has(item.id)
                    ? 'border-[#D9F45F] ring-1 ring-[#D9F45F]/50'
                    : 'border-[#2A2B28] hover:border-[#663399]'
                }`}
              >
                {/* Selection Checkbox */}
                <button
                  type="button"
                  onClick={(e) => handleToggleSelect(item.id, e)}
                  className={`absolute top-2 left-2 z-10 w-5 h-5 rounded border flex items-center justify-center transition ${
                    selectedIds.has(item.id)
                      ? 'bg-[#663399] border-[#D9F45F] text-[#D9F45F]'
                      : 'bg-black/60 border-white/30 hover:border-white text-transparent group-hover:text-white/20'
                  }`}
                  title="Select for bulk action"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                <div className="aspect-square bg-black/40 flex items-center justify-center overflow-hidden p-2">
                  {item.mimeType.startsWith('image/') ? (
                    <img
                      src={item.url}
                      alt={item.altText || item.originalName}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                  ) : item.mimeType.startsWith('video/') ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/60 text-[#D9F45F]">
                      <Film className="w-10 h-10 mb-1 opacity-90 group-hover:scale-110 transition duration-300" />
                      <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-[#663399]/40 border border-[#663399]/60 text-white">
                        VIDEO
                      </span>
                    </div>
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
                    className={`p-3 flex items-center justify-between transition ${
                      selectedIds.has(item.id) ? 'bg-[#663399]/10' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => handleToggleSelect(item.id, e)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition shrink-0 ${
                          selectedIds.has(item.id)
                            ? 'bg-[#663399] border-[#D9F45F] text-[#D9F45F]'
                            : 'bg-black/40 border-white/30 hover:border-white text-transparent'
                        }`}
                        title="Select for bulk action"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>

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
                          ) : item.mimeType.startsWith('video/') ? (
                            <Film className="w-6 h-6 text-[#D9F45F]" />
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

      {/* Floating Sticky Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#1C1B1B]/95 backdrop-blur-md border border-[#663399]/60 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2 text-xs text-white">
            <span className="w-6 h-6 rounded-full bg-[#663399] flex items-center justify-center font-bold text-[#D9F45F]">
              {selectedIds.size}
            </span>
            <span>asset{selectedIds.size === 1 ? '' : 's'} selected</span>
          </div>

          <div className="h-4 w-px bg-white/20" />

          <Button
            onClick={handleSelectAll}
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-white/70 hover:text-white"
          >
            {selectedIds.size === items.length ? 'Deselect All' : 'Select All'}
          </Button>

          <Button
            onClick={handleBulkDelete}
            variant="primary"
            size="sm"
            disabled={isBulkDeleting}
            className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg shadow-red-900/30"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            {isBulkDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.size})`}
          </Button>
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
              ) : selectedItem.mimeType.startsWith('video/') ? (
                <video
                  src={selectedItem.url}
                  controls
                  className="max-h-full max-w-full rounded-lg"
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
