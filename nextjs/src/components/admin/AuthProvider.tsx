'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAdminToken, setAdminToken, removeAdminToken } from '@/lib/admin/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  useEffect(() => {
    const stored = getAdminToken();
    if (stored) {
      setToken(stored);
    }
    setIsLoading(false);
  }, []);

  // Redirect to login if not authenticated (except on the login page itself)
  useEffect(() => {
    if (!isLoading && !token && !window.location.pathname.startsWith('/admin/login')) {
      router.replace('/admin/login');
    }
  }, [isLoading, token, router]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const result = await res.json();
        const sessionToken = result.data?.token || `${username}:${Date.now()}`;
        setAdminToken(sessionToken);
        setToken(sessionToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    removeAdminToken();
    setToken(null);
    router.replace('/admin/login'); // Use replace instead of push for logout
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--admin-bg)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[var(--admin-gold)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--admin-text-dim)]">Loading...</p>
        </div>
      </div>
    );
  }

  // Immediately return null if not authenticated and not on the login page
  // This ensures no protected content is briefly shown after logout.
  if (!token && typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
    // Optionally, perform a hard redirect here if router.replace isn't fast enough
    // window.location.href = '/admin/login';
    return null;
  }


  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
