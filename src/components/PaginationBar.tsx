import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { formatCompactNumber } from '../utils/formatters.ts';

interface PaginationBarProps {
  totalItems: number;
  pageSize: number;
  currentPage: number; // 1-indexed
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  itemLabel = 'numbers',
}) => {
  const [jumpValue, setJumpValue] = useState('');
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startRow = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endRow = Math.min(safePage * pageSize, totalItems);

  const pageNumbers: Array<number | 'ellipsis-left' | 'ellipsis-right'> = [];
  if (totalPages <= 7) {
    for (let p = 1; p <= totalPages; p++) pageNumbers.push(p);
  } else {
    pageNumbers.push(1);
    const windowStart = Math.max(2, safePage - 1);
    const windowEnd = Math.min(totalPages - 1, safePage + 1);

    if (windowStart > 2) {
      pageNumbers.push('ellipsis-left');
    }
    for (let p = windowStart; p <= windowEnd; p++) {
      pageNumbers.push(p);
    }
    if (windowEnd < totalPages - 1) {
      pageNumbers.push('ellipsis-right');
    }
    pageNumbers.push(totalPages);
  }

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpValue, 10);
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      onPageChange(parsed);
      setJumpValue('');
    }
  };

  return (
    <div className="min-h-10 shrink-0 bg-slate-50 border-t border-slate-200 px-2.5 sm:px-4 py-1.5 flex items-center justify-between gap-2 text-xs">
      <div className="font-mono tabular-nums text-slate-600 whitespace-nowrap truncate">
        <span className="font-semibold text-slate-900">{startRow.toLocaleString()}</span>–
        <span className="font-semibold text-slate-900">{endRow.toLocaleString()}</span>
        <span className="text-slate-400"> / </span>
        <span className="font-semibold text-slate-900 sm:hidden">
          {formatCompactNumber(totalItems)}
        </span>
        <span className="font-semibold text-slate-900 hidden sm:inline">
          {totalItems.toLocaleString()}
        </span>
        <span className="hidden md:inline"> {itemLabel}</span>
        <span className="hidden lg:inline text-slate-400"> · {pageSize}/page</span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={safePage <= 1}
          aria-label="First page"
          title="First page"
          className="h-7 w-7 inline-flex items-center justify-center text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded disabled:opacity-40 transition-colors cursor-pointer"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
          aria-label="Previous page"
          className="h-7 px-2 inline-flex items-center gap-1 font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded disabled:opacity-40 transition-colors whitespace-nowrap cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {pageNumbers.map((item) => {
            if (item === 'ellipsis-left' || item === 'ellipsis-right') {
              return (
                <span key={item} className="px-1 text-slate-400 font-mono">
                  …
                </span>
              );
            }
            const active = item === safePage;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={`h-7 min-w-7 px-1.5 font-mono tabular-nums rounded border transition-colors cursor-pointer ${
                  active
                    ? 'bg-sky-700 text-white border-sky-700 font-semibold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {item.toLocaleString()}
              </button>
            );
          })}
        </div>

        <span className="md:hidden font-mono tabular-nums text-[11px] text-slate-700 px-1">
          {safePage.toLocaleString()}/{formatCompactNumber(totalPages)}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= totalPages}
          aria-label="Next page"
          className="h-7 px-2 inline-flex items-center gap-1 font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded disabled:opacity-40 transition-colors whitespace-nowrap cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={safePage >= totalPages}
          aria-label="Last page"
          title="Last page"
          className="h-7 w-7 inline-flex items-center justify-center text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded disabled:opacity-40 transition-colors cursor-pointer"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>

        {totalPages > 7 && (
          <form onSubmit={handleJumpSubmit} className="hidden xl:flex items-center gap-1 ml-1">
            <input
              type="text"
              inputMode="numeric"
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value.replace(/\D/g, ''))}
              placeholder="Page #"
              aria-label="Jump to page number"
              className="w-16 h-7 px-2 text-xs font-mono bg-white border border-slate-300 rounded text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
            />
            <button
              type="submit"
              className="h-7 px-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded transition-colors cursor-pointer"
            >
              Go
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
