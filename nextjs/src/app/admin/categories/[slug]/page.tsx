'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminFetch } from '@/lib/admin/auth';
import FormField from '@/components/admin/FormField';
import {
  Save,
  Loader2,
  Check,
  AlertCircle,
  ArrowLeft,
  Tag,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

export default function CategoryEditorPage() {
  const { slug } = useParams();
  const router = useRouter();
  const isNew = slug === 'new';

  const [formData, setFormData] = useState<any>({
    name: '',
    slug: ''
  });
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isNew) {
      const fetchCategory = async () => {
        try {
          const res = await adminFetch(`/api/categories/${slug}`);
          if (res.ok) {
            const result = await res.json();
            setFormData(result.data);
          } else {
            setError('Failed to load category details');
          }
        } catch (err) {
          setError('An error occurred while fetching category');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCategory();
    }
  }, [slug, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess(false);

    try {
      const url = isNew ? '/api/categories' : `/api/categories/${slug}`;
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
          router.push(`/admin/categories/${result.data.slug}`);
        } else {
          setFormData(result.data);
          setTimeout(() => setSuccess(false), 3000);
        }
      } else {
        const result = await res.json();
        setError(result.error?.message || 'Failed to save category');
      }
    } catch (err) {
      setError('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (isNew) {
      const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData((prev: any) => ({ ...prev, name, slug: generatedSlug }));
    } else {
      setFormData((prev: any) => ({ ...prev, name }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-[var(--admin-gold)]" size={32} />
        <p className="text-[var(--admin-text-dim)]">Loading category details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto admin-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/categories"
            className="p-2 rounded-full hover:bg-[var(--admin-bg-hover)] text-[var(--admin-text-dim)] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{isNew ? 'Create New Category' : 'Edit Category'}</h1>
            <p className="text-[var(--admin-text-dim)]">
              {isNew ? 'Define a new taxonomy for your content.' : `Updating category: ${formData.name}`}
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="admin-btn admin-btn-primary min-w-[140px] justify-center"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Category</>}
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
          <p className="text-sm font-medium">Category saved successfully</p>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="font-semibold flex items-center gap-2">
            <Tag size={18} className="text-[var(--admin-gold)]" />
            Category Details
          </h3>
        </div>
        <div className="admin-card-body space-y-6">
          <FormField label="Category Name">
            <input
              name="name"
              value={formData.name || ''}
              onChange={handleNameChange}
              className="admin-input text-lg font-medium"
              placeholder="e.g. Press Release"
              required
            />
          </FormField>

          <FormField label="URL Slug" description="Automatically generated from name if new.">
            <input
              name="slug"
              value={formData.slug || ''}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="admin-input font-mono text-sm"
              placeholder="e.g. press-release"
              disabled={!isNew}
              required
            />
          </FormField>
        </div>
      </div>

      {!isNew && (
        <div className="admin-card border-[var(--admin-danger)]/20">
          <div className="admin-card-header">
            <h3 className="font-semibold text-[var(--admin-danger)]">Danger Zone</h3>
          </div>
          <div className="admin-card-body">
            <p className="text-xs text-[var(--admin-text-muted)] mb-4">
              Deleting this category will unassign all articles currently associated with it. This action cannot be undone.
            </p>
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to delete this category?')) {
                  const res = await adminFetch(`/api/categories/${slug}`, { method: 'DELETE' });
                  if (res.ok) router.push('/admin/categories');
                }
              }}
              className="admin-btn w-full justify-center border-[var(--admin-danger)]/30 text-[var(--admin-danger)] hover:bg-[var(--admin-danger)]/10"
            >
              <Trash2 size={16} /> Delete Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
