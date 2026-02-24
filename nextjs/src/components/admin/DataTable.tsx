'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react';

interface Column {
  header: string;
  accessor: string | ((item: any) => React.ReactNode);
  className?: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  isLoading?: boolean;
  totalCount?: number;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (search: string) => void;
  onRowClick?: (item: any) => void;
  actions?: (item: any) => React.ReactNode;
  bulkActions?: (selectedIds: string[]) => React.ReactNode;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  idAttribute?: string;
}

export default function DataTable({
  data,
  columns,
  isLoading,
  totalCount,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  onSearch,
  onRowClick,
  actions,
  bulkActions,
  selectedIds = [],
  onSelectionChange,
  idAttribute = 'id',
}: DataTableProps) {
  const pageCount = totalCount ? Math.ceil(totalCount / pageSize) : 0;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectionChange?.(data.map(item => item[idAttribute]));
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    e.stopPropagation();
    if (e.target.checked) {
      onSelectionChange?.([...selectedIds, id]);
    } else {
      onSelectionChange?.(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        {onSearch && (
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" size={18} />
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch(e.target.value)}
              className="admin-input pl-10 h-10"
            />
          </div>
        )}

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-[var(--admin-gold-glow)] border border-[var(--admin-gold-dim)] rounded-xl animate-in slide-in-from-top-2 duration-200">
            <span className="text-xs font-bold text-[var(--admin-gold)] uppercase tracking-wider">
              {selectedIds.length} Selected
            </span>
            <div className="h-4 w-px bg-[var(--admin-gold-dim)] mx-1" />
            <div id="bulk-actions-container" className="flex items-center gap-2">
              {bulkActions?.(selectedIds)}
            </div>
          </div>
        )}
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-bg-raised)]/50">
                {onSelectionChange && (
                  <th className="px-6 py-4 w-10">
                    <input
                      type="checkbox"
                      className="admin-checkbox"
                      checked={data.length > 0 && selectedIds.length === data.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[var(--admin-text-dim)] ${col.className || ''}`}
                  >
                    {col.header}
                  </th>
                ))}
                {actions && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0) + (onSelectionChange ? 1 : 0)} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin text-[var(--admin-gold)]" size={24} />
                      <span className="text-sm text-[var(--admin-text-muted)]">Loading data...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0) + (onSelectionChange ? 1 : 0)} className="px-6 py-12 text-center text-[var(--admin-text-muted)] text-sm">
                    No records found.
                  </td>
                </tr>
              ) : (
                data.map((item, rowIdx) => {
                  const id = item[idAttribute];
                  const isSelected = selectedIds.includes(id);

                  return (
                    <tr
                      key={rowIdx}
                      onClick={() => onRowClick?.(item)}
                      className={`group hover:bg-[var(--admin-bg-hover)] transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${isSelected ? 'bg-[var(--admin-gold-glow)]/30' : ''}`}
                    >
                      {onSelectionChange && (
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className="admin-checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectOne(e, id)}
                          />
                        </td>
                      )}
                      {columns.map((col, colIdx) => (
                      <td key={colIdx} className={`px-6 py-4 text-sm ${col.className || ''}`}>
                        {typeof col.accessor === 'function'
                          ? col.accessor(item)
                          : item[col.accessor]}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {actions(item)}
                      </td>
                    )}
                  </tr>
                )
              })
              )}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && onPageChange && (
          <div className="px-6 py-4 border-t border-[var(--admin-border)] flex items-center justify-between bg-[var(--admin-bg-raised)]/30">
            <span className="text-xs text-[var(--admin-text-dim)] font-mono">
              Page {currentPage} of {pageCount} ({totalCount} items)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-1.5 rounded-lg border border-[var(--admin-border)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--admin-bg-hover)] transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={currentPage === pageCount}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-1.5 rounded-lg border border-[var(--admin-border)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--admin-bg-hover)] transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
