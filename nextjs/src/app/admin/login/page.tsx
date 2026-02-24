'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/components/admin/AuthProvider';
import { Lock, User, KeyRound, Diamond, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, token, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push('/admin');
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(username, password);
      if (success) {
        router.push('/admin');
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || token) {
    return (
      <div className="min-h-screen bg-[var(--admin-bg)] flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--admin-gold)]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--admin-bg)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--admin-bg-raised)] border border-[var(--admin-border)] mb-6 shadow-xl relative group">
            <div className="absolute inset-0 bg-[var(--admin-gold-glow)] opacity-50 blur-xl rounded-full group-hover:opacity-100 transition-opacity"></div>
            <Diamond className="text-[var(--admin-gold)] relative z-10" size={40} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--admin-gold)] mb-2">Obsidian CMS</h1>
          <p className="text-[var(--admin-text-dim)] font-medium">Di&apos;aaru Luxury Diamonds Management</p>
        </div>

        <div className="admin-card overflow-hidden shadow-2xl border-[var(--admin-border)]">
          <div className="bg-[var(--admin-bg-raised)] px-8 py-6 border-b border-[var(--admin-border)]">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Lock size={18} className="text-[var(--admin-gold)]" />
              Admin Login
            </h2>
            <p className="text-sm text-[var(--admin-text-muted)] mt-1">Sign in with your admin credentials.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="text-xs font-bold text-[var(--admin-text-dim)] uppercase tracking-wider ml-1">
                Username
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-text-dim)] group-focus-within:text-[var(--admin-gold)] transition-colors" size={18} />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                  className="admin-input !pl-11 bg-[var(--admin-bg-input)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-bold text-[var(--admin-text-dim)] uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-text-dim)] group-focus-within:text-[var(--admin-gold)] transition-colors" size={18} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                  className="admin-input !pl-11 bg-[var(--admin-bg-input)]"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-[var(--admin-danger)] font-medium ml-1">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !username || !password}
              className="admin-btn admin-btn-primary w-full h-12 justify-center group"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="px-8 py-4 bg-[var(--admin-bg-raised)]/50 border-t border-[var(--admin-border)] text-center">
            <p className="text-[10px] text-[var(--admin-text-muted)] uppercase tracking-widest font-bold">
              Powered by Next.js &amp; Obsidian
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-xs text-[var(--admin-text-muted)]">
          Default credentials: admin / admin
        </p>
      </div>
    </div>
  );
}
