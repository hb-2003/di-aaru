'use client';

import React from 'react';

interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export default function FormField({
  label,
  description,
  error,
  children,
  className = '',
  required = false,
}: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between px-0.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-dim)]">
          {label}{required && <span className="text-[var(--admin-danger)] ml-1">*</span>}
        </label>
        {error && <span className="text-[10px] text-[var(--admin-danger)] font-medium">{error}</span>}
      </div>
      {children}
      {description && !error && (
        <p className="text-[10px] text-[var(--admin-text-muted)] px-0.5 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
