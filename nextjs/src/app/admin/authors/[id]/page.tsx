'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminFetch } from '@/lib/admin/auth';
import FormField from '@/components/admin/FormField';
import MediaPicker from '@/components/admin/MediaPicker';
import {
  Save,
  Loader2,
  Check,
  AlertCircle,
  ArrowLeft,
  User,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

export default function AuthorEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<any>({
    name: '',
    bio: '',
    avatar: null
  });
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isNew) {
      const fetchAuthor = async () => {
        try {
          const res = await adminFetch(`/api/authors/${id}`);
          if (res.ok) {
            const result = await res.json();
            setFormData(result.data);
          } else {
            setError('Failed to load author details');
          }
        } catch (err) {
          setError('An error occurred while fetching author');
        } finally {
          setIsLoading(false);
        }
      };
      fetchAuthor();
    }
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess(false);

    try {
      const url = isNew ? '/api/authors' : `/api/authors/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      });

      if (res.ok) {
        const result = await res.json();
        setSuccess(true);
        if (isNew) {
          router.push(`/admin/authors/${result.data.id}`);
        } else {
          setFormData(result.data);
          setTimeout(() => setSuccess(false), 3000);
        }
      } else {
        const result = await res.json();
        setError(result.error?.message || 'Failed to save author');
      }
    } catch (err) {
      setError('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-[var(--admin-gold)]" size={32} />
        <p className="text-[var(--admin-text-dim)]">Loading author details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto admin-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/authors"
            className="p-2 rounded-full hover:bg-[var(--admin-bg-hover)] text-[var(--admin-text-dim)] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{isNew ? 'Create New Author' : 'Edit Author'}</h1>
            <p className="text-[var(--admin-text-dim)]">
              {isNew ? 'Add a new content creator to the system.' : `Updating details for ${formData.name}`}
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="admin-btn admin-btn-primary min-w-[140px] justify-center"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Author</>}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-[var(--admin-danger)]">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-[var(--admin-success)]/10 border border-[var(--admin-success)]/20 rounded-xl flex items-center gap-3 text-[var(--admin-success)]">
          <Check size={20} />
          <p className="text-sm font-medium">Author saved successfully</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="font-semibold flex items-center gap-2">
                <User size={18} className="text-[var(--admin-gold)]" />
                Basic Information
              </h3>
            </div>
            <div className="admin-card-body space-y-6">
              <FormField label="Full Name">
                <input
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="admin-input text-lg font-medium"
                  placeholder="e.g. John Doe"
                  required
                />
              </FormField>

              <FormField label="Biography">
                <textarea
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleChange}
                  className="admin-input min-h-[150px] leading-relaxed"
                  placeholder="Tell us about this author..."
                />
              </FormField>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="font-semibold">Profile Picture</h3>
            </div>
            <div className="admin-card-body">
              <MediaPicker
                value={formData.avatar}
                onChange={(media) => setFormData({ ...formData, avatar: media })}
                label="Avatar Image"
              />
              <p className="mt-4 text-[10px] text-[var(--admin-text-muted)] uppercase tracking-wider text-center">
                Recommended: Square image, min 400x400px
              </p>
            </div>
          </div>

          {!isNew && (
            <div className="admin-card border-[var(--admin-danger)]/20">
              <div className="admin-card-header">
                <h3 className="font-semibold text-[var(--admin-danger)]">Danger Zone</h3>
              </div>
              <div className="admin-card-body">
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this author?')) {
                      const res = await adminFetch(`/api/authors/${id}`, { method: 'DELETE' });
                      if (res.ok) router.push('/admin/authors');
                    }
                  }}
                  className="admin-btn w-full justify-center border-[var(--admin-danger)]/30 text-[var(--admin-danger)] hover:bg-[var(--admin-danger)]/10"
                >
                  <Trash2 size={16} /> Delete Author
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
