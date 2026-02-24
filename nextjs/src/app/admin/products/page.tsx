'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/lib/admin/auth';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { Plus, Edit, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      const res = await adminFetch(`/api/products?limit=${limit}&offset=${offset}&sort=updatedAt:DESC`);
      if (res.ok) {
        const result = await res.json();
        setProducts(result.data);
        setTotal(result.total);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await adminFetch(`/api/products/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

    const columns = [
    {
      header: 'Image',
      accessor: (product: any) => (
        <div className="w-10 h-10 rounded bg-[var(--admin-bg-raised)] overflow-hidden border border-[var(--admin-border)]">
          {product.images?.[0]?.url ? (
            <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--admin-text-muted)]">
              <ImageIcon size={16} />
            </div>
          )}
        </div>
      ),
      className: 'w-16',
    },
    {
      header: 'Name',
      accessor: (product: any) => (
        <div className="flex flex-col">
          <span className="font-semibold">{product.name}</span>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'diamondType',
    },
    {
      header: 'Price',
      accessor: (product: any) => `$${product.price?.toLocaleString()}`,
    },
    {
      header: 'Status',
      accessor: (product: any) => <StatusBadge status={product.status} />,
    },
    {
      header: 'Featured',
      accessor: (product: any) => (
        <span className={product.featured ? "text-[var(--admin-gold)]" : "text-[var(--admin-text-muted)]"}>
          {product.featured ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 admin-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-[var(--admin-text-dim)]">Manage your luxury diamond catalog.</p>
        </div>
        <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <DataTable
        data={products}
        columns={columns}
        isLoading={isLoading}
        totalCount={total}
        pageSize={10}
        currentPage={page}
        onPageChange={setPage}
        onSearch={setSearch}
        onRowClick={(p: any) => router.push(`/admin/products/${p.slug}`)}
        actions={(product: any) => (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/products/${product.slug}`}
              target="_blank"
              className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-gold)] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} />
            </Link>
            <Link
              href={`/admin/products/${product.slug}`}
              className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-info)] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Edit size={16} />
            </Link>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(product.slug); }}
              className="p-1.5 text-[var(--admin-text-dim)] hover:text-[var(--admin-danger)] transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />
    </div>
  );
}
