'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin/auth';
import DataTable from '@/components/admin/DataTable';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchAuthors = async () => {
    setIsLoading(true);
    try {
      const res = await adminFetch('/api/authors');
      if (res.ok) {
        const result = await res.json();
        setAuthors(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch authors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this author? This might affect articles assigned to them.')) return;

    try {
      const res = await adminFetch(`/api/authors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAuthors();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const columns = [
    {
      header: 'Avatar',
      accessor: (author: any) => (
        <div className="w-10 h-10 rounded-full bg-[var(--admin-bg-raised)] overflow-hidden border border-[var(--admin-border)]">
          {author.avatar?.url ? (
            <img src={author.avatar.url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--admin-text-muted)]">
              <User size={16} />
            </div>
          )}
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
      header: 'Bio',
      accessor: (author: any) => (
        <span className="text-sm text-[var(--admin-text-dim)] truncate max-w-xs block">
          {author.bio || 'No bio provided'}
        </span>
      ),
    },
    {
      header: 'Created At',
      accessor: (author: any) => new Date(author.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6 admin-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Authors</h1>
          <p className="text-[var(--admin-text-dim)]">Manage content creators and contributors.</p>
        </div>
        <Link href="/admin/authors/new" className="admin-btn admin-btn-primary">
          <Plus size={18} />
          Add Author
        </Link>
      </div>

      <DataTable
        data={authors}
        columns={columns}
        isLoading={isLoading}
        onRowClick={(a: any) => router.push(`/admin/authors/${a.id}`)}
        actions={(author: any) => (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/authors/${author.id}`}
              className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-info)] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Edit size={16} />
            </Link>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(author.id); }}
              className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-danger)] transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      {!isLoading && authors.length === 0 && (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <User size={24} />
          </div>
          <p className="text-lg font-semibold text-[var(--admin-text)] mb-3">No authors yet.</p>
          <p className="text-[var(--admin-text-dim)] mb-6">Add your first content creator!</p>
          <Link href="/admin/authors/new" className="admin-btn admin-btn-primary">
            <Plus size={18} />
            Add Author
          </Link>
        </div>
      )}
    </div>
  );
}
