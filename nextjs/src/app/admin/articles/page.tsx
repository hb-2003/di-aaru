'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin/auth';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { Plus, Edit, Trash2, ExternalLink, FileText, User, Tag, PenTool } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      // We populate author and category to show them in the table
      const res = await adminFetch(`/api/articles?pageSize=${limit}&page=${page}&sort=updatedAt:DESC&populate=author,category`);
      if (res.ok) {
        const result = await res.json();
        setArticles(result.data);
        setTotal(result.meta.pagination.total);
      }
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page]);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await adminFetch(`/api/articles/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        fetchArticles();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const columns = [
    {
      header: 'Title',
      accessor: (article: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-[var(--admin-text)] line-clamp-1">{article.title}</span>
          <span className="text-[10px] text-[var(--admin-text-dim)] font-mono">{article.slug}</span>
        </div>
      ),
      className: 'max-w-md',
    },
    {
      header: 'Author',
      accessor: (article: any) => (
        <div className="flex items-center gap-2 text-sm text-[var(--admin-text-dim)]">
          <User size={14} className="text-[var(--admin-gold-dim)]" />
          {article.author?.name || 'Unassigned'}
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (article: any) => (
        <div className="flex items-center gap-2 text-sm text-[var(--admin-text-dim)]">
          <Tag size={14} className="text-[var(--admin-gold-dim)]" />
          {article.category?.name || 'Uncategorized'}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (article: any) => <StatusBadge status={article.status} />,
    },
    {
      header: 'Updated At',
      accessor: (article: any) => new Date(article.updatedAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6 admin-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Articles</h1>
          <p className="text-[var(--admin-text-dim)]">Manage your blog posts, news, and brand stories.</p>
        </div>
        <Link href="/admin/articles/new" className="admin-btn admin-btn-primary">
          <Plus size={18} />
          Add Article
        </Link>
      </div>

      <DataTable
        data={articles}
        columns={columns}
        isLoading={isLoading}
        totalCount={total}
        pageSize={10}
        currentPage={page}
        onPageChange={setPage}
        onSearch={setSearch}
        onRowClick={(a: any) => router.push(`/admin/articles/${a.slug}`)}
        actions={(article: any) => (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/blog/${article.slug}`}
              target="_blank"
              className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-gold)] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} />
            </Link>
            <Link
              href={`/admin/articles/${article.slug}`}
              className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-info)] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Edit size={16} />
            </Link>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(article.slug); }}
              className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-danger)] transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      {!isLoading && articles.length === 0 && (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <PenTool size={24} />
          </div>
          <p className="text-lg font-semibold text-[var(--admin-text)] mb-3">No articles yet.</p>
          <p className="text-[var(--admin-text-dim)] mb-6">Create your first blog post!</p>
          <Link href="/admin/articles/new" className="admin-btn admin-btn-primary">
            <Plus size={18} />
            Create Article
          </Link>
        </div>
      )}
    </div>
  );
}
