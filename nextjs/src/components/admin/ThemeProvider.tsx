'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function AdminThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('admin-theme') as Theme | null;
        if (stored === 'light' || stored === 'dark') {
            setThemeState(stored);
        }
        setMounted(true);
    }, []);

    const setTheme = (t: Theme) => {
        setThemeState(t);
        localStorage.setItem('admin-theme', t);
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Prevent flash of wrong theme
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            <div className={theme === 'light' ? 'admin-theme-light' : ''}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export function useAdminTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useAdminTheme must be used within AdminThemeProvider');
    return ctx;
}
