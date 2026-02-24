'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin/auth';
import {
  Package,
  FileText,
  Image as ImageIcon,
  TrendingUp,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/admin/StatusBadge';

interface Stats {
  counts: {
    products: { total: number; published: number };
    pages: { total: number; published: number };
    media: { total: number };
  };
  recent: {
    products: any[];
    pages: any[];
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminFetch('/api/admin/stats');
        if (res.ok) {
          const result = await res.json();
          setStats(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 admin-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 admin-skeleton rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 admin-skeleton rounded-xl" />
          <div className="h-96 admin-skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Products',
      value: stats?.counts.products.total || 0,
      subValue: `${stats?.counts.products.published || 0} published`,
      icon: Package,
      color: 'text-[var(--admin-gold)]',
      bg: 'bg-[var(--admin-gold-glow)]',
      href: '/admin/products'
    },
    {
      label: 'Pages',
      value: stats?.counts.pages.total || 0,
      subValue: `${stats?.counts.pages.published || 0} published`,
      icon: FileText,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      href: '/admin/pages'
    },
    {
      label: 'Media Assets',
      value: stats?.counts.media.total || 0,
      subValue: 'Cloudinary storage',
      icon: ImageIcon,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      href: '/admin/media'
    }
  ];

  return (
    <div className="space-y-8 admin-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Admin</h1>
          <p className="text-[var(--admin-text-dim)] mt-1">Here's what's happening with your store today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products/new" className="admin-btn admin-btn-secondary">
            <Plus size={18} />
            New Product
          </Link>
          <Link href="/admin/pages/new" className="admin-btn admin-btn-primary">
            <Plus size={18} />
            Create Page
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <Link key={idx} href={card.href} className="admin-card p-6 group hover:border-[var(--admin-gold-dim)] transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-widest">{card.label}</p>
                <h3 className="text-3xl font-bold mt-1 group-hover:text-[var(--admin-gold)] transition-colors">{card.value}</h3>
                <p className="text-sm text-[var(--admin-text-dim)] mt-1">{card.subValue}</p>
              </div>
              <div className={`${card.bg} ${card.color} p-3 rounded-xl`}>
                <card.icon size={24} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--admin-border)] flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-semibold text-[var(--admin-gold)]">View all {card.label.toLowerCase()}</span>
              <ArrowUpRight size={14} className="text-[var(--admin-gold)]" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock size={18} className="text-[var(--admin-text-muted)]" />
              Recent Products
            </h3>
            <Link href="/admin/products" className="text-xs font-bold text-[var(--admin-gold)] uppercase tracking-wider hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-[var(--admin-border)]">
            {stats?.recent.products.length === 0 ? (
              <div className="p-12 text-center text-[var(--admin-text-dim)]">No products found</div>
            ) : (
              stats?.recent.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.slug}`}
                  className="flex items-center gap-4 p-4 hover:bg-[var(--admin-bg-hover)] transition-colors group"
                >
                  <div className="w-12 h-12 rounded-lg bg-[var(--admin-bg-raised)] overflow-hidden border border-[var(--admin-border)]">
                    {product.images?.[0]?.url ? (
                      <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--admin-text-muted)]">
                        <Package size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate group-hover:text-[var(--admin-gold)] transition-colors">{product.name || 'Untitled Product'}</h4>
                    <p className="text-xs text-[var(--admin-text-dim)] mt-0.5">${product.price?.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge status={product.status} />
                    <span className="text-[10px] text-[var(--admin-text-muted)]">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-[var(--admin-text-muted)] group-hover:translate-x-1 transition-transform" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Pages */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText size={18} className="text-[var(--admin-text-muted)]" />
              Recent Pages
            </h3>
            <Link href="/admin/pages" className="text-xs font-bold text-[var(--admin-gold)] uppercase tracking-wider hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-[var(--admin-border)]">
            {stats?.recent.pages.length === 0 ? (
              <div className="p-12 text-center text-[var(--admin-text-dim)]">No pages found</div>
            ) : (
              stats?.recent.pages.map((page) => (
                <Link
                  key={page.id}
                  href={`/admin/pages/${page.slug}`}
                  className="flex items-center gap-4 p-4 hover:bg-[var(--admin-bg-hover)] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--admin-bg-raised)] flex items-center justify-center text-[var(--admin-text-muted)] border border-[var(--admin-border)] group-hover:text-[var(--admin-gold)] transition-colors">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate group-hover:text-[var(--admin-gold)] transition-colors">{page.title}</h4>
                    <p className="text-xs text-[var(--admin-text-dim)] mt-0.5">/{page.slug}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge status={page.status} />
                    <span className="text-[10px] text-[var(--admin-text-muted)]">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-[var(--admin-text-muted)] group-hover:translate-x-1 transition-transform" />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
