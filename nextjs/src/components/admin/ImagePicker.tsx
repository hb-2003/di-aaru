'use client';

import React, { useState, useEffect, useRef } from 'react';
import { adminFetch } from '@/lib/admin/auth';
import { Upload, X, Check, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImagePickerProps {
  label: string;
  value?: { url: string; publicId?: string } | string | null;
  onChange: (value: string | null) => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ label, value, onChange }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [libraryImages, setLibraryImages] = useState<any[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentImageUrl = typeof value === 'string' ? value : value?.url || '';

  useEffect(() => {
    if (modalOpen) {
      fetchLibraryImages();
    }
  }, [modalOpen]);

  const fetchLibraryImages = async () => {
    setLoadingLibrary(true);
    setError(null);
    try {
      const res = await adminFetch('/api/media');
      if (res.ok) {
        const result = await res.json();
        setLibraryImages(result.data || []);
      } else {
        setError('Failed to load media library.');
      }
    } catch (err) {
      console.error('Fetch media library error:', err);
      setError('An error occurred while fetching media.');
    } finally {
      setLoadingLibrary(false);
    }
  };

  const handleImageSelect = (image: any) => {
    onChange(image.url);
    setModalOpen(false);
  };

  const handleClearImage = () => {
    onChange(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await adminFetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const result = await res.json();
        onChange(result.data?.url || result.url);
        setModalOpen(false);
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-widest font-bold text-[var(--admin-text-muted)]">
        {label}
      </label>

      {currentImageUrl ? (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-[var(--admin-border)] mb-2 group">
          <img
            src={currentImageUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleClearImage}
              className="px-3 py-1.5 bg-red-500/30 hover:bg-red-500/50 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className="w-full h-28 rounded-lg border-2 border-dashed border-[var(--admin-border)] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[var(--admin-gold-dim)] hover:bg-[var(--admin-bg-hover)] transition-all"
          onClick={() => setModalOpen(true)}
        >
          <ImageIcon size={24} className="text-[var(--admin-text-muted)]" />
          <p className="text-xs text-[var(--admin-text-muted)]">Click to select an image</p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {error && (
        <p className="text-xs text-[var(--admin-danger)] mt-1">{error}</p>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setModalOpen(false)}>
          <div className="bg-[var(--admin-bg-card)] border border-[var(--admin-border)] rounded-2xl max-w-3xl w-[95%] max-h-[80vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--admin-border)]">
              <h3 className="font-semibold text-lg text-[var(--admin-text)]">Select Image</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="admin-btn admin-btn-primary !text-xs h-8"
                >
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  Upload New
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-[var(--admin-bg-hover)] text-[var(--admin-text-dim)]">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="p-5 overflow-y-auto max-h-[60vh] admin-scrollbar">
              {loadingLibrary ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 size={28} className="animate-spin text-[var(--admin-gold)]" />
                </div>
              ) : libraryImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-[var(--admin-text-muted)]">
                  <ImageIcon size={32} className="mb-2" />
                  <p className="text-sm">No images in library yet.</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="admin-btn admin-btn-secondary mt-3 !text-xs"
                  >
                    <Upload size={14} /> Upload your first image
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {libraryImages.map((image) => (
                    <div
                      key={image.id || image.publicId}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${currentImageUrl === image.url
                          ? 'border-[var(--admin-gold)] ring-2 ring-[var(--admin-gold-glow)]'
                          : 'border-transparent hover:border-[var(--admin-gold-dim)]'
                        }`}
                      onClick={() => handleImageSelect(image)}
                    >
                      <img
                        src={image.url}
                        alt={image.publicId || ''}
                        className="w-full h-full object-cover"
                      />
                      {currentImageUrl === image.url && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="w-8 h-8 rounded-full bg-[var(--admin-gold)] flex items-center justify-center">
                            <Check size={16} className="text-white" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-[9px] text-white/80 truncate font-mono">
                          {(image.publicId || '').split('/').pop()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePicker;
