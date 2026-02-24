'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin/auth';
import DataTable from '@/components/admin/DataTable';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await adminFetch('/api/categories');
      if (res.ok) {
        const result = await res.json();
        setCategories(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this category? Articles in this category will be unassigned.')) return;

    try {
      const res = await adminFetch(`/api/categories/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCategories();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const columns = [
    {
      header: 'Icon',
      accessor: () => (
        <div className="w-10 h-10 rounded bg-[var(--admin-bg-raised)] flex items-center justify-center text-[var(--admin-gold)] border border-[var(--admin-border)]">
          <Tag size={18} />
        </div>
      ),
      className: 'w-16',
    },
    {
      header: 'Name',
      accessor: 'name',
      className: 'font-semibold',
    },
    {
      header: 'Slug',
      accessor: (cat: any) => (
        <code className="text-[10px] bg-[var(--admin-bg-raised)] px-2 py-1 rounded text-[var(--admin-gold-dim)]">
          {cat.slug}
        </code>
      ),
    },
    {
      header: 'Created At',
      accessor: (cat: any) => new Date(cat.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6 admin-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-[var(--admin-text-dim)]">Organize your articles and stories.</p>
        </div>
        <Link href="/admin/categories/new" className="admin-btn admin-btn-primary">
          <Plus size={18} />
          Add Category
        </Link>
      </div>

      <DataTable
        data={categories}
        columns={columns}
        isLoading={isLoading}
        onRowClick={(c: any) => router.push(`/admin/categories/${c.slug}`)}
        actions={(category: any) => (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/categories/${category.slug}`}
              className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-info)] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Edit size={16} />
            </Link>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(category.slug); }}
              className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-danger)] transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      {!isLoading && categories.length === 0 && (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <Tag size={24} />
          </div>
          <p className="text-lg font-semibold text-[var(--admin-text)] mb-3">No categories yet.</p>
          <p className="text-[var(--admin-text-dim)] mb-6">Organize your content with categories!</p>
          <Link href="/admin/categories/new" className="admin-btn admin-btn-primary">
            <Plus size={18} />
            Add Category
          </Link>
        </div>
      )}
    </div>
  );
}
