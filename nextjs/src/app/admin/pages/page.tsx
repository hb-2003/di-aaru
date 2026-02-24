'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin/auth';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { Plus, Edit, Trash2, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PagesListPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      const res = await adminFetch(`/api/pages?limit=${limit}&offset=${offset}`);
      if (res.ok) {
        const result = await res.json();
        setPages(result.data);
        setTotal(result.total);
      }
    } catch (err) {
      console.error('Failed to fetch pages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [page]);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const res = await adminFetch(`/api/pages/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPages();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

    const columns = [
    {
      header: 'Icon',
      accessor: () => (
        <div className="w-10 h-10 rounded bg-[var(--admin-bg-raised)] flex items-center justify-center text-[var(--admin-text-muted)] border border-[var(--admin-border)]">
          <FileText size={20} />
        </div>
      ),
      className: 'w-16',
    },
    {
      header: 'Title',
      accessor: (p: any) => (
        <div className="flex flex-col">
          <span className="font-semibold">{p.title}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (p: any) => <StatusBadge status={p.status} />,
    },
    {
      header: 'Sections',
      accessor: (p: any) => p.sections?.length || 0,
    },
    {
      header: 'Last Updated',
      accessor: (p: any) => new Date(p.updatedAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6 admin-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pages</h1>
          <p className="text-[var(--admin-text-dim)]">Manage your website's dynamic pages and content sections.</p>
        </div>
        <Link href="/admin/pages/new" className="admin-btn admin-btn-primary">
          <Plus size={18} />
          Create Page
        </Link>
      </div>

      <DataTable
        data={pages}
        columns={columns}
        isLoading={isLoading}
        totalCount={total}
        pageSize={10}
        currentPage={page}
        onPageChange={setPage}
        onSearch={setSearch}
        onRowClick={(p: any) => router.push(`/admin/pages/${p.slug}`)}
        actions={(p: any) => (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={p.slug === 'home' ? '/' : `/${p.slug}`}
              target="_blank"
              className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-gold)] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} />
            </Link>
            <Link
              href={`/admin/pages/${p.slug}`}
              className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-info)] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Edit size={16} />
            </Link>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(p.slug); }}
              className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-danger)] transition-colors"
              disabled={p.slug === 'home'}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />
    </div>
  );
}
