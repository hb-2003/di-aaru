'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search, User, ChevronRight, Sun, Moon } from 'lucide-react';
import { useAdminAuth } from './AuthProvider';
import { useAdminTheme } from './ThemeProvider';

export default function AdminHeader() {
  const pathname = usePathname();
  const { token } = useAdminAuth();
  const { theme, toggleTheme } = useAdminTheme();

  if (!token && pathname !== '/admin/login') return null;
  if (pathname === '/admin/login') return null;

  // Simple breadcrumbs logic
  const segments = pathname.split('/').filter(Boolean).slice(1);

  return (
    <header className="h-16 border-b border-[var(--admin-border)] bg-[var(--admin-bg)] px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-[var(--admin-text-dim)]">
          <span className="hover:text-[var(--admin-text)] transition-colors cursor-pointer">Admin</span>
          {segments.map((segment, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <ChevronRight size={14} className="text-[var(--admin-text-muted)]" />
              <span className={idx === segments.length - 1 ? "text-[var(--admin-text)] font-medium capitalize" : "hover:text-[var(--admin-text)] transition-colors cursor-pointer capitalize"}>
                {segment.replace(/-/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)] group-focus-within:text-[var(--admin-gold)] transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search content..."
            className="admin-input !pl-10 w-64 bg-[var(--admin-bg-raised)] border-transparent focus:bg-[var(--admin-bg-input)]"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-[var(--admin-text-dim)] hover:text-[var(--admin-gold)] hover:bg-[var(--admin-bg-hover)] transition-all duration-200"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2 rounded-lg text-[var(--admin-text-dim)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-bg-hover)] transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--admin-gold)] rounded-full border-2 border-[var(--admin-bg)]"></span>
        </button>

        <div className="h-8 w-px bg-[var(--admin-border)] mx-1"></div>

        <button className="flex items-center gap-3 p-1.5 rounded-full hover:bg-[var(--admin-bg-hover)] transition-colors">
          <div className="w-8 h-8 rounded-full bg-[var(--admin-gold-glow)] border border-[var(--admin-gold-dim)] flex items-center justify-center text-[var(--admin-gold)]">
            <User size={18} />
          </div>
          <div className="hidden lg:block text-left mr-2">
            <p className="text-xs font-semibold leading-none">Admin User</p>
            <p className="text-[10px] text-[var(--admin-text-dim)] leading-none mt-1">Super Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
}

