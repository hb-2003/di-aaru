'use client';

import React from 'react';

interface StatusBadgeProps {
  status: 'draft' | 'published' | 'active' | 'inactive' | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'published':
      case 'active':
        return 'bg-[var(--admin-success)]/10 text-[var(--admin-success)] border-[var(--admin-success)]/20';
      case 'draft':
      case 'inactive':
        return 'bg-[var(--admin-warning)]/10 text-[var(--admin-warning)] border-[var(--admin-warning)]/20';
      default:
        return 'bg-[var(--admin-bg-hover)] text-[var(--admin-text-dim)] border-[var(--admin-border)]';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${getStyles()}`}>
      {status || 'Unknown'}
    </span>
  );
}
