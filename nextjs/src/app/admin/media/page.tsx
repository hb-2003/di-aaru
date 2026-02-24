'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin/auth';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Search,
  Loader2,
  Grid,
  List,
  Download,
  ExternalLink,
  Plus
} from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';

export default function MediaLibraryPage() {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await adminFetch('/api/media');
      if (res.ok) {
        const result = await res.json();
        setMedia(result.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await adminFetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        fetchMedia();
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredMedia = media.filter((m: any) =>
    m.publicId.toLowerCase().includes(search.toLowerCase()) ||
    m.format.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 admin-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-[var(--admin-text-dim)]">Manage your images and assets stored on Cloudinary.</p>
        </div>
        <label className="admin-btn admin-btn-primary cursor-pointer">
          {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          Upload Asset
          <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
        </label>
      </div>

      <div className="flex items-center justify-between gap-4 p-4 admin-card">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" size={16} />
          <input
            type="text"
            placeholder="Search by name or format..."
            className="admin-input pl-10 bg-[var(--admin-bg-raised)] border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-[var(--admin-bg-raised)] rounded-lg border border-[var(--admin-border)]">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[var(--admin-bg-hover)] text-[var(--admin-gold)]' : 'text-[var(--admin-text-dim)] hover:text-[var(--admin-text)]'}`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[var(--admin-bg-hover)] text-[var(--admin-gold)]' : 'text-[var(--admin-text-dim)] hover:text-[var(--admin-text)]'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square admin-skeleton rounded-xl" />
          ))}
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="admin-empty admin-card bg-[var(--admin-bg-raised)]/20">
          <div className="admin-empty-icon"><ImageIcon size={32} /></div>
          <p className="text-lg font-semibold">No assets found</p>
          <p className="text-[var(--admin-text-dim)] mt-1">Upload your first image to get started.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((item: any) => (
            <div key={item.id} className="admin-card group relative aspect-square overflow-hidden hover:border-[var(--admin-gold-dim)] transition-all">
              <img src={item.url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                <div className="flex gap-2">
                  <a href={item.url} target="_blank" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                    <ExternalLink size={16} />
                  </a>
                  <button className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-[10px] font-mono text-white/80 truncate w-full text-center">{item.publicId.split('/').pop()}</p>
                <div className="flex gap-2 text-[9px] font-bold text-white/60 uppercase">
                  <span>{item.format}</span>
                  <span>{item.width}x{item.height}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="w-20">Preview</th>
                <th>Name / Public ID</th>
                <th>Format</th>
                <th>Dimensions</th>
                <th>Size</th>
                <th className="w-20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedia.map((item: any) => (
                <tr key={item.id}>
                  <td>
                    <div className="w-12 h-12 rounded bg-[var(--admin-bg-raised)] overflow-hidden border border-[var(--admin-border)]">
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-semibold truncate max-w-[200px]">{item.publicId.split('/').pop()}</span>
                      <span className="text-[10px] text-[var(--admin-text-dim)] font-mono truncate max-w-[200px]">{item.publicId}</span>
                    </div>
                  </td>
                  <td><span className="text-xs uppercase font-bold text-[var(--admin-text-muted)]">{item.format}</span></td>
                  <td><span className="text-xs text-[var(--admin-text-dim)]">{item.width} x {item.height} px</span></td>
                  <td><span className="text-xs text-[var(--admin-text-dim)]">{(item.bytes / 1024).toFixed(1)} KB</span></td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <a href={item.url} target="_blank" className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-gold)] transition-colors">
                        <ExternalLink size={16} />
                      </a>
                      <button className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-danger)] transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
