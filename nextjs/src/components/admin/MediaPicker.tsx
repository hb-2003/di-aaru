'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin/auth';
import {
  Image as ImageIcon,
  Plus,
  X,
  Loader2,
  Search,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface Media {
  id: string;
  url: string;
  filename: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

interface MediaPickerProps {
  value: any;
  onChange: (media: any) => void;
  multiple?: boolean;
  label?: string;
}

export default function MediaPicker({ value, onChange, multiple = false, label }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selected, setSelected] = useState<any>(multiple ? (Array.isArray(value) ? value : []) : value);
  const [search, setSearch] = useState('');

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await adminFetch('/api/upload');
      if (res.ok) {
        const result = await res.json();
        setMediaList(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchMedia();
  }, [isOpen]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const res = await adminFetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        setMediaList(prev => [...(Array.isArray(result.data) ? result.data : [result.data]), ...prev]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelect = (item: Media) => {
    if (multiple) {
      const isSelected = selected.some((s: any) => s.id === item.id);
      if (isSelected) {
        setSelected(selected.filter((s: any) => s.id !== item.id));
      } else {
        setSelected([...selected, item]);
      }
    } else {
      setSelected(item);
    }
  };

  const handleConfirm = () => {
    onChange(selected);
    setIsOpen(false);
  };

  const removeMedia = (id: string) => {
    if (multiple) {
      onChange(value.filter((m: any) => m.id !== id));
    } else {
      onChange(null);
    }
  };

  const filteredMedia = mediaList.filter(m =>
    m.filename?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {label && <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--admin-text-dim)]">{label}</label>}

      <div className="flex flex-wrap gap-3">
        {multiple ? (
          <>
            {Array.isArray(value) && value.map((m: any) => (
              <div key={m.id} className="relative w-24 h-24 rounded-lg bg-[var(--admin-bg-raised)] border border-[var(--admin-border)] overflow-hidden group">
                <img src={m.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeMedia(m.id)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="w-24 h-24 rounded-lg border-2 border-dashed border-[var(--admin-border)] flex flex-col items-center justify-center text-[var(--admin-text-dim)] hover:border-[var(--admin-gold)] hover:text-[var(--admin-gold)] transition-all"
            >
              <Plus size={20} />
              <span className="text-[10px] font-bold uppercase mt-1">Add</span>
            </button>
          </>
        ) : (
          <div
            onClick={() => setIsOpen(true)}
            className="relative w-full aspect-video rounded-xl border-2 border-dashed border-[var(--admin-border)] bg-[var(--admin-bg-raised)]/30 overflow-hidden group cursor-pointer hover:border-[var(--admin-gold)] transition-all"
          >
            {value?.url ? (
              <>
                <img src={value.url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold uppercase tracking-widest">Change Media</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeMedia(value.id); }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-[var(--admin-danger)] transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[var(--admin-text-muted)] p-6">
                <ImageIcon size={32} className="mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest">Select Media</span>
                <p className="text-[10px] mt-2 text-center opacity-60">Upload or choose from library</p>
              </div>
            )}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--admin-bg-raised)] border border-[var(--admin-border)] w-full max-w-4xl max-h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--admin-border)] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Media Library</h3>
                <p className="text-xs text-[var(--admin-text-dim)]">Select assets for your content</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-[var(--admin-bg-hover)] rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 bg-[var(--admin-bg)] border-b border-[var(--admin-border)] flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" size={16} />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="admin-input pl-10 h-10 text-sm"
                />
              </div>
              <label className="admin-btn admin-btn-secondary h-10 cursor-pointer">
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Upload
                <input type="file" multiple className="hidden" onChange={handleUpload} disabled={isUploading} />
              </label>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {isLoading ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="animate-spin text-[var(--admin-gold)]" size={32} />
                  <span className="text-sm text-[var(--admin-text-dim)]">Fetching your assets...</span>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="col-span-full py-20 text-center text-[var(--admin-text-muted)]">
                  No media found in the library.
                </div>
              ) : (
                filteredMedia.map((item) => {
                  const isItemSelected = multiple
                    ? selected.some((s: any) => s.id === item.id)
                    : selected?.id === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer group ${
                        isItemSelected ? 'border-[var(--admin-gold)] ring-2 ring-[var(--admin-gold)]/20' : 'border-[var(--admin-border)] hover:border-[var(--admin-gold-dim)]'
                      }`}
                    >
                      <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[9px] text-white truncate font-mono">{item.filename}</p>
                      </div>
                      {isItemSelected && (
                        <div className="absolute top-2 right-2 text-[var(--admin-gold)]">
                          <CheckCircle2 size={18} fill="currentColor" className="text-[var(--admin-bg)]" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-6 py-4 border-t border-[var(--admin-border)] flex items-center justify-between bg-[var(--admin-bg-raised)]/50">
              <span className="text-xs text-[var(--admin-text-dim)] font-medium">
                {multiple
                  ? `${selected.length} items selected`
                  : selected ? '1 item selected' : 'No item selected'
                }
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selected && !multiple}
                  className="admin-btn admin-btn-primary"
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
