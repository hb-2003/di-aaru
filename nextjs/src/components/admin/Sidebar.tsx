'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FileText,
  Image as ImageIcon,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  Users,
  Tag,
  PenTool
} from 'lucide-react';
import { useState } from 'react';
import { useAdminAuth } from './AuthProvider';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Content Manager', isHeader: true },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Pages', href: '/admin/pages', icon: FileText },
  { label: 'Articles', href: '/admin/articles', icon: PenTool },
  { label: 'Authors', href: '/admin/authors', icon: Users },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'Single Types', isHeader: true },
  { label: 'About Page', href: '/admin/about', icon: Info },
  { label: 'Global Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { token, logout } = useAdminAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!token && pathname !== '/admin/login') return null;
  if (pathname === '/admin/login') return null;

  return (
    <aside
      className={cn(
        "bg-[var(--admin-sidebar)] border-r border-[var(--admin-border)] flex flex-col transition-all duration-300 relative z-40",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-[var(--admin-gold)] tracking-tight">DI'AARU</span>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-[var(--admin-bg-hover)] text-[var(--admin-text-dim)] hover:text-[var(--admin-text)] transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto admin-scrollbar">
        {navItems.map((item, idx) => {
          if (item.isHeader) {
            return !isCollapsed ? (
              <h3 key={idx} className="px-3 py-2 text-[10px] font-bold text-[var(--admin-text-muted)] uppercase tracking-widest mt-4">
                {item.label}
              </h3>
            ) : <div key={idx} className="h-px bg-[var(--admin-border)] my-4 mx-2" />;
          }

          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon!;

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-[var(--admin-gold-glow)] text-[var(--admin-gold)]"
                  : "text-[var(--admin-text-dim)] hover:bg-[var(--admin-sidebar-hover)] hover:text-[var(--admin-text)]"
              )}
            >
              <Icon size={20} className={cn(isActive ? "text-[var(--admin-gold)]" : "text-[var(--admin-text-muted)] group-hover:text-[var(--admin-text-dim)]")} />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}

              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--admin-gold)] rounded-r-full shadow-[0_0_10px_var(--admin-gold)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--admin-border)] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 text-[var(--admin-text-dim)] hover:text-[var(--admin-text)] transition-colors group"
        >
          <ExternalLink size={18} className="text-[var(--admin-text-muted)] group-hover:text-[var(--admin-text-dim)]" />
          {!isCollapsed && <span className="text-sm">Visit Website</span>}
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full text-[var(--admin-danger)] hover:bg-red-500/10 rounded-lg transition-colors group"
        >
          <LogOut size={18} className="text-[var(--admin-danger)]" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
