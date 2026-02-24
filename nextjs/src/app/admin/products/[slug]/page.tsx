'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminFetch } from '@/lib/admin/auth';
import FormField from '@/components/admin/FormField';
import MediaPicker from '@/components/admin/MediaPicker';
import {
  ArrowLeft,
  Save,
  Trash2,
  ExternalLink,
  Loader2,
  Check,
  AlertCircle,
  Package,
  Diamond
} from 'lucide-react';
import Link from 'next/link';

export default function ProductEditor() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.slug === 'new';

  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    price: 0,
    diamondType: 'Lab Grown',
    carat: 0,
    shape: '',
    images: [],
    featured: false,
    isShow: true,
    status: 'draft'
  });

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isNew) {
      const fetchProduct = async () => {
        try {
          const res = await adminFetch(`/api/products/${params.slug}`);
          if (res.ok) {
            const result = await res.json();
            setFormData(result.data);
          } else {
            setError('Product not found');
          }
        } catch (err) {
          setError('Failed to fetch product');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [params.slug, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess(false);

    try {
      const url = isNew ? '/api/products' : `/api/products/${params.slug}`;
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
          router.push(`/admin/products/${result.data.slug}`);
        } else {
          setFormData(result.data);
        }
      } else {
        const result = await res.json();
        setError(result.error?.message || 'Failed to save product');
      }
    } catch (err) {
      setError('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : val
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="animate-spin text-[var(--admin-gold)]" size={32} />
        <p className="text-[var(--admin-text-dim)]">Loading product data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 admin-fade-in max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 rounded-lg bg-[var(--admin-bg-hover)] text-[var(--admin-text-dim)] hover:text-[var(--admin-text)] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{isNew ? 'New Product' : formData.name}</h1>
            <p className="text-[var(--admin-text-dim)]">{isNew ? 'Add a new diamond to your catalog' : `Editing product: ${formData.slug}`}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {!isNew && (
            <Link href={`/products/${formData.slug}`} target="_blank" className="admin-btn admin-btn-secondary">
              <ExternalLink size={18} />
              View Store
            </Link>
          )}
          <button type="submit" disabled={isSaving} className="admin-btn admin-btn-primary min-w-[120px] justify-center">
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
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
          <p className="text-sm font-medium">Product saved successfully</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="font-semibold">Basic Information</h3>
            </div>
            <div className="admin-card-body space-y-6">
              <FormField label="Product Name" required error={error && !formData.name ? 'Name is required' : ''}>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Round Brilliant Cut Diamond Engagement Ring"
                  className="admin-input"
                  required
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  placeholder="Write a detailed description of the diamond..."
                  className="admin-input min-h-[150px] resize-y"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Price ($)">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="admin-input"
                  />
                </FormField>
                <FormField label="Diamond Type">
                  <select
                    name="diamondType"
                    value={formData.diamondType}
                    onChange={handleChange}
                    className="admin-select"
                  >
                    <option value="Lab Grown">Lab Grown</option>
                    <option value="Natural">Natural</option>
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Carat Weight">
                  <input
                    type="number"
                    step="0.01"
                    name="carat"
                    value={formData.carat}
                    onChange={handleChange}
                    className="admin-input"
                  />
                </FormField>
                <FormField label="Shape">
                  <input
                    name="shape"
                    value={formData.shape || ''}
                    onChange={handleChange}
                    placeholder="e.g. Round, Princess, Oval"
                    className="admin-input"
                  />
                </FormField>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="font-semibold">Product Media</h3>
            </div>
            <div className="admin-card-body">
              <MediaPicker
                value={formData.images}
                onChange={(images) => setFormData((prev: any) => ({ ...prev, images }))}
                multiple
                label="Product Gallery"
              />
              <p className="mt-4 text-[11px] text-[var(--admin-text-muted)]">
                The first image will be used as the product cover. Recommended ratio: 1:1.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="font-semibold">Publishing</h3>
            </div>
            <div className="admin-card-body space-y-6">
              <FormField label="Status">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="admin-select"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </FormField>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--admin-bg-raised)] border border-[var(--admin-border)]">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Visibility</span>
                  <span className="text-[10px] text-[var(--admin-text-dim)]">Show on store listings</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((prev: any) => ({ ...prev, isShow: !prev.isShow }))}
                  className={`admin-toggle ${formData.isShow ? 'active' : ''}`}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--admin-bg-raised)] border border-[var(--admin-border)]">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Featured</span>
                  <span className="text-[10px] text-[var(--admin-text-dim)]">Highlight on home page</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((prev: any) => ({ ...prev, featured: !prev.featured }))}
                  className={`admin-toggle ${formData.featured ? 'active' : ''}`}
                />
              </div>
            </div>
          </div>

          {!isNew && (
            <div className="admin-card border-red-500/20">
              <div className="admin-card-header bg-red-500/5">
                <h3 className="font-semibold text-[var(--admin-danger)]">Danger Zone</h3>
              </div>
              <div className="admin-card-body">
                <p className="text-xs text-[var(--admin-text-dim)] mb-4">Deleting this product is permanent and cannot be undone.</p>
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm('Delete this product forever?')) {
                      const res = await adminFetch(`/api/products/${formData.slug}`, { method: 'DELETE' });
                      if (res.ok) router.push('/admin/products');
                    }
                  }}
                  className="admin-btn admin-btn-danger w-full justify-center"
                >
                  <Trash2 size={18} />
                  Delete Product
                </button>
              </div>
            </div>
          )}

          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="font-semibold">Metadata</h3>
            </div>
            <div className="admin-card-body text-xs space-y-2 text-[var(--admin-text-dim)]">
              <div className="flex justify-between">
                <span>Created:</span>
                <span className="text-[var(--admin-text)] font-medium">
                  {formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : 'New'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Modified:</span>
                <span className="text-[var(--admin-text)] font-medium">
                  {formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : 'Never'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>ID:</span>
                <span className="font-mono text-[10px] truncate ml-2">{formData.id || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
